#!/usr/bin/env bash
# Kolabr server setup: everything the first deploy needs, installed from this deploy/ directory.
#
# Safe to run again. Every step checks before it acts, nothing that holds data or secrets is ever
# overwritten (.env.production, content/, state/, the TLS files), and the script only touches
# Kolabr's own files plus Ubuntu's stock nginx "default" site, which it replaces.
#
# Run it again after:
#   - installing the Cloudflare origin certificate: that is what enables the preview site;
#   - the first deploy: that is what enables the watchdog;
#   - changing anything in deploy/ that is not deploy.sh's job (the unit, nginx, the scripts).
#
# Usage, as root, from a copy of the repo's deploy/ directory on the server:
#   sudo bash install-server.sh
#
# What it deliberately does NOT do:
#   - fill in .env.production (secrets come from a person; it creates an empty, private file);
#   - install the certificate (it tells you where it goes);
#   - deploy the site (DEPLOY.md, "The first deploy");
#   - enable the live kolabr.com site (DEPLOY.md, "Going live").

set -euo pipefail

SRC="$(cd "$(dirname "$(readlink -f "$0")")" && pwd)"
PREFIX=/opt/kolabr
SERVICE_USER=kolabr
NODE_MAJOR=22
CERT=/etc/ssl/kolabr/origin.pem
KEY=/etc/ssl/kolabr/origin.key
PREVIEW_SITE=preview.kolabr.com.conf
HOLDING_SITE=kolabr.com-holding.conf
LIVE_SITE=kolabr.com.conf
HOLDING_ROOT=/var/www/kolabr-holding

say() { printf '\n== %s\n' "$*"; }
note() { printf '   %s\n' "$*"; }

[[ $EUID -eq 0 ]] || { echo "run as root (sudo bash $0)" >&2; exit 1; }
for f in deploy.sh rebuild.sh watchdog.sh kolabr.service kolabr-watchdog.service kolabr-watchdog.timer \
         sudoers.kolabr nginx/conf.d/kolabr.conf nginx/conf.d/cloudflare-realip.conf \
         nginx/snippets/kolabr-site.conf nginx/sites/00-default.conf nginx/sites/$PREVIEW_SITE \
         nginx/sites/$HOLDING_SITE holding/index.html; do
  [[ -f "$SRC/$f" ]] || { echo "missing $SRC/$f: run this from a copy of the repo's deploy/ directory" >&2; exit 1; }
done
# Copied from a Windows checkout without the repo's .gitattributes, these files carry CRLF: bash
# fails on $'\r', and visudo rejects the sudoers line. Refuse before installing any of them.
if crlf="$(grep -rlI $'\r' "$SRC")"; then
  echo "these files have Windows line endings (CRLF) and would break on this server:" >&2
  echo "$crlf" >&2
  exit 1
fi

# ---------------------------------------------------------------- packages

say "packages"
node_ok=0
if command -v node >/dev/null; then
  major="$(node -p 'process.versions.node.split(".")[0]')"
  [[ "$major" -ge 20 ]] && node_ok=1
fi
if [[ "$node_ok" -eq 0 ]]; then
  note "installing Node.js $NODE_MAJOR from NodeSource"
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" -o /tmp/nodesource_setup.sh
  bash /tmp/nodesource_setup.sh
  rm -f /tmp/nodesource_setup.sh
fi
missing=()
for pkg in nodejs nginx unzip curl; do
  dpkg -s "$pkg" >/dev/null 2>&1 || missing+=("$pkg")
