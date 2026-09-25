#!/usr/bin/env bash
# Kolabr website deploy.
#
# Installs an uploaded source .zip, builds it, and swaps it in. Three rules shape this script:
#
#   1. THE SITE IS NEVER DOWN FOR LONGER THAN A SWAP. The new version is installed and built in a
#      staging directory while the current one keeps serving. The service is stopped only to move
#      two directories and start again: a few seconds, not the minutes a build takes. A failed
#      build therefore never takes the site down, because the site was never stopped.
#   2. IT NEVER LEAVES THE SERVICE STOPPED. Every exit path, including a signal, ends by making
#      sure the service is running, and says so in the status file if it could not.
#   3. IT STAYS OUT OF THE WAY OF EVERYTHING ELSE ON THE BOX. The build runs under a CPU and
#      memory ceiling so a co-hosted app is not starved, disk space is checked before anything is
#      written, and the only unit this script ever touches is its own.
#
# WHY IT DETACHES ITSELF (do not remove):
# The back office runs this from a Next.js server action, so it starts inside kolabr.service's
# cgroup. systemd's default KillMode=control-group means `systemctl stop kolabr` SIGTERMs every
# process in that cgroup: this script, its sudo parent, and the rollback with it. So it re-execs
# into a transient unit and lives in its own cgroup. Because the process that launched it is
# killed partway through, the deploy reports through a status file the back office polls.
#
# Usage: deploy.sh /path/to/package.zip [options]
#
#   --deploy-id <id>   id for the log and status filenames, echoed back for the poller.
#   --owns-package     delete the package after a successful deploy (the app sets this).
#   --no-rollback      leave a failed deploy in place instead of restoring the previous build.
#   --foreground       run here instead of re-execing. Correct for a manual SSH run, never from
#                      the app.
#   --help
#
# Caller-supplied values are FLAGS, never environment variables: sudoers sets `Defaults
# env_reset`, so an env var set by the caller is stripped before this script sees it.

set -euo pipefail

PREFIX="${KOLABR_PREFIX:-/opt/kolabr}"
APP_ROOT="$PREFIX/app"
PREVIOUS_ROOT="$PREFIX/app.previous"
STATE_ROOT="$PREFIX/state"
CONTENT_ROOT="$PREFIX/content"
SERVICE_NAME="${KOLABR_SERVICE:-kolabr}"
SERVICE_USER="${KOLABR_USER:-kolabr}"
WORK_ROOT="$PREFIX/.deploy-work"
BACKUP_ROOT="$PREFIX/backups"
UPLOAD_ROOT="$PREFIX/uploads"
LOCK_FILE="$PREFIX/.deploy.lock"
LOG_DIR="${DEPLOY_LOG_DIR:-$PREFIX/deploy-logs}"
SERVICE_URL="${KOLABR_URL:-http://127.0.0.1:3000}"
KEEP_BACKUPS=5
# Free space needed before anything is written. node_modules and .next come to roughly 1.2GB, and
# filling the disk would break every service on the machine, not just this one.
MIN_FREE_MB="${DEPLOY_MIN_FREE_MB:-3000}"
# Ceilings for the build, so a co-hosted app is not starved of CPU or memory by a deploy.
BUILD_CPU_QUOTA="${DEPLOY_CPU_QUOTA:-70%}"
BUILD_MEMORY_MAX="${DEPLOY_MEMORY_MAX:-3G}"

DEPLOY_UNIT="kolabr-deploy.service"
SELF="$(readlink -f "$0")"

# ---------------------------------------------------------------- arguments

PKG_PATH=""
ROLLBACK_ON_FAILURE=1
FOREGROUND=0
OWNS_PACKAGE="${DEPLOY_OWNS_PACKAGE:-0}"
DEPLOY_ID="${DEPLOY_ID:-}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-rollback) ROLLBACK_ON_FAILURE=0; shift ;;
    --foreground) FOREGROUND=1; shift ;;
    --owns-package) OWNS_PACKAGE=1; shift ;;
    --deploy-id) DEPLOY_ID="${2:-}"; shift 2 ;;
    --help|-h) sed -n '2,32p' "$SELF"; exit 0 ;;
    -*) echo "unknown option: $1" >&2; exit 2 ;;
    *) PKG_PATH="$1"; shift ;;
  esac
done

if [[ -z "$PKG_PATH" ]]; then
  echo "usage: deploy.sh /path/to/package.zip [--deploy-id ID] [--owns-package] [--no-rollback] [--foreground]" >&2
  exit 2
