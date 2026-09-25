#!/usr/bin/env bash
# Kolabr website deploy.
#
# Installs an uploaded source .zip into /opt/kolabr/app, builds it, restarts the service, and
# rolls back if the new build does not come up healthy.
#
# WHY THIS SCRIPT DETACHES ITSELF (do not remove):
# The back office runs this from a Next.js server action, so it starts life inside
# kolabr.service's cgroup. systemd's default KillMode=control-group means `systemctl stop kolabr`
# (the stop step below) SIGTERMs every process in that cgroup: this script, its sudo parent, and
# the rollback handler with it. The deploy would die at the moment it stopped the service and
# leave the site down. So the script re-execs into a transient unit (systemd-run) and lives in
# its own cgroup.
#
# Because the process that launched the deploy is always killed partway through, the deploy can
# never answer its caller in-band. Progress goes to a log file and a JSON status file that the
# back office polls once the site is back up.
#
# Usage: deploy.sh /path/to/package.zip [options]
#
#   --deploy-id <id>   id for the log and status filenames. The app passes this so it knows
#                      which status file to poll; the script echoes back the id it adopted.
#   --owns-package     delete the package after a successful deploy (the app sets this for its
#                      own /tmp uploads; an operator's package is never deleted).
#   --no-rollback      leave a failed build in place instead of restoring the backup.
#   --foreground       run here instead of re-execing into a transient unit. Correct for a
#                      manual SSH run, where the shell is its own scope. Never from the app.
#   --help             this text.
#
# Caller-supplied values are FLAGS, never environment variables: sudoers sets `Defaults
# env_reset`, so `DEPLOY_ID=x sudo deploy.sh ...` is silently stripped and the app would poll a
# status file that never appears.
#
# Env (fallback for direct root runs):
#   DEPLOY_ID, DEPLOY_WATCH_SECONDS (default 25), DEPLOY_LOG_DIR, DEPLOY_OWNS_PACKAGE

set -euo pipefail

# The prefix is overridable so the script can be exercised against a scratch directory before it
# is trusted with the real one. sudoers strips the environment, so a deploy from the back office
# always uses /opt/kolabr.
PREFIX="${KOLABR_PREFIX:-/opt/kolabr}"
APP_ROOT="$PREFIX/app"
STATE_ROOT="$PREFIX/state"
CONTENT_ROOT="$PREFIX/content"
SERVICE_NAME="${KOLABR_SERVICE:-kolabr}"
SERVICE_USER="${KOLABR_USER:-kolabr}"
WORK_ROOT="$PREFIX/.deploy-work"
BACKUP_ROOT="$PREFIX/backups"
# Where the back office writes uploaded packages. Not /tmp: the service may run with a private
# /tmp, and then the root deploy script could not see the file the app just wrote.
UPLOAD_ROOT="$PREFIX/uploads"
LOCK_FILE="$PREFIX/.deploy.lock"
LOG_DIR="${DEPLOY_LOG_DIR:-$PREFIX/deploy-logs}"
SERVICE_URL="http://127.0.0.1:3000"
KEEP_BACKUPS=5

# A fixed unit name makes systemd the mutex: a second deploy fails to start with a clear error
# instead of racing. --collect reaps the unit on exit so the name is immediately reusable.
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
    --help|-h) sed -n '2,45p' "$SELF"; exit 0 ;;
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
    --setenv=DEPLOY_DETACHED=1 \
    --setenv=DEPLOY_LOG_DIR="$LOG_DIR" \
    -- "$SELF" "$PKG_PATH" --deploy-id "$DEPLOY_ID" --foreground \
       $([[ "$OWNS_PACKAGE" -eq 1 ]] && echo --owns-package) \
       $([[ "$ROLLBACK_ON_FAILURE" -eq 0 ]] && echo --no-rollback)
  echo "started in $DEPLOY_UNIT; follow $LOG_FILE"
  exit 0
fi

exec > >(tee -a "$LOG_FILE") 2>&1

# ---------------------------------------------------------------- status file

STARTED_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
CURRENT_STEP="queued"
TERMINAL_WRITTEN=0
ROLLED_BACK="false"

state_step() { echo "$CURRENT_STEP"; }

