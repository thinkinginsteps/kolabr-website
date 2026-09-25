#!/usr/bin/env bash
# Exercises deploy.sh, rebuild.sh and watchdog.sh against a scratch prefix.
#
# These three scripts stop and start the live site, so they cannot be tried out on the server: the
# first time they run in anger is the first time they matter. This runs every failure path against
# a fake prefix, with stubs standing in for systemctl, curl, su, flock and chown, and checks the
# one thing that must always be true: the site ends up running.
#
# It builds its own tiny package rather than a real one, so it takes seconds. What is under test is
# the orchestration, not Next.js.
#
# Usage: bash scripts/test-deploy-scripts.sh

set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK="$(mktemp -d "${TMPDIR:-/tmp}/kolabr-deploy-test.XXXXXX")"
PREFIX="$WORK/prefix"
BIN="$WORK/bin"
SERVICE_STATE="$WORK/service-state"
CURL_BROKEN="$WORK/curl-broken"
START_REFUSES="$WORK/start-refuses"
BUILD_FAILS="$WORK/build-fails"

trap 'rm -rf "$WORK"' EXIT

PASS=0
FAIL=0

check() { # check <description> <expected> <actual>
  if [[ "$2" == "$3" ]]; then
    printf '    ok    %s\n' "$1"
    PASS=$((PASS + 1))
  else
    printf '    FAIL  %s\n          expected: %s\n          actual:   %s\n' "$1" "$2" "$3"
    FAIL=$((FAIL + 1))
  fi
}

# ---------------------------------------------------------------- stubs

mkdir -p "$BIN"

cat > "$BIN/systemctl" <<EOF
#!/usr/bin/env bash
case "\$1" in
  stop) echo stopped > "$SERVICE_STATE" ;;
  start)
    if [[ -f "$START_REFUSES" ]]; then rm -f "$START_REFUSES"; echo stopped > "$SERVICE_STATE"; exit 1; fi
    echo running > "$SERVICE_STATE" ;;
  is-active) [[ "\$(cat "$SERVICE_STATE" 2>/dev/null)" == running ]] ;;
  *) : ;;
esac
EOF

cat > "$BIN/curl" <<EOF
#!/usr/bin/env bash
# Answers only while the stub service is running. A test can break one path by naming it in
# $CURL_BROKEN.
[[ "\$(cat "$SERVICE_STATE" 2>/dev/null)" == running ]] || exit 7
broken="\$(cat "$CURL_BROKEN" 2>/dev/null || true)"
if [[ -n "\$broken" ]]; then
  for arg in "\$@"; do [[ "\$arg" == *"\$broken" ]] && exit 22; done
fi
exit 0
EOF

