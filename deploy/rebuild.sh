#!/usr/bin/env bash
# Kolabr content rebuild.
#
# Publishing from the back office changes a file in /opt/kolabr/content. The site is generated at
# build time, so the change is invisible until the site is rebuilt: that is what this does.
#
# It is NOT a deploy. No package, no npm ci, no file swap: the same code, built again against the
# current content. That takes seconds rather than minutes.
#
# The build writes to a separate directory and is only swapped in once it has succeeded, so the
# live build is never half-overwritten by a failing one. The site stays up throughout except for
# the moment of the swap and restart.
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
SERVICE_URL="http://127.0.0.1:3000"
BUILD_DIR=".next-build"

REBUILD_UNIT="kolabr-rebuild.service"
SELF="$(readlink -f "$0")"

FOREGROUND=0
DEPLOY_ID="${DEPLOY_ID:-}"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --foreground) FOREGROUND=1; shift ;;
    --deploy-id) DEPLOY_ID="${2:-}"; shift 2 ;;
    --help|-h) sed -n '2,18p' "$SELF"; exit 0 ;;
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
    --setenv=DEPLOY_DETACHED=1 --setenv=DEPLOY_LOG_DIR="$LOG_DIR" \
    -- "$SELF" --deploy-id "$DEPLOY_ID" --foreground
  echo "started in $REBUILD_UNIT; follow $LOG_FILE"
  exit 0
fi

exec > >(tee -a "$LOG_FILE") 2>&1

STARTED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
CURRENT_STEP="queued"
TERMINAL_WRITTEN=0

json_escape() { printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'; }

write_state() {
  local status="$1" step="$2" message="$3" exit_code="${4:-0}"
  local tmp="$STATE_FILE.tmp"
  cat > "$tmp" <<JSON
{
  "id": "$DEPLOY_ID",
  "status": "$status",
  "step": "$step",
  "message": "$(json_escape "$message")",
  "startedAt": "$STARTED_AT",
  "updatedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "exitCode": $exit_code,
  "rolledBack": false
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

echo "=== Kolabr rebuild $DEPLOY_ID ==="

on_exit() {
  local code=$?
  if [[ "$TERMINAL_WRITTEN" -eq 0 ]]; then
    echo "rebuild terminated unexpectedly during '$CURRENT_STEP' (exit $code)" >&2
    write_state failed "$CURRENT_STEP" "terminated unexpectedly during '$CURRENT_STEP' (exit $code)" "$code"
  fi
}
trap on_exit EXIT

# The same lock a deploy takes: a rebuild during a deploy would build half-replaced files.
step lock "acquiring the deploy lock"
exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "a deploy or rebuild is already running" >&2
  write_state failed lock "a deploy or rebuild is already running" 1
  exit 1
fi

set +e
(
  step build "rebuilding the site from the current content"
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

  # Only now is the live build touched, and only for as long as a move takes.
  step swap "swapping in the new build"
  systemctl stop "$SERVICE_NAME"
  rm -rf "$APP_ROOT/.next.previous"
  [[ -d "$APP_ROOT/.next" ]] && mv "$APP_ROOT/.next" "$APP_ROOT/.next.previous"
  mv "$APP_ROOT/$BUILD_DIR" "$APP_ROOT/.next"
  chown -R "$SERVICE_USER:$SERVICE_USER" "$APP_ROOT/.next"

  step start "starting $SERVICE_NAME"
  systemctl start "$SERVICE_NAME"

  step watch "watching startup for ${WATCH_SECONDS}s"
  deadline=$((SECONDS + WATCH_SECONDS))
  healthy=0
  while [[ $SECONDS -lt $deadline ]]; do
    if ! systemctl is-active "$SERVICE_NAME" >/dev/null; then
      echo "service stopped during the watch window" >&2
      break
    fi
    if curl -fsS -o /dev/null "$SERVICE_URL"; then healthy=1; break; fi
    sleep 1
  done
  [[ "$healthy" -eq 1 ]]
)
RC=$?
set -e

CURRENT_STEP="$(sed -n 's/.*"step": "\([^"]*\)".*/\1/p' "$STATE_FILE" 2>/dev/null || echo "$CURRENT_STEP")"

if [[ "$RC" -eq 0 ]]; then
  rm -rf "$APP_ROOT/.next.previous"
  step done "rebuild complete"
  write_state succeeded done "rebuild complete"
  echo "rebuild complete: $DEPLOY_ID"
else
  FAILED_STEP="$CURRENT_STEP"
  echo "rebuild failed during '$FAILED_STEP' (exit $RC)" >&2
  # If the swap had already happened, put the previous build back. If it had not, the live build
  # was never touched and there is nothing to undo.
  if [[ -d "$APP_ROOT/.next.previous" ]]; then
    echo "restoring the previous build"
    systemctl stop "$SERVICE_NAME" || true
    rm -rf "$APP_ROOT/.next"
    mv "$APP_ROOT/.next.previous" "$APP_ROOT/.next"
    systemctl start "$SERVICE_NAME" || true
  fi
  rm -rf "$APP_ROOT/$BUILD_DIR"
  write_state failed "$FAILED_STEP" "rebuild failed during '$FAILED_STEP'; see $LOG_FILE" "$RC"
  exit 1
fi
