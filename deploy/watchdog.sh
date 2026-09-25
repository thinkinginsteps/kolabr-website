#!/usr/bin/env bash
# Kolabr website watchdog. Runs every minute from kolabr-watchdog.timer.
#
# deploy.sh and rebuild.sh both end by making sure the site is running, and between them they cover
# every failure they can see: a bad build, a bad swap, a page that will not answer, even a SIGTERM.
# What they cannot cover is being killed outright. A SIGKILL, an out-of-memory kill or a power cut
# during the one-second window where the old directory has been moved aside and the new one is not
# in place yet leaves the site stopped with no code to serve, and no handler left alive to fix it.
#
# That is this script's only job:
#
#   1. If a deploy or rebuild is running, do nothing. It holds the lock and it is handling itself.
#   2. If /opt/kolabr/app is missing, an interrupted swap left it that way. Put the previous build
#      back: it is the version that was serving before, so it is the one known to work.
#   3. If the service is not running, start it.
#
# It deliberately does NOT restart on a failing health check. A service that is up but answering
# badly is a problem for a person, not for a loop that would flap.
#
# To stop it while working on the box: touch /opt/kolabr/.maintenance

set -euo pipefail

PREFIX="${KOLABR_PREFIX:-/opt/kolabr}"
APP_ROOT="$PREFIX/app"
PREVIOUS_ROOT="$PREFIX/app.previous"
SERVICE_NAME="${KOLABR_SERVICE:-kolabr}"
SERVICE_USER="${KOLABR_USER:-kolabr}"
LOCK_FILE="$PREFIX/.deploy.lock"
LOG_FILE="$PREFIX/deploy-logs/watchdog.log"
STATE_FILE="$PREFIX/deploy-logs/watchdog.json"
MAINTENANCE_FLAG="$PREFIX/.maintenance"

[[ -f "$MAINTENANCE_FLAG" ]] && exit 0

mkdir -p "$(dirname "$LOG_FILE")"

say() { echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) $*" >> "$LOG_FILE"; }

record() {
  local action="$1" detail="$2"
  local tmp="$STATE_FILE.tmp.$$"
  cat > "$tmp" <<JSON
{
  "checkedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "action": "$action",
  "detail": "$detail"
}
JSON
  mv -f "$tmp" "$STATE_FILE"
}

# A deploy or rebuild in progress holds this lock, and the site is legitimately down for a moment
# during its swap. Never act while one is running.
exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  record none "a deploy or rebuild is running"
  exit 0
fi

repaired=""

if [[ ! -d "$APP_ROOT" ]]; then
  if [[ -d "$PREVIOUS_ROOT" ]]; then
    say "REPAIR: $APP_ROOT is missing; a swap was interrupted. Restoring the previous build."
    mv "$PREVIOUS_ROOT" "$APP_ROOT"
    chown -R "$SERVICE_USER:$SERVICE_USER" "$APP_ROOT" || true
    repaired="restored the previous build after an interrupted swap"
  else
    say "ALERT: $APP_ROOT is missing and there is no previous build to restore. A person is needed."
    record alert "the app directory is missing and there is no previous build to restore"
    exit 1
  fi
fi

# The same thing one level down: a rebuild killed mid-swap leaves the app directory in place with
# no .next inside it, and the service cannot serve a single page without one.
if [[ -d "$APP_ROOT" && ! -d "$APP_ROOT/.next" && -d "$APP_ROOT/.next.previous" ]]; then
  say "REPAIR: $APP_ROOT/.next is missing; a rebuild was interrupted. Restoring the previous build."
  mv "$APP_ROOT/.next.previous" "$APP_ROOT/.next"
  chown -R "$SERVICE_USER:$SERVICE_USER" "$APP_ROOT/.next" || true
  repaired="${repaired:+$repaired; }restored the previous site build after an interrupted rebuild"
fi

if systemctl is-active --quiet "$SERVICE_NAME"; then
  record none "${repaired:-Nothing to do}"
  exit 0
fi

say "$SERVICE_NAME is not running; starting it"
systemctl start "$SERVICE_NAME" || true

for _ in $(seq 1 20); do
  if systemctl is-active --quiet "$SERVICE_NAME"; then
    say "$SERVICE_NAME is running again"
    record started "${repaired:+$repaired; }started $SERVICE_NAME because it was not running"
    exit 0
  fi
  sleep 1
done

say "ALERT: could not start $SERVICE_NAME. The site is down."
record alert "could not start $SERVICE_NAME; the site is down"
exit 1