# Run the command here instead of switching user; there is no kolabr user on a laptop.
cat > "$BIN/su" <<'EOF'
#!/usr/bin/env bash
cmd=""
while [[ $# -gt 0 ]]; do case "$1" in -c) cmd="$2"; shift 2;; *) shift;; esac; done
bash -c "$cmd"
EOF

printf '#!/usr/bin/env bash\nexit 0\n' > "$BIN/chown"
printf '#!/usr/bin/env bash\nexit 0\n' > "$BIN/flock"
chmod +x "$BIN"/*

# ---------------------------------------------------------------- a package to deploy

make_package() { # make_package <path.zip> <build script>
  local out="$1" build="$2" dir="$WORK/pkg"
  rm -rf "$dir" "$out"
  mkdir -p "$dir/app" "$dir/lib" "$dir/content/pages"
  # Written by node, not a heredoc: the build command is full of quotes and has to be escaped as
  # JSON or npm ci fails on a package.json that cannot be parsed.
  node -e 'require("fs").writeFileSync(process.argv[1], JSON.stringify({ name: "kolabr-website-test", version: "0.0.0", scripts: { build: process.argv[2] } }, null, 2))' "$dir/package.json" "$build"
  cat > "$dir/package-lock.json" <<'EOF'
{ "name": "kolabr-website-test", "version": "0.0.0", "lockfileVersion": 3, "requires": true, "packages": { "": { "name": "kolabr-website-test", "version": "0.0.0" } } }
EOF
  echo "export default {};" > "$dir/next.config.ts"
  echo "{}" > "$dir/content/pages/home.json"
  (cd "$dir" && zip -qr "$out" .)
}

GOOD_ZIP="$WORK/good.zip"
BAD_ZIP="$WORK/bad.zip"
make_package "$GOOD_ZIP" "node -e \"require('fs').mkdirSync('.next',{recursive:true})\""
make_package "$BAD_ZIP" 'node -e "process.exit(1)"'

# ---------------------------------------------------------------- helpers

reset_prefix() {
  rm -rf "$PREFIX"
  mkdir -p "$PREFIX/app/.next"
  echo "the old build" > "$PREFIX/app/marker"
  echo "the old build" > "$PREFIX/app/.next/marker"
  echo running > "$SERVICE_STATE"
  rm -f "$CURL_BROKEN" "$START_REFUSES" "$BUILD_FAILS"
}

field() { # field <json> <key>
  sed -n "s/.*\"$2\": \"\{0,1\}\([^\",]*\)\"\{0,1\},\{0,1\}$/\1/p" "$1" | head -1
}

deploy() { # deploy <zip> <id>
  PATH="$BIN:$PATH" KOLABR_PREFIX="$PREFIX" KOLABR_USER="$(id -un)" \
    DEPLOY_WATCH_SECONDS=5 DEPLOY_MIN_FREE_MB=1 \
    bash "$HERE/deploy/deploy.sh" "$1" --deploy-id "$2" --foreground >/dev/null 2>&1
}

rebuild() { # rebuild <id>
  PATH="$BIN:$PATH" KOLABR_PREFIX="$PREFIX" KOLABR_USER="$(id -un)" \
    DEPLOY_WATCH_SECONDS=5 REBUILD_MIN_FREE_MB=1 \
    bash "$HERE/deploy/rebuild.sh" --deploy-id "$1" --foreground >/dev/null 2>&1
}

watchdog() {
  PATH="$BIN:$PATH" KOLABR_PREFIX="$PREFIX" KOLABR_USER="$(id -un)" \
    bash "$HERE/deploy/watchdog.sh" >/dev/null 2>&1
}

service_state() { cat "$SERVICE_STATE" 2>/dev/null; }

echo "Testing the deploy scripts in $WORK"

# ---------------------------------------------------------------- deploy

echo
echo "deploy.sh"

echo "  a failing build leaves the site untouched"
reset_prefix
deploy "$BAD_ZIP" d1
check "the site is still running" running "$(service_state)"
check "the deploy reports failed" failed "$(field "$PREFIX/deploy-logs/d1.json" status)"
check "it failed at the build" build "$(field "$PREFIX/deploy-logs/d1.json" step)"
check "the old build is still in place" "the old build" "$(cat "$PREFIX/app/marker")"

echo "  a clean deploy swaps the new build in"
reset_prefix
deploy "$GOOD_ZIP" d2
check "the site is running" running "$(service_state)"
check "the deploy succeeded" succeeded "$(field "$PREFIX/deploy-logs/d2.json" status)"
check "the new build is live" "" "$(cat "$PREFIX/app/marker" 2>/dev/null)"
check "the previous build is kept" yes "$([[ -d "$PREFIX/app.previous" ]] && echo yes || echo no)"
check "the staging directory is cleaned up" "" "$(ls "$PREFIX/.deploy-work" 2>/dev/null)"

echo "  the very first deploy, on an empty server, succeeds"
# What a fresh install looks like: no app, no previous build, no backups, service never started.
# This path once died after a successful swap, because pruning backups listed a glob that matched
# nothing and pipefail turned ls's exit 2 into the script's.
rm -rf "$PREFIX"
mkdir -p "$PREFIX"
echo stopped > "$SERVICE_STATE"
rm -f "$CURL_BROKEN" "$START_REFUSES" "$BUILD_FAILS"
deploy "$GOOD_ZIP" d0
check "the site is running" running "$(service_state)"
check "the deploy succeeded" succeeded "$(field "$PREFIX/deploy-logs/d0.json" status)"
check "it reached the end" done "$(field "$PREFIX/deploy-logs/d0.json" step)"
check "the build is in place" yes "$([[ -d "$PREFIX/app/.next" ]] && echo yes || echo no)"
check "there is no previous build to keep" no "$([[ -d "$PREFIX/app.previous" ]] && echo yes || echo no)"

echo "  a service that will not start is rolled back"
reset_prefix
touch "$START_REFUSES"
deploy "$GOOD_ZIP" d3
check "the site is running" running "$(service_state)"
check "the deploy reports failed" failed "$(field "$PREFIX/deploy-logs/d3.json" status)"
check "it rolled back" true "$(field "$PREFIX/deploy-logs/d3.json" rolledBack)"
check "the old build is serving again" "the old build" "$(cat "$PREFIX/app/marker")"

echo "  a page that does not answer is rolled back"
reset_prefix
echo "/blog/" > "$CURL_BROKEN"
deploy "$GOOD_ZIP" d4
check "the site is running" running "$(service_state)"
check "it failed at verify" verify "$(field "$PREFIX/deploy-logs/d4.json" step)"
check "it rolled back" true "$(field "$PREFIX/deploy-logs/d4.json" rolledBack)"
check "the old build is serving again" "the old build" "$(cat "$PREFIX/app/marker")"

echo "  an invalid package is refused before anything is touched"
reset_prefix
: > "$WORK/empty.zip"
(cd "$WORK" && mkdir -p junk && echo hi > junk/readme.txt && zip -qr "$WORK/junk.zip" junk)
deploy "$WORK/junk.zip" d5
check "the site is running" running "$(service_state)"
check "it failed at validate" validate "$(field "$PREFIX/deploy-logs/d5.json" step)"
check "the old build is untouched" "the old build" "$(cat "$PREFIX/app/marker")"

echo "  a deploy killed outright during the build leaves the site serving"
reset_prefix
# Its own process group, so the kill lands on the whole deploy the way systemd's would.
perl -e 'setpgrp(0,0); exec @ARGV' env PATH="$BIN:$PATH" KOLABR_PREFIX="$PREFIX" KOLABR_USER="$(id -un)" \
  DEPLOY_WATCH_SECONDS=5 DEPLOY_MIN_FREE_MB=1 \
  bash "$HERE/deploy/deploy.sh" "$GOOD_ZIP" --deploy-id d6 --foreground >/dev/null 2>&1 &
killpid=$!
for _ in $(seq 1 200); do
  grep -q '"step": "build"' "$PREFIX/deploy-logs/d6.json" 2>/dev/null && break
  sleep 0.1
done
kill -KILL -$killpid 2>/dev/null
wait $killpid 2>/dev/null
check "the site never stopped" running "$(service_state)"
check "the old build is still serving" "the old build" "$(cat "$PREFIX/app/marker")"
watchdog
check "the watchdog finds nothing to repair" running "$(service_state)"
node -e 'JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"))' "$PREFIX/deploy-logs/d6.json" 2>/dev/null
check "the status file is still valid JSON" 0 $?

# ---------------------------------------------------------------- rebuild

echo
echo "rebuild.sh"

prepare_app() { # a live app the rebuild can build in place
  reset_prefix
  cat > "$PREFIX/app/package.json" <<'EOF'
{
  "name": "kolabr-website-test",
  "version": "0.0.0",
  "scripts": { "build": "node -e \"const f=require('fs');if(process.env.BUILD_FAILS&&f.existsSync(process.env.BUILD_FAILS))process.exit(1);f.mkdirSync(process.env.NEXT_DIST_DIR,{recursive:true});f.writeFileSync(process.env.NEXT_DIST_DIR+'/marker','the new build')\"" }
}
EOF
}

echo "  a failing content build leaves the live build alone"
prepare_app
touch "$BUILD_FAILS"
BUILD_FAILS="$BUILD_FAILS" rebuild r1
check "the site is running" running "$(service_state)"
check "the rebuild reports failed" failed "$(field "$PREFIX/deploy-logs/r1.json" status)"
check "the live build is untouched" "the old build" "$(cat "$PREFIX/app/.next/marker")"
check "no half-built directory is left" no "$([[ -d "$PREFIX/app/.next-build" ]] && echo yes || echo no)"

echo "  a clean rebuild swaps the new build in"
prepare_app
rebuild r2
check "the site is running" running "$(service_state)"
check "the rebuild succeeded" succeeded "$(field "$PREFIX/deploy-logs/r2.json" status)"
check "the new build is live" "the new build" "$(cat "$PREFIX/app/.next/marker")"
check "the previous build is kept" "the old build" "$(cat "$PREFIX/app/.next.previous/marker")"

echo "  a page that does not answer is rolled back"
prepare_app
echo "/contact/" > "$CURL_BROKEN"
rebuild r3
check "the site is running" running "$(service_state)"
check "it rolled back" true "$(field "$PREFIX/deploy-logs/r3.json" rolledBack)"
check "the old build is serving again" "the old build" "$(cat "$PREFIX/app/.next/marker")"

# ---------------------------------------------------------------- watchdog

echo
echo "watchdog.sh"

echo "  it repairs a deploy killed between the two renames"
reset_prefix
mv "$PREFIX/app" "$PREFIX/app.previous"
echo stopped > "$SERVICE_STATE"
watchdog
check "the site is running again" running "$(service_state)"
check "the previous build was put back" "the old build" "$(cat "$PREFIX/app/marker" 2>/dev/null)"

echo "  it repairs a rebuild killed between the two renames"
reset_prefix
mv "$PREFIX/app/.next" "$PREFIX/app/.next.previous"
echo stopped > "$SERVICE_STATE"
watchdog
check "the site is running again" running "$(service_state)"
check "the previous build was put back" "the old build" "$(cat "$PREFIX/app/.next/marker" 2>/dev/null)"

echo "  it does nothing while a deploy holds the lock"
reset_prefix
echo stopped > "$SERVICE_STATE"
printf '#!/usr/bin/env bash\nexit 1\n' > "$BIN/flock"   # the lock is held
watchdog
check "the service was left alone" stopped "$(service_state)"
printf '#!/usr/bin/env bash\nexit 0\n' > "$BIN/flock"

echo "  the maintenance flag stops it"
reset_prefix
echo stopped > "$SERVICE_STATE"
touch "$PREFIX/.maintenance"
watchdog
check "the service was left alone" stopped "$(service_state)"
rm -f "$PREFIX/.maintenance"

echo "  it starts a service that simply is not running"
reset_prefix
echo stopped > "$SERVICE_STATE"
watchdog
check "the site is running again" running "$(service_state)"

# ----------------------------------------------------------------

echo
echo "$PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]
