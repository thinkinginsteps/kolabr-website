#!/usr/bin/env bash
# Kolabr content rebuild.
#
# Publishing from the back office changes a file in /opt/kolabr/content. The site is generated at
# build time, so the change is invisible until the site is rebuilt: that is what this does.
#
# It is NOT a deploy. No package, no npm ci, no file swap: the same code, built again against the
# current content. That takes seconds rather than minutes.
#
# It follows the same three rules as deploy.sh, for the same reasons:
#
#   1. THE SITE IS NEVER DOWN FOR LONGER THAN A SWAP. The build writes to a separate directory
#      while the current one keeps serving, and the service is stopped only to rename two
#      directories and start again. A failed build never takes the site down.
#   2. IT NEVER LEAVES THE SERVICE STOPPED. Every exit path ends by making sure it is running.
#   3. IT STAYS OUT OF THE WAY OF EVERYTHING ELSE ON THE BOX: a disk check first, and a CPU and
#      memory ceiling on the build.
#
# Like deploy.sh it re-execs into a transient systemd unit, because it restarts the service that
# launched it, and it reports through the same status files the back office polls.
#
# Usage: rebuild.sh [--deploy-id ID] [--foreground] [--help]

set -euo pipefail

PREFIX="${KOLABR_PREFIX:-/opt/kolabr}"
APP_ROOT="$PREFIX/app"
STATE_ROOT="$PREFIX/state"
CONTENT_ROOT="$PREFIX/content"
SERVICE_NAME="${KOLABR_SERVICE:-kolabr}"
SERVICE_USER="${KOLABR_USER:-kolabr}"
LOCK_FILE="$PREFIX/.deploy.lock"
LOG_DIR="${DEPLOY_LOG_DIR:-$PREFIX/deploy-logs}"
SERVICE_URL="${KOLABR_URL:-http://127.0.0.1:3000}"
BUILD_DIR=".next-build"
LIVE_BUILD="$APP_ROOT/.next"
PREVIOUS_BUILD="$APP_ROOT/.next.previous"
# A rebuild writes one more copy of .next, which is far smaller than a deploy's node_modules.
MIN_FREE_MB="${REBUILD_MIN_FREE_MB:-1000}"
BUILD_CPU_QUOTA="${DEPLOY_CPU_QUOTA:-70%}"
BUILD_MEMORY_MAX="${DEPLOY_MEMORY_MAX:-3G}"

REBUILD_UNIT="kolabr-rebuild.service"
SELF="$(readlink -f "$0")"

FOREGROUND=0
DEPLOY_ID="${DEPLOY_ID:-}"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --foreground) FOREGROUND=1; shift ;;
    --deploy-id) DEPLOY_ID="${2:-}"; shift 2 ;;
    --help|-h) sed -n '2,22p' "$SELF"; exit 0 ;;
    *) echo "unknown option: $1" >&2; exit 2 ;;
  esac
done

if [[ ! "$DEPLOY_ID" =~ ^[A-Za-z0-9._-]{1,64}$ ]]; then
  DEPLOY_ID="rebuild-$(date +%Y%m%d-%H%M%S)"
fi

WATCH_SECONDS="${DEPLOY_WATCH_SECONDS:-25}"
[[ "$WATCH_SECONDS" -lt 5 ]] && WATCH_SECONDS=5

mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/$DEPLOY_ID.log"
STATE_FILE="$LOG_DIR/$DEPLOY_ID.json"

if [[ "$FOREGROUND" -eq 0 && -z "${DEPLOY_DETACHED:-}" ]]; then
  echo "deploy-id: $DEPLOY_ID"
  systemd-run --unit="$REBUILD_UNIT" --collect --quiet \
    --property="CPUQuota=$BUILD_CPU_QUOTA" \
    --property="MemoryMax=$BUILD_MEMORY_MAX" \
    --property="Nice=10" \
    --property="IOWeight=50" \
    --setenv=DEPLOY_DETACHED=1 --setenv=DEPLOY_LOG_DIR="$LOG_DIR" \
    -- "$SELF" --deploy-id "$DEPLOY_ID" --foreground
  echo "started in $REBUILD_UNIT; follow $LOG_FILE"
  exit 0
fi