done
if [[ ${#missing[@]} -gt 0 ]]; then
  note "installing ${missing[*]}"
  DEBIAN_FRONTEND=noninteractive apt-get install -y "${missing[@]}"
fi
note "node $(node -v), npm $(npm -v), $(nginx -v 2>&1)"

# ---------------------------------------------------------------- user and directories

say "user and directories"
if ! id "$SERVICE_USER" >/dev/null 2>&1; then
  adduser --system --group --home "$PREFIX" --shell /usr/sbin/nologin "$SERVICE_USER"
fi
# app/ is NOT created here: the first deploy creates it. An empty one would be "backed up" as the
# previous build, and a failed first deploy would then roll back to nothing.
install -d -o "$SERVICE_USER" -g "$SERVICE_USER" -m 0755 "$PREFIX"
# Private: sessions, contact messages (personal data), uploaded packages, logs, source backups.
for d in state uploads deploy-logs backups; do
  install -d -o "$SERVICE_USER" -g "$SERVICE_USER" -m 0750 "$PREFIX/$d"
done
install -d -o "$SERVICE_USER" -g "$SERVICE_USER" -m 0755 "$PREFIX/content"
note "$(ls -ld "$PREFIX" | awk '{print $1, $3, $4, $NF}')"

# ---------------------------------------------------------------- root-owned scripts

say "scripts (root-owned: the sudoers line would hand kolabr root if it could edit them)"
for s in deploy.sh rebuild.sh watchdog.sh; do
  install -o root -g root -m 0755 "$SRC/$s" "$PREFIX/$s"
done

say "sudoers"
visudo -cf "$SRC/sudoers.kolabr" >/dev/null
install -o root -g root -m 0440 "$SRC/sudoers.kolabr" /etc/sudoers.d/kolabr
visudo -c >/dev/null
note "kolabr may run deploy.sh and rebuild.sh as root, nothing else"

# ---------------------------------------------------------------- secrets file

say "secrets"
ENV_FILE="$PREFIX/.env.production"
if [[ ! -f "$ENV_FILE" ]]; then
  install -o "$SERVICE_USER" -g "$SERVICE_USER" -m 0600 /dev/null "$ENV_FILE"
  note "created an empty $ENV_FILE: fill it in (see .env.example)"
else
  chown "$SERVICE_USER:$SERVICE_USER" "$ENV_FILE"
  chmod 0600 "$ENV_FILE"
  note "$ENV_FILE exists; left as it is"
fi

# ---------------------------------------------------------------- systemd

say "systemd"
install -m 0644 "$SRC/kolabr.service" /etc/systemd/system/kolabr.service
install -m 0644 "$SRC/kolabr-watchdog.service" /etc/systemd/system/kolabr-watchdog.service
install -m 0644 "$SRC/kolabr-watchdog.timer" /etc/systemd/system/kolabr-watchdog.timer
systemctl daemon-reload
systemctl enable kolabr >/dev/null 2>&1
# Before the first deploy there is nothing to keep running: the watchdog would try to start a
# service with no code every minute and log an alert each time.
if [[ -d "$PREFIX/app/.next" ]]; then
  systemctl enable --now kolabr-watchdog.timer >/dev/null 2>&1
  note "kolabr enabled; watchdog timer running"
else
  note "kolabr enabled (starts on the first deploy); watchdog left off until a build exists: run this again after the first deploy"
fi

# ---------------------------------------------------------------- nginx

say "nginx"
install -m 0644 "$SRC/nginx/conf.d/kolabr.conf" /etc/nginx/conf.d/kolabr.conf
install -m 0644 "$SRC/nginx/conf.d/cloudflare-realip.conf" /etc/nginx/conf.d/cloudflare-realip.conf
install -d -m 0755 /etc/nginx/snippets
for f in "$SRC"/nginx/snippets/*.conf; do install -m 0644 "$f" /etc/nginx/snippets/; done
for f in "$SRC"/nginx/sites/*.conf; do install -m 0644 "$f" /etc/nginx/sites-available/; done

# Ubuntu's stock site claims default_server on port 80, which 00-default.conf now owns.
rm -f /etc/nginx/sites-enabled/default
ln -sfn /etc/nginx/sites-available/00-default.conf /etc/nginx/sites-enabled/00-default.conf

# The kolabr.com holding page: static files, root-owned, readable by nginx.
install -d -o root -g root -m 0755 "$HOLDING_ROOT"
for f in "$SRC"/holding/*; do install -o root -g root -m 0644 "$f" "$HOLDING_ROOT/"; done

install -d -o root -g root -m 0755 /etc/ssl/kolabr
if [[ -s "$CERT" && -s "$KEY" ]]; then
  chown root:root "$CERT" "$KEY"
  chmod 0644 "$CERT"
  chmod 0600 "$KEY"
  note "origin certificate found, expires $(openssl x509 -enddate -noout -in "$CERT" | cut -d= -f2)"
  ln -sfn "/etc/nginx/sites-available/$PREVIEW_SITE" "/etc/nginx/sites-enabled/$PREVIEW_SITE"
  note "preview.kolabr.com enabled"
  # kolabr.com is either the holding page or the live site, never both: two blocks claiming the
  # same name means nginx silently serves one of them. The live site is only ever enabled by hand
  # (DEPLOY.md, "Going live"), so its presence is what decides.
  if [[ -e "/etc/nginx/sites-enabled/$LIVE_SITE" ]]; then
    rm -f "/etc/nginx/sites-enabled/$HOLDING_SITE"
    note "kolabr.com is live: holding page left disabled"
  else
    ln -sfn "/etc/nginx/sites-available/$HOLDING_SITE" "/etc/nginx/sites-enabled/$HOLDING_SITE"
    note "kolabr.com serves the holding page"
  fi
else
  # nginx refuses to start with a missing certificate, so nothing is enabled until it is there.
  rm -f "/etc/nginx/sites-enabled/$PREVIEW_SITE" "/etc/nginx/sites-enabled/$HOLDING_SITE"
  note "no origin certificate yet: preview.kolabr.com and the kolabr.com holding page NOT enabled"
  note "put the certificate in $CERT and the key in $KEY, then run this again"
fi

nginx -t
systemctl enable nginx >/dev/null 2>&1
if systemctl is-active --quiet nginx; then systemctl reload nginx; else systemctl start nginx; fi
note "nginx running; enabled sites: $(ls /etc/nginx/sites-enabled | tr '\n' ' ')"

say "done"