# Messages are this script's own one-line strings, so escaping quotes and backslashes is enough
# to keep the status file valid JSON. No python on the box is assumed.
json_escape() { printf '%s' "$1" | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g'; }

# The back office reads this file. Write it atomically: a half-written file read mid-poll is a
# parse error on the client, which looks like a failed deploy.
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

WORK_DIR="$WORK_ROOT/$DEPLOY_ID"
EXTRACT_DIR="$WORK_DIR/package"
BACKUP_FILE="$BACKUP_ROOT/app-$DEPLOY_ID.tgz"

echo "=== Kolabr deploy $DEPLOY_ID ==="
echo "package:  $PKG_PATH"
echo "watch:    ${WATCH_SECONDS}s"
echo "rollback: $ROLLBACK_ON_FAILURE"

# Any exit that has not already recorded a terminal status is a failure, signals included.
# Without this a killed deploy leaves the back office polling "running" forever.
on_exit() {
  local code=$?
  rm -rf "$WORK_DIR"
  if [[ "$TERMINAL_WRITTEN" -eq 0 ]]; then
    local where; where="$(state_step)"
    echo "deploy terminated unexpectedly during '$where' (exit $code)" >&2
    write_state failed "$where" "terminated unexpectedly during '$where' (exit $code)" "$code"
  fi
}
trap on_exit EXIT

step lock "acquiring deploy lock"
exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo "another deployment is in progress" >&2
  write_state failed lock "another deployment is in progress" 1
  exit 1
fi

rollback() {
  if [[ ! -f "$BACKUP_FILE" ]]; then
    echo "rollback skipped: backup not found at $BACKUP_FILE" >&2
    return 1
  fi
  echo "rollback: restoring app from $BACKUP_FILE"
  systemctl stop "$SERVICE_NAME" || true
  mkdir -p "$APP_ROOT"
  find "$APP_ROOT" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
  tar -C "$APP_ROOT" -xzf "$BACKUP_FILE"
  chown -R "$SERVICE_USER:$SERVICE_USER" "$APP_ROOT"
  systemctl start "$SERVICE_NAME"
  systemctl is-active "$SERVICE_NAME" >/dev/null
  ROLLED_BACK="true"
  echo "rollback complete"
}

# State and content live outside the app so a deploy cannot touch them. The app reaches them
# through CONTENT_DIR and STATE_DIR, never through a symlink inside the app: Turbopack follows a
# symlink that leaves the project root and fails the build with "leaves the filesystem root".
seed_content() {
  if [[ -z "$(ls -A "$CONTENT_ROOT" 2>/dev/null)" && -d "$APP_ROOT/content" ]]; then
    echo "seeding $CONTENT_ROOT from the package (first deploy only)"
    cp -a "$APP_ROOT/content/." "$CONTENT_ROOT"/
  fi
}

step unzip "extracting package"
mkdir -p "$EXTRACT_DIR"
unzip -q "$PKG_PATH" -d "$EXTRACT_DIR"

step validate "checking package contents"
for required in package.json package-lock.json next.config.ts app lib; do
  if [[ ! -e "$EXTRACT_DIR/$required" ]]; then
    echo "invalid package: $required missing" >&2
    write_state failed validate "invalid package: $required missing" 1
    exit 1
  fi
done

if [[ -d "$APP_ROOT" && -n "$(ls -A "$APP_ROOT" 2>/dev/null)" ]]; then
  step backup "backing up current app to $BACKUP_FILE"
  tar -C "$APP_ROOT" -czf "$BACKUP_FILE" --exclude=./node_modules --exclude=./.next .
fi

set +e
(
  step stop "stopping $SERVICE_NAME"
  systemctl stop "$SERVICE_NAME" || true

  step swap "installing new files"
  mkdir -p "$APP_ROOT"
  # node_modules and .next are kept: npm ci reuses the cache and the build is far quicker.
  find "$APP_ROOT" -mindepth 1 -maxdepth 1 ! -name node_modules ! -name .next -exec rm -rf {} +
  cp -a "$EXTRACT_DIR"/. "$APP_ROOT"/

  # First deploy only: seed the content directory from the package. After that the server's copy
  # is the source of truth and no deploy touches it again.
  seed_content
  chown -R "$SERVICE_USER:$SERVICE_USER" "$APP_ROOT" "$STATE_ROOT" "$CONTENT_ROOT"

  step build "npm ci && npm run build"
  # The build reads the blog posts from CONTENT_DIR, so it is set here as well as in the unit,
  # along with anything in .env.production the build needs (NEXT_PUBLIC_* are baked in here).
  su - "$SERVICE_USER" -s /bin/bash -c "
set -e
cd ${APP_ROOT}
set -a; [[ -f ${PREFIX}/.env.production ]] && . ${PREFIX}/.env.production; set +a
export CONTENT_DIR=${CONTENT_ROOT}
export STATE_DIR=${STATE_ROOT}
npm ci --no-audit --no-fund
npm run build
"

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
    if curl -fsS -o /dev/null "$SERVICE_URL"; then
      healthy=1
      break
    fi
    sleep 1
  done
  [[ "$healthy" -eq 1 ]]
)
INSTALL_RC=$?
set -e

# The steps ran in a subshell, so the parent never saw them advance. The status file did:
# read the step back from it rather than reporting the last one this shell happened to set.
CURRENT_STEP="$(sed -n 's/.*"step": "\([^"]*\)".*/\1/p' "$STATE_FILE" 2>/dev/null || echo "$CURRENT_STEP")"

if [[ "$INSTALL_RC" -eq 0 ]]; then
  step done "deploy complete"
  [[ "$OWNS_PACKAGE" -eq 1 ]] && rm -f "$PKG_PATH"
  # Keep a handful of backups: enough to recover, not enough to fill the disk.
  ls -1t "$BACKUP_ROOT"/app-*.tgz 2>/dev/null | tail -n +$((KEEP_BACKUPS + 1)) | xargs -r rm -f
  write_state succeeded done "deploy complete"
  echo "deploy complete: $DEPLOY_ID"
else
  FAILED_STEP="$CURRENT_STEP"
  echo "deploy failed during '$FAILED_STEP' (exit $INSTALL_RC)" >&2
  if [[ "$ROLLBACK_ON_FAILURE" -eq 1 ]]; then
    CURRENT_STEP="rollback"
    write_state running rollback "restoring the previous build"
    rollback || echo "rollback failed, the site may still be down" >&2
  else
    echo "rollback disabled, leaving the failed build in place"
  fi
  write_state failed "$FAILED_STEP" "deploy failed during '$FAILED_STEP'; see $LOG_FILE" "$INSTALL_RC"
  exit 1
fi