# Straight to the file, never through a tee: a killed rebuild would take the tee with it and then
# die of SIGPIPE in its own exit handler, with the site stopped. See the same note in deploy.sh.
if [[ -t 1 ]]; then echo "logging to $LOG_FILE (tail -f it to watch)"; fi
trap '' PIPE
exec >> "$LOG_FILE" 2>&1

STARTED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
CURRENT_STEP="queued"
TERMINAL_WRITTEN=0
ROLLED_BACK="false"

json_escape() { printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'; }

write_state() {
  local status="$1" step="$2" message="$3" exit_code="${4:-0}"
  local tmp="$STATE_FILE.tmp.$$"
  cat > "$tmp" <<JSON
{
  "id": "$DEPLOY_ID",
  "status": "$status",
  "step": "$step",
  "message": "$(json_escape "$message")",
  "startedAt": "$STARTED_AT",
  "updatedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "exitCode": $exit_code,
  "rolledBack": $ROLLED_BACK
}
JSON
  mv -f "$tmp" "$STATE_FILE"
  [[ "$status" == "succeeded" || "$status" == "failed" ]] && TERMINAL_WRITTEN=1
  return 0
}

step() {
  CURRENT_STEP="$1"
  echo "--- $1: $2"
  write_state running "$1" "$2"
}

service_healthy() {
  systemctl is-active "$SERVICE_NAME" >/dev/null 2>&1 && curl -fsS -o /dev/null --max-time 5 "$SERVICE_URL"
}

# Rule 2. The swap is two renames; a kill between them leaves no .next at all, so put one back
# before starting anything.
ensure_running() {
  if [[ ! -d "$LIVE_BUILD" ]]; then
    if [[ -d "$PREVIOUS_BUILD" ]]; then
      echo "no .next: the swap was interrupted. Putting the previous build back." >&2
      mv "$PREVIOUS_BUILD" "$LIVE_BUILD"
      ROLLED_BACK="true"
    elif [[ -d "$APP_ROOT/$BUILD_DIR" ]]; then
      echo "no .next: the swap was interrupted. Completing it with the new build." >&2
      mv "$APP_ROOT/$BUILD_DIR" "$LIVE_BUILD"
    fi
  fi
  systemctl is-active "$SERVICE_NAME" >/dev/null 2>&1 && return 0
  echo "service is not running; starting it" >&2
  systemctl start "$SERVICE_NAME" || true
  for _ in $(seq 1 15); do
    systemctl is-active "$SERVICE_NAME" >/dev/null 2>&1 && return 0
    sleep 1
  done
  echo "COULD NOT START $SERVICE_NAME. The site is down and needs a person." >&2
  return 1
}

echo "=== Kolabr rebuild $DEPLOY_ID ==="

MAIN_PID=$$

on_exit() {
  local code=$?
  # Bash runs an inherited EXIT trap in forked subshells too; only the main shell ends the run.
  [[ -n "${BASHPID:-}" && "${BASHPID:-}" != "$MAIN_PID" ]] && return 0
  CURRENT_STEP="$(sed -n 's/.*"step": "\([^"]*\)".*/\1/p' "$STATE_FILE" 2>/dev/null | tail -1 || true)"
  [[ -z "$CURRENT_STEP" ]] && CURRENT_STEP="queued"
  local up=0
  ensure_running && up=1
  if [[ "$up" -eq 0 ]]; then
    write_state failed "$CURRENT_STEP" "rebuild ended with the site DOWN: could not start $SERVICE_NAME" "$code"
    return
  fi
  if [[ "$TERMINAL_WRITTEN" -eq 0 ]]; then
    echo "rebuild terminated unexpectedly during '$CURRENT_STEP' (exit $code); the site is running" >&2
    write_state failed "$CURRENT_STEP" "terminated unexpectedly during '$CURRENT_STEP' (exit $code); the site is running" "$code"
  fi
}
trap on_exit EXIT
trap 'echo "rebuild interrupted by a signal" >&2; exit 143' INT TERM HUP

# The same lock a deploy takes: a rebuild during a deploy would build half-replaced files.
step lock "acquiring the deploy lock"
exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "a deploy or rebuild is already running" >&2
  write_state failed lock "a deploy or rebuild is already running" 1
  exit 1
fi

step preflight "checking the disk"
free_mb=$(df -Pm "$PREFIX" | awk 'NR==2 {print $4}')
if [[ "${free_mb:-0}" -lt "$MIN_FREE_MB" ]]; then
  echo "only ${free_mb}MB free on $PREFIX, need ${MIN_FREE_MB}MB" >&2
  write_state failed preflight "not enough disk space: ${free_mb}MB free, ${MIN_FREE_MB}MB needed" 1
  exit 1
fi

# ---------------------------------------------------------------- build, with the site still up

step build "rebuilding the site from the current content"
set +e
su - "$SERVICE_USER" -s /bin/bash -c "
set -e
cd ${APP_ROOT}
set -a; [[ -f ${PREFIX}/.env.production ]] && . ${PREFIX}/.env.production; set +a
export CONTENT_DIR=${CONTENT_ROOT}
export STATE_DIR=${STATE_ROOT}
export NEXT_DIST_DIR=${BUILD_DIR}
rm -rf ${APP_ROOT}/${BUILD_DIR}
npm run build
"
BUILD_RC=$?
set -e

if [[ "$BUILD_RC" -ne 0 ]]; then
  rm -rf "$APP_ROOT/$BUILD_DIR"
  echo "build failed (exit $BUILD_RC); the site is untouched and still running" >&2
  write_state failed build "the build failed; the site is untouched and still serving the last good version. See $LOG_FILE" "$BUILD_RC"
  exit 1
fi

# ---------------------------------------------------------------- swap

set +e
(
  set -e
  # The parent owns the ending: see the same note in deploy.sh.
  trap - EXIT INT TERM HUP

  # Done before the stop, so the down time is two renames and nothing else.
  chown -R "$SERVICE_USER:$SERVICE_USER" "$APP_ROOT/$BUILD_DIR"
  rm -rf "$PREVIOUS_BUILD"

  step swap "swapping in the new build"
  systemctl stop "$SERVICE_NAME" || true
  if [[ -d "$LIVE_BUILD" ]]; then mv "$LIVE_BUILD" "$PREVIOUS_BUILD"; fi
  mv "$APP_ROOT/$BUILD_DIR" "$LIVE_BUILD"

  step start "starting $SERVICE_NAME"
  systemctl start "$SERVICE_NAME"

  step watch "watching startup for ${WATCH_SECONDS}s"
  healthy=0
  for _ in $(seq 1 "$WATCH_SECONDS"); do
    if ! systemctl is-active "$SERVICE_NAME" >/dev/null 2>&1; then
      echo "service stopped during the watch window" >&2
      break
    fi
    if service_healthy; then healthy=1; break; fi
    sleep 1
  done
  [[ "$healthy" -eq 1 ]]
)
RC=$?
set -e

CURRENT_STEP="$(sed -n 's/.*"step": "\([^"]*\)".*/\1/p' "$STATE_FILE" 2>/dev/null | tail -1 || echo "$CURRENT_STEP")"

if [[ "$RC" -eq 0 ]]; then
  step verify "checking the main pages"
  bad=""
  for p in / /pricing/ /blog/ /contact/; do
    curl -fsS -o /dev/null --max-time 10 "${SERVICE_URL}${p}" || bad="$bad $p"
  done
  if [[ -n "$bad" ]]; then
    echo "these pages did not answer:$bad" >&2
    RC=1
  fi
fi

if [[ "$RC" -eq 0 ]]; then
  # .next.previous stays until the next rebuild: it is the instant way back, and the watchdog uses
  # it to repair a swap that was killed halfway.
  step done "rebuild complete"
  write_state succeeded done "rebuild complete"
  echo "rebuild complete: $DEPLOY_ID"
else
  FAILED_STEP="$CURRENT_STEP"
  echo "rebuild failed during '$FAILED_STEP' (exit $RC)" >&2
  # If the swap had already happened, put the previous build back. If it had not, the live build
  # was never touched and there is nothing to undo.
  if [[ -d "$PREVIOUS_BUILD" ]]; then
    echo "restoring the previous build"
    systemctl stop "$SERVICE_NAME" || true
    rm -rf "$LIVE_BUILD"
    mv "$PREVIOUS_BUILD" "$LIVE_BUILD"
    systemctl start "$SERVICE_NAME" || true
    ROLLED_BACK="true"
  fi
  rm -rf "$APP_ROOT/$BUILD_DIR"
  write_state failed "$FAILED_STEP" "rebuild failed during '$FAILED_STEP'; see $LOG_FILE" "$RC"
  exit 1
fi