fi
if [[ ! -f "$PKG_PATH" ]]; then
  echo "package not found: $PKG_PATH" >&2
  exit 2
fi
if [[ ! "$DEPLOY_ID" =~ ^[A-Za-z0-9._-]{1,64}$ ]]; then
  DEPLOY_ID="$(date +%Y%m%d-%H%M%S)"
fi

WATCH_SECONDS="${DEPLOY_WATCH_SECONDS:-25}"
[[ "$WATCH_SECONDS" -lt 5 ]] && WATCH_SECONDS=5

mkdir -p "$LOG_DIR" "$BACKUP_ROOT" "$WORK_ROOT" "$STATE_ROOT" "$CONTENT_ROOT" "$UPLOAD_ROOT"
LOG_FILE="$LOG_DIR/$DEPLOY_ID.log"
STATE_FILE="$LOG_DIR/$DEPLOY_ID.json"

# ---------------------------------------------------------------- detach

if [[ "$FOREGROUND" -eq 0 && -z "${DEPLOY_DETACHED:-}" ]]; then
  echo "deploy-id: $DEPLOY_ID"
  systemd-run \
    --unit="$DEPLOY_UNIT" --collect --quiet \
    --property="CPUQuota=$BUILD_CPU_QUOTA" \
    --property="MemoryMax=$BUILD_MEMORY_MAX" \
    --property="Nice=10" \
    --property="IOWeight=50" \
    --setenv=DEPLOY_DETACHED=1 \
    --setenv=DEPLOY_LOG_DIR="$LOG_DIR" \
    -- "$SELF" "$PKG_PATH" --deploy-id "$DEPLOY_ID" --foreground \
       $([[ "$OWNS_PACKAGE" -eq 1 ]] && echo --owns-package) \
       $([[ "$ROLLBACK_ON_FAILURE" -eq 0 ]] && echo --no-rollback)
  echo "started in $DEPLOY_UNIT; follow $LOG_FILE"
  exit 0
fi

# Everything from here goes to the log file, and only there.
#
# This used to tee into a live copy on stdout. Do not put that back: the tee is a second process in
# the same process group, so a kill takes it out first, and the exit handler then dies of SIGPIPE
# on its own first message, with the site stopped. A plain append cannot break. To watch a manual
# run, follow the log in another terminal.
if [[ -t 1 ]]; then echo "logging to $LOG_FILE (tail -f it to watch)"; fi
trap '' PIPE
exec >> "$LOG_FILE" 2>&1

# ---------------------------------------------------------------- status

STARTED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
CURRENT_STEP="queued"
TERMINAL_WRITTEN=0
ROLLED_BACK="false"
SWAPPED=0

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

