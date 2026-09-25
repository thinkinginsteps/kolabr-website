# Deploying kolabr.com

The site is updated by uploading a package in the back office. You build a zip locally, sign in at
`https://kolabr.com/admin/`, upload it, and watch it land. The server extracts it, installs, builds,
restarts, and puts the previous build back if the new one does not come up.

No SSH is needed to deploy. SSH is needed once, to set the server up, and afterwards only to change
something outside the app: the deploy script, the systemd unit, nginx, or `.env.production`.

## Two ways to change the site

**Content** (a blog post, or the words on a marketing page): edit it in the back office under Blog
or Copy, then press **Publish changes**.
That rebuilds the site from the current content and swaps the new build in. It takes about a
minute, and the site stays up except for a few seconds at the swap. `rebuild.sh` does this.

**Code** (anything else): build a package locally and upload it under Deploy. That replaces the
app, reinstalls dependencies and rebuilds, and takes a few minutes with the site down while it
builds. `deploy.sh` does this.

A deploy never overwrites content: the package's `content/` only seeds the server on the very
first deploy.

## Deploying an update

```bash
npm run publish:prepare
```

That type-checks, lints, builds, and then writes `publish/kolabr-<timestamp>.zip` (about 15MB). Use
`npm run publish:package` to skip the checks when you have already run them.

Then sign in at `https://kolabr.com/admin/`, choose the file, and press **Upload and deploy**.

The panel shows each step: extracting, checking, backing up, stopping, installing, building,
starting, watching. **The site is down while it builds**, usually a minute or two, and the panel
cannot reach the server during that time. It says so and keeps watching; a failed poll is the
expected middle of a deploy, not a failure. When the server comes back it reports what happened.

If the new build does not answer within 25 seconds of starting, the deploy restores the backup and
the panel says "Rolled back". The site is back on the previous build; nothing is lost.

## What goes in the package

Source, not a build: the server builds it. [`scripts/create-deploy-zip.mjs`](scripts/create-deploy-zip.mjs)
excludes `node_modules`, `.next`, `.env*` (except the example), `publish/`, and `design/`, which is
74MB of mockups that only `npm run assets` needs. The images the pages import live in `assets/` and
are included.

`content/` ships too, but only ever seeds the server on the very first deploy. After that the
server's own copy is the source of truth, so a deploy can never overwrite a blog post written in the
back office.

## Server layout

```
/opt/kolabr/
  app/              the running site; wiped and replaced by every deploy
  content/          blog posts and page copy. Survives deploys (CONTENT_DIR)
  state/            admin sessions and contact form messages. Survives deploys (STATE_DIR)
  uploads/          packages received from the back office
  backups/          the last 5 builds, as tarballs
  deploy-logs/      per-deploy log and status JSON
  deploy.sh         root-owned. A deploy cannot change it
  .env.production   secrets. A deploy cannot change it
```

Content and state are reached through absolute paths, **not symlinks inside the app**. A symlink
that leaves the project root makes Turbopack fail the build outright with "leaves the filesystem
root", which is a confusing way to discover this.

## First install

On a fresh Ubuntu server, as root.