# Rule 2. Whatever happened, the site must be running when this script exits.
#
# The swap is two renames. A kill landing between them leaves no $APP_ROOT at all, and starting the
# service then would fail, so the first thing this does is put a directory back if one is missing.
ensure_running() {
  if [[ ! -d "$APP_ROOT" ]]; then
    if [[ -d "$STAGE_DIR" ]]; then
      echo "no $APP_ROOT: the swap was interrupted. Completing it with the new build." >&2
      mv "$STAGE_DIR" "$APP_ROOT"
    elif [[ -d "$PREVIOUS_ROOT" ]]; then
      echo "no $APP_ROOT: the swap was interrupted. Putting the previous build back." >&2
      mv "$PREVIOUS_ROOT" "$APP_ROOT"
      ROLLED_BACK="true"
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

WORK_DIR="$WORK_ROOT/$DEPLOY_ID"
STAGE_DIR="$WORK_DIR/app"
BACKUP_FILE="$BACKUP_ROOT/app-$DEPLOY_ID.tgz"

echo "=== Kolabr deploy $DEPLOY_ID ==="
echo "package:  $PKG_PATH"
echo "watch:    ${WATCH_SECONDS}s"
echo "rollback: $ROLLBACK_ON_FAILURE"
echo "limits:   cpu $BUILD_CPU_QUOTA, memory $BUILD_MEMORY_MAX"

MAIN_PID=$$

on_exit() {
  local code=$?
  # Bash runs an inherited EXIT trap in every forked subshell, including the ones behind command
  # substitutions and pipelines. Without this guard the handler re-enters itself from inside its
  # own `$(...)` calls, and its output lands in the status file instead of the log.
  [[ -n "${BASHPID:-}" && "${BASHPID:-}" != "$MAIN_PID" ]] && return 0
  # The swap runs in a subshell, so its step never reached this variable. The state file is the
  # only place that knows how far it got.
  CURRENT_STEP="$(sed -n 's/.*"step": "\([^"]*\)".*/\1/p' "$STATE_FILE" 2>/dev/null | tail -1 || true)"
  [[ -z "$CURRENT_STEP" ]] && CURRENT_STEP="queued"
  # Getting the site up comes first: ensure_running may still need the staging directory under
  # $WORK_DIR to finish an interrupted swap.
  local up=0
  ensure_running && up=1
  rm -rf "$WORK_DIR"
  if [[ "$up" -eq 0 ]]; then
    write_state failed "$CURRENT_STEP" "deploy ended with the site DOWN: could not start $SERVICE_NAME" "$code"
    return
  fi
  if [[ "$TERMINAL_WRITTEN" -eq 0 ]]; then
    echo "deploy terminated unexpectedly during '$CURRENT_STEP' (exit $code); the site is running" >&2
    write_state failed "$CURRENT_STEP" "terminated unexpectedly during '$CURRENT_STEP' (exit $code); the site is running" "$code"
  fi
}
trap on_exit EXIT
# A signal must go through the same handler rather than killing the script where it stands. The
# subshell that owns the swap gets the signal too, so exiting here is enough.
trap 'echo "deploy interrupted by a signal during '"'"'$CURRENT_STEP'"'"'" >&2; exit 143' INT TERM HUP

step lock "acquiring the deploy lock"
exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "another deploy or rebuild is already running" >&2
  write_state failed lock "another deploy or rebuild is already running" 1
  exit 1
fi

# ---------------------------------------------------------------- preflight

step preflight "checking the disk"
free_mb=$(df -Pm "$PREFIX" | awk 'NR==2 {print $4}')
if [[ "${free_mb:-0}" -lt "$MIN_FREE_MB" ]]; then
  echo "only ${free_mb}MB free on $PREFIX, need ${MIN_FREE_MB}MB" >&2
  write_state failed preflight "not enough disk space: ${free_mb}MB free, ${MIN_FREE_MB}MB needed" 1
  exit 1
fi
echo "disk: ${free_mb}MB free"

# The previous deploy's copy, kept for an instant rollback, is released now a new one is starting.
rm -rf "$PREVIOUS_ROOT"

step unzip "extracting the package"
mkdir -p "$STAGE_DIR"
unzip -q "$PKG_PATH" -d "$STAGE_DIR"

step validate "checking the package contents"
for required in package.json package-lock.json next.config.ts app lib; do
  if [[ ! -e "$STAGE_DIR/$required" ]]; then
    echo "invalid package: $required missing" >&2
    write_state failed validate "invalid package: $required missing" 1
    exit 1
  fi
done

# First deploy only: seed the content directory from the package. After that the server's copy is
# the source of truth and no deploy touches it again.
if [[ -z "$(ls -A "$CONTENT_ROOT" 2>/dev/null)" && -d "$STAGE_DIR/content" ]]; then
  echo "seeding $CONTENT_ROOT from the package (first deploy only)"
  cp -a "$STAGE_DIR/content/." "$CONTENT_ROOT"/
fi

if [[ -d "$APP_ROOT" && -n "$(ls -A "$APP_ROOT" 2>/dev/null)" ]]; then
  step backup "saving the current source"
  tar -C "$APP_ROOT" -czf "$BACKUP_FILE" --exclude=./node_modules --exclude=./.next . || true
fi

# ---------------------------------------------------------------- build, with the site still up

step build "installing and building (the site stays up)"
chown -R "$SERVICE_USER:$SERVICE_USER" "$WORK_DIR" "$STATE_ROOT" "$CONTENT_ROOT"

set +e
su - "$SERVICE_USER" -s /bin/bash -c "
set -e
cd ${STAGE_DIR}
set -a; [[ -f ${PREFIX}/.env.production ]] && . ${PREFIX}/.env.production; set +a
export CONTENT_DIR=${CONTENT_ROOT}
export STATE_DIR=${STATE_ROOT}
npm ci --no-audit --no-fund
npm run build
"
BUILD_RC=$?
set -e

if [[ "$BUILD_RC" -ne 0 ]]; then
  # Nothing has been swapped and the service was never stopped: the site is still serving the
  # previous build. This is the whole reason the build happens before the stop.
  echo "build failed (exit $BUILD_RC); the site is untouched and still running" >&2
  write_state failed build "the build failed; the site is untouched and still running. See $LOG_FILE" "$BUILD_RC"
  exit 1
fi

# ---------------------------------------------------------------- swap

swap_back() {
  [[ ! -d "$PREVIOUS_ROOT" ]] && { echo "no previous build to restore" >&2; return 1; }
  echo "rollback: restoring the previous build"
  systemctl stop "$SERVICE_NAME" || true
  rm -rf "$APP_ROOT"
  mv "$PREVIOUS_ROOT" "$APP_ROOT"
  systemctl start "$SERVICE_NAME"
  ROLLED_BACK="true"
  for _ in $(seq 1 "$WATCH_SECONDS"); do
    service_healthy && { echo "rollback complete; the previous build is serving"; return 0; }
    sleep 1
  done
  echo "rollback done but the previous build is not answering" >&2
  return 1
}

set +e
(
  set -e
  # A subshell inherits the traps. Without this both it and the parent would run the exit handler
  # when a signal arrives, two copies would race on the status file, and neither would be readable.
  # The parent is the one that handles the ending.
  trap - EXIT INT TERM HUP
  step stop "stopping the site for the swap"
  systemctl stop "$SERVICE_NAME" || true

  # Nothing slow belongs between the stop and the start. Ownership is already correct from the
  # build, and a rename keeps it, so the whole down time is two renames on one filesystem.
  step swap "swapping in the new build"
  if [[ -d "$APP_ROOT" ]]; then mv "$APP_ROOT" "$PREVIOUS_ROOT"; fi
  mv "$STAGE_DIR" "$APP_ROOT"

  step start "starting the site"
  systemctl start "$SERVICE_NAME"

  step watch "checking it came back (${WATCH_SECONDS}s)"
  healthy=0
  for _ in $(seq 1 "$WATCH_SECONDS"); do
    if ! systemctl is-active "$SERVICE_NAME" >/dev/null 2>&1; then
      echo "the service stopped during the watch window" >&2
      break
    fi
    if service_healthy; then healthy=1; break; fi
    sleep 1
  done
  [[ "$healthy" -eq 1 ]]
)
SWAP_RC=$?
set -e
SWAPPED=1

CURRENT_STEP="$(sed -n 's/.*"step": "\([^"]*\)".*/\1/p' "$STATE_FILE" 2>/dev/null || echo "$CURRENT_STEP")"

if [[ "$SWAP_RC" -eq 0 ]]; then
  step verify "checking the main pages"
  bad=""
  for p in / /pricing/ /blog/ /contact/; do
    curl -fsS -o /dev/null --max-time 10 "${SERVICE_URL}${p}" || bad="$bad $p"
  done
  if [[ -n "$bad" ]]; then
    echo "these pages did not answer:$bad" >&2
    if [[ "$ROLLBACK_ON_FAILURE" -eq 1 ]]; then
      write_state running rollback "pages did not answer:$bad; restoring the previous build"
      swap_back || echo "rollback failed" >&2
    fi
    write_state failed verify "pages did not answer:$bad" 1
    exit 1
  fi

  [[ "$OWNS_PACKAGE" -eq 1 ]] && rm -f "$PKG_PATH"
  # Keep the newest $KEEP_BACKUPS. nullglob, not `ls glob | ...`: on the first deploy there are no
  # backups, ls exits 2, and pipefail + set -e used to kill the script right after a good deploy.
  shopt -s nullglob
  backups=("$BACKUP_ROOT"/app-*.tgz)
  shopt -u nullglob
  if (( ${#backups[@]} > KEEP_BACKUPS )); then
    ls -1t -- "${backups[@]}" | tail -n +$((KEEP_BACKUPS + 1)) | xargs -r -d '\n' rm -f --
  fi
  # $PREVIOUS_ROOT is deliberately kept until the next deploy: it is the fastest rollback there
  # is, and it costs one copy of the build rather than a rebuild from a tarball.
  step done "deploy complete"
  write_state succeeded done "deploy complete"
  echo "deploy complete: $DEPLOY_ID"
else
  FAILED_STEP="$CURRENT_STEP"
  echo "deploy failed during '$FAILED_STEP' (exit $SWAP_RC)" >&2
  if [[ "$ROLLBACK_ON_FAILURE" -eq 1 && "$SWAPPED" -eq 1 ]]; then
    CURRENT_STEP="rollback"
    write_state running rollback "restoring the previous build"
    swap_back || echo "rollback failed; the exit handler will make sure something is running" >&2
  else
    echo "rollback disabled; leaving the new build in place"
  fi
  write_state failed "$FAILED_STEP" "deploy failed during '$FAILED_STEP'; see $LOG_FILE" "$SWAP_RC"
  exit 1
fi