**1. Node 20+, nginx, unzip, curl**

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs nginx unzip curl
```

**2. The user and the directories**

```bash
adduser --system --group --home /opt/kolabr --shell /usr/sbin/nologin kolabr
mkdir -p /opt/kolabr/{app,content,state,uploads,backups,deploy-logs}
chown -R kolabr:kolabr /opt/kolabr
```

**3. The deploy and rebuild scripts, owned by root**

```bash
install -o root -g root -m 0755 deploy/deploy.sh /opt/kolabr/deploy.sh
install -o root -g root -m 0755 deploy/rebuild.sh /opt/kolabr/rebuild.sh
```

Neither may be writable by `kolabr`. If either were, the sudoers line below would hand that user
root.

**4. sudoers**

```bash
visudo -cf deploy/sudoers.kolabr && install -m 0440 deploy/sudoers.kolabr /etc/sudoers.d/kolabr
```

**5. Secrets**

```bash
install -o kolabr -g kolabr -m 0600 /dev/null /opt/kolabr/.env.production
```

Fill it in (see [.env.example](.env.example)): `NEXT_PUBLIC_APP_URL`, the three Resend variables,
and the admin account. Generate the password hash on your own machine:

```bash
node scripts/create-admin-password.mjs 'a long password'
```

Every `NEXT_PUBLIC_*` value is baked in at build time, so changing one means deploying again, not
just restarting. The others are read at runtime.

**6. The service and nginx**

```bash
install -m 0644 deploy/kolabr.service /etc/systemd/system/kolabr.service
systemctl daemon-reload && systemctl enable kolabr
install -m 0644 deploy/nginx.conf /etc/nginx/sites-available/kolabr.com
ln -s /etc/nginx/sites-available/kolabr.com /etc/nginx/sites-enabled/
certbot --nginx -d kolabr.com -d www.kolabr.com
nginx -t && systemctl reload nginx
```

**7. The first deploy**

There is no back office yet, because there is no app yet. Copy the first package up and run the
script by hand:

```bash
scp publish/kolabr-*.zip root@server:/tmp/
ssh root@server '/opt/kolabr/deploy.sh /tmp/kolabr-*.zip --foreground'
```

`--foreground` is right here: an SSH session is its own scope, so stopping the service does not kill
the script. Never use it from the app.

After that, deploys happen in the back office.

## Checks after a deploy

```bash
curl -I https://kolabr.com/                   # 200
curl -I https://kolabr.com/pricing            # 308 to /pricing/
curl -s https://kolabr.com/robots.txt         # names the sitemap, disallows /admin
curl -I https://kolabr.com/signup/            # 307 to the app, not 404
curl -I https://kolabr.com/admin/             # 307 to /admin/login/
```

Then send one message through the contact form and confirm it arrives with the sender as reply-to.
It should also appear under Messages in the back office, marked "Emailed".

## When something goes wrong

The panel links the deploy id. On the server:

```bash
cat /opt/kolabr/deploy-logs/<id>.log        # everything the deploy printed
cat /opt/kolabr/deploy-logs/<id>.json       # the status the panel polls
systemctl status kolabr
journalctl -u kolabr -n 100
```

Manual rollback, if the automatic one could not run:

```bash
ls -t /opt/kolabr/backups/
systemctl stop kolabr
find /opt/kolabr/app -mindepth 1 -maxdepth 1 -exec rm -rf {} +
tar -C /opt/kolabr/app -xzf /opt/kolabr/backups/app-<id>.tgz
chown -R kolabr:kolabr /opt/kolabr/app
systemctl start kolabr
```

The backup excludes `node_modules` and `.next`, so if the restore comes up empty, rebuild in place:
`su kolabr -s /bin/bash -c 'cd /opt/kolabr/app && npm ci && npm run build'`.

## Where the page copy lives

The words on the marketing pages are in `content/pages/*.json`, read at build time. The keys,
routes and slugs stay in TypeScript (`lib/page-meta.ts`, `lib/use-cases.ts`, `lib/compare.ts`,
`lib/legal.ts`, `lib/use-case-faqs.ts`), which is what keeps the two halves honest: **code owns
the shape, content owns the words.**

The back office patches individual strings by path and cannot add, remove or rename anything, so
an edit can change what a page says but never what a page expects. Links, image filenames and
section ids are not editable for the same reason. If a content file goes missing a key, the build
fails with the file named, and the rebuild leaves the previous build serving.

Pricing is the exception: it is still code (`lib/pricing.ts`), because the pricing table is a
client component and reads it directly. Changing a price is a deploy, not a publish.

## The contact form keeps its own copy

Every message is written to `/opt/kolabr/state/messages` before the email is attempted, and the
outcome recorded afterwards. A broken mail configuration or a Resend outage therefore loses
nothing: the enquiry is in the back office under Messages, flagged as not sent.

That directory holds personal data. It is inside `state/`, so it survives deploys and belongs in
whatever backup the server gets. Messages are deleted from the back office, one at a time, and
nothing prunes them automatically: decide a retention period before launch and say so in the
privacy policy, which currently describes enquiries as handled by support tooling.

## Hard rules

- **Do not remove the `systemd-run` re-exec in `deploy.sh`.** The deploy is launched from the
  service it is about to stop. Without its own cgroup, `systemctl stop` kills the deploy, its
  rollback handler and all, and the site stays down.
- **Caller-supplied values reach the script as flags, never environment variables.** sudoers uses
  `env_reset`, so `DEPLOY_ID=x sudo deploy.sh` is silently dropped and the panel polls a status file
  that never appears.
- **A failed poll is not a failed deploy.** The panel cannot tell "restarting" from "broken" by a
  failed request, so it keeps polling and lets the status file decide.
- **Content and state never live inside `app/`, and never as symlinks into it.** They would be
  destroyed by the next deploy, or break the build.
- **`deploy.sh` stays root-owned and not writable by `kolabr`**, or the sudoers line becomes a root
  escalation.
- **Never package secrets.** `.env*` is excluded and the packager refuses to add one; check anyway.
- **A rebuild must not be able to break the live build.** It builds into `.next-build` and only
  swaps it in once the build has succeeded, keeping the previous one until the new one answers.
- **A deploy cannot update `deploy.sh`, `rebuild.sh`, the unit, nginx or `.env.production`.** Those are installed
  by hand, on purpose: they are what recovers the site when a deploy goes wrong.

## The one exception to "everything is static"

`CLAUDE.md` says every content page is statically generated and the only server code is the contact
form. The back office is the deliberate exception: `/admin`, `/admin/login` and
`/api/admin/deploy/status` are dynamic. Every one of the 40 public pages is still static, and the
build output is the check: nothing else may appear as `ƒ (Dynamic)`.
