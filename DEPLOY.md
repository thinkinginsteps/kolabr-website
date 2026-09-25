# Deploying kolabr.com

The site is updated by uploading a package in the back office. You build a zip locally, sign in at
`https://kolabr.com/admin/`, upload it, and watch it land. The server extracts and builds it **next
to the running site**, then stops the service just long enough to rename two directories and start
it again. If anything goes wrong it puts the previous build back.

No SSH is needed to deploy. SSH is needed once, to set the server up, and afterwards only to change
something outside the app: the deploy script, the systemd unit, nginx, or `.env.production`.

## Two ways to change the site

**Content** (a blog post, or the words on a marketing page): edit it in the back office under Blog
or Copy, then press **Publish changes**.
That rebuilds the site from the current content and swaps the new build in. It takes about a
minute, and the site stays up except for a few seconds at the swap. `rebuild.sh` does this.

**Code** (anything else): build a package locally and upload it under Deploy. That installs
dependencies and builds the new version in a staging directory while the current one keeps serving,
then swaps the two. It takes a few minutes, of which the site is down for the swap alone.
`deploy.sh` does this.

A deploy never overwrites content: the package's `content/` only seeds the server on the very
first deploy.

## Deploying an update

```bash
npm run publish:prepare
```

That type-checks, lints, builds, and then writes `publish/kolabr-<timestamp>.zip` (about 15MB). Use
`npm run publish:package` to skip the checks when you have already run them.

Then sign in at `https://kolabr.com/admin/` (`https://preview.kolabr.com/admin/` until launch), choose the file, and press **Upload and deploy**.

The panel shows each step: extracting, checking, backing up, **building**, stopping, swapping,
starting, watching, verifying. The site serves the old version throughout the build, which is the
slow part. It is down only between "stopping" and "starting", a few seconds, and the panel cannot
reach the server for that moment: a failed poll there is the expected middle of a deploy, not a
failure.

Three things can go wrong, and each has an answer:

| What happens | What the deploy does |
| --- | --- |
| The build fails | Stops there. The site was never touched and is still serving. |
| The new version does not start, or does not answer within 25 seconds | Swaps the previous build back and starts it. The panel says "rolled back". |
| A main page (`/`, `/pricing/`, `/blog/`, `/contact/`) does not answer afterwards | The same. A build that compiles but cannot render a page is still a failure. |

The previous build stays on disk as `/opt/kolabr/app.previous` until the next deploy, so the way
back is a rename rather than a rebuild. The back office shows whether it is there, under **The
server**.

## Changing the deploy scripts

They stop and start the live site, so there is no safe way to try them out on the server. Run them
against a fake one instead:

```bash
npm run test:deploy
```

That builds a tiny package, stands in for `systemctl`, `curl`, `su`, `flock` and `chown`, and walks
every path that matters: a failing build, a service that will not start, a page that does not
answer, an invalid package, a deploy killed outright mid-build, and each repair the watchdog makes.
Every case asserts the same thing at the end, which is the only rule that cannot bend: **the site
is running**.

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
  app/              the running site; replaced by every deploy
  app.previous/     the version before it, kept for an instant rollback
  .deploy-work/     where the next version is built while the current one keeps serving
  content/          blog posts and page copy. Survives deploys (CONTENT_DIR)
  state/            admin sessions and contact form messages. Survives deploys (STATE_DIR)
  uploads/          packages received from the back office
  backups/          the last 5 deploys' source, as tarballs
  deploy-logs/      per-deploy log and status JSON, and the watchdog's notes
  deploy.sh         root-owned. A deploy cannot change it
  rebuild.sh        root-owned. A deploy cannot change it
  watchdog.sh       root-owned. Runs every minute; see below
  .env.production   secrets. A deploy cannot change it
  .maintenance      create this file to silence the watchdog while working on the box
```

Content and state are reached through absolute paths, **not symlinks inside the app**. A symlink
that leaves the project root makes Turbopack fail the build outright with "leaves the filesystem
root", which is a confusing way to discover this.

## The site is never left stopped

Both scripts end by making sure the service is running, whatever happened on the way, including
when they are interrupted by a signal. The one case they cannot cover is being killed outright: a
`kill -9`, the out-of-memory killer or a power cut in the second between the two renames of the
swap leaves the site stopped with no code in place and no handler alive to fix it.

`kolabr-watchdog.timer` covers that last case, once a minute:

1. If a deploy or rebuild holds the lock, it does nothing. The site being briefly down during a
   swap is normal, and the deploy is handling itself.
2. If `app/` or `app/.next` is missing, an interrupted swap left it that way, and it puts the
   previous build back.
3. If the service is not running, it starts it.

It deliberately does **not** restart on a failing health check. A service that is up but answering
badly is a job for a person, not for a loop that would flap. Its last verdict is in the back office
under **The server**, and in `/opt/kolabr/deploy-logs/watchdog.log`.

Working on the box and want the site to stay down? `touch /opt/kolabr/.maintenance`, and remember to
remove it.

## Staying out of the way of the other sites on the server

The machine hosts more than this. A deploy therefore:

- **checks the disk first** and refuses to start below 3GB free, rather than filling the volume
  every other service shares;
- **runs the build under a ceiling**: its transient unit gets `CPUQuota=70%`, `MemoryMax=3G`,
  `Nice=10` and `IOWeight=50`, so a build cannot starve a neighbour of CPU, memory or disk I/O;
- **touches only its own unit**. `systemctl` is called with `kolabr` and nothing else, and the
  sudoers entry allows exactly two scripts, no other command.

Raise or lower the ceilings with `DEPLOY_CPU_QUOTA`, `DEPLOY_MEMORY_MAX` and `DEPLOY_MIN_FREE_MB`
in the environment of a manual run. A build with too little memory fails and leaves the site
serving, so erring low is safe.

## First install

On a fresh Ubuntu 24.04 server. SSH access is as a sudo user (not root); the target and key are in
`server.md` at the repo root, which is local only and never committed or packaged.

The site sits behind **Cloudflare** (proxied, SSL mode **Full (strict)**) with a **Cloudflare
origin certificate** on the server. There is no certbot: origin certificates last years and are
replaced by hand before they expire.

Until launch it answers only on **preview.kolabr.com**, with `X-Robots-Tag: noindex` on every
response. See [Going live](#going-live) for the switch.

**1. Run the installer**

[`deploy/install-server.sh`](deploy/install-server.sh) does the whole setup: Node 22 and nginx, the
`kolabr` user and directories, the root-owned scripts, sudoers, the systemd units and the nginx
configuration. It is safe to run again, and never overwrites `.env.production`, content, state or
the certificate. From the repo, on your machine:

```bash
scp -r deploy <user@host>:/tmp/kolabr-setup
ssh <user@host> 'sudo bash /tmp/kolabr-setup/install-server.sh'
```

The files must have LF line endings. The repo's `.gitattributes` guarantees that on any checkout,
and the installer refuses CRLF files rather than half-installing them.

What it leaves for you, and says so at the end:

- the site is not enabled in nginx until the certificate is installed (step 2);
- the watchdog stays off until the first deploy has produced a build (step 4);
- `.env.production` is created empty (step 3).

**2. The origin certificate**

Create it in Cloudflare (SSL/TLS, Origin Server), covering `kolabr.com` and `*.kolabr.com`, then on
the server:

```bash
sudo install -m 0644 -o root -g root origin.pem /etc/ssl/kolabr/origin.pem
sudo install -m 0600 -o root -g root origin.key /etc/ssl/kolabr/origin.key
sudo bash /tmp/kolabr-setup/install-server.sh     # enables preview.kolabr.com, prints the expiry
```

Put the expiry date somewhere it will be seen. Nothing renews it.

In Cloudflare: a proxied (orange cloud) DNS record for `preview` pointing at the server, and SSL
mode **Full (strict)**. Any other mode is wrong: "Flexible" talks HTTP to port 80, which redirects
to HTTPS, and the visitor loops forever.

nginx restores the visitor's address from `CF-Connecting-IP`, trusting it only from Cloudflare's
ranges ([`cloudflare-realip.conf`](deploy/nginx/conf.d/cloudflare-realip.conf)). The contact form
and admin login rate limits depend on it. Re-check the ranges against
<https://www.cloudflare.com/ips/> before launch.

**3. Secrets**

`/opt/kolabr/.env.production` (owner `kolabr`, mode 0600). Fill it in from
[.env.example](.env.example): `NEXT_PUBLIC_APP_URL`, the three Resend variables, and the admin
account. Generate the password hash on your own machine:

```bash
npm run admin:password -- 'a long password'
```

Every `NEXT_PUBLIC_*` value is baked in at build time, so changing one means deploying again, not
just restarting. The others are read at runtime (`sudo systemctl restart kolabr`).

The site builds and runs with the file empty: sign-up links go nowhere, the back office refuses
every login, and contact messages are kept under Messages but not emailed.

**4. The first deploy**

There is no back office yet, because there is no app yet. Build the package, copy it up and run
the script by hand:

```bash
npm run publish:prepare
scp publish/kolabr-<stamp>.zip <user@host>:/tmp/
ssh <user@host> 'sudo /opt/kolabr/deploy.sh /tmp/kolabr-<stamp>.zip --foreground'
```

`--foreground` is right here: an SSH session is its own scope, so stopping the service does not kill
the script. Never use it from the app. The deploy logs to `/opt/kolabr/deploy-logs/<id>.log`;
follow it from a second session.

Then run the installer once more to switch the watchdog on:

```bash
ssh <user@host> 'sudo bash /tmp/kolabr-setup/install-server.sh'
```

After that, deploys happen in the back office.

## Going live

Before launch, nginx answers for two names:

- **preview.kolabr.com**: the site, with `X-Robots-Tag: noindex` on every response.
- **kolabr.com** (and www, which redirects to it): a static "coming soon" page with the logo, from
  [`deploy/holding/`](deploy/holding/) installed to `/var/www/kolabr-holding`. It is served by nginx
  alone, so nothing of the site (no pages, no `/admin`, no API) is reachable there; every other
  path redirects to `/`. Also noindex.

Anything else, including the bare IP, is refused.

To launch, swap the holding page for the live site (the certificate already covers `kolabr.com`
and `www.kolabr.com`):

```bash
sudo ln -s /etc/nginx/sites-available/kolabr.com.conf /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/kolabr.com-holding.conf
sudo nginx -t && sudo systemctl reload nginx
```

The installer respects this: once `kolabr.com.conf` is enabled it leaves the holding page off, so
running it again after launch cannot bring the holding page back. The noindex header on the site
is sent only for the preview hostname, so kolabr.com is indexable as soon as it serves the site.
Keep preview enabled if it is still wanted: it stays noindex either way.

## Checks after a deploy

Use `preview.kolabr.com` until launch, `kolabr.com` after.

```bash
curl -I https://kolabr.com/                   # 200
curl -I https://kolabr.com/pricing            # 308 to /pricing/
curl -s https://kolabr.com/robots.txt         # names the sitemap, disallows /admin
curl -I https://kolabr.com/signup/            # 307 to the app, not 404
curl -I https://kolabr.com/admin/             # 307 to /admin/login/
```

On preview, every response should also carry `x-robots-tag: noindex, nofollow`.

Then send one message through the contact form and confirm it arrives with the sender as reply-to.
It should also appear under Messages in the back office, marked "Emailed".

## When something goes wrong

The panel links the deploy id. On the server:

```bash
cat /opt/kolabr/deploy-logs/<id>.log        # everything the deploy printed
cat /opt/kolabr/deploy-logs/<id>.json       # the status the panel polls
cat /opt/kolabr/deploy-logs/watchdog.log    # anything the watchdog had to repair
systemctl status kolabr
journalctl -u kolabr -n 100
```

**Manual rollback**, if the automatic one could not run. The previous build is a directory, so this
is a rename and a restart, not a rebuild:

```bash
systemctl stop kolabr
rm -rf /opt/kolabr/app.broken && mv /opt/kolabr/app /opt/kolabr/app.broken
mv /opt/kolabr/app.previous /opt/kolabr/app
systemctl start kolabr
```

Keep `app.broken` until you have worked out what happened, then delete it. Note that the next
deploy expects to write `app.previous` itself, so do not leave a hand-made one behind.

**If there is no `app.previous`** (the first deploy, or two failures in a row), restore the source
from a backup tarball and build it:

```bash
ls -t /opt/kolabr/backups/
systemctl stop kolabr
find /opt/kolabr/app -mindepth 1 -maxdepth 1 -exec rm -rf {} +
tar -C /opt/kolabr/app -xzf /opt/kolabr/backups/app-<id>.tgz
chown -R kolabr:kolabr /opt/kolabr/app
su kolabr -s /bin/bash -c 'cd /opt/kolabr/app && npm ci && npm run build'
systemctl start kolabr
```

The tarball is source only, without `node_modules` or `.next`, which is why that one has to build.

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
  swaps it in once the build has succeeded, keeping the previous one until the next rebuild.
- **Build first, stop second.** Both scripts build the new version while the old one is still
  serving. Moving the stop earlier would put the whole build inside the down time and make every
  failed build an outage.
- **Neither script may log through a pipe.** They append straight to their log file. A `tee` is a
  second process in the same group: a kill takes it out first and the exit handler then dies of
  SIGPIPE on its first message, with the site stopped, which is exactly the case it exists for.
- **The swap subshell clears the inherited traps.** Bash runs an inherited EXIT trap in forked
  subshells too; two copies of the handler racing on the status file leave it unreadable, and the
  panel then cannot say what happened.
- **A deploy cannot update `deploy.sh`, `rebuild.sh`, the unit, nginx or `.env.production`.** Those are installed
  by hand, on purpose: they are what recovers the site when a deploy goes wrong.

## The one exception to "everything is static"

`CLAUDE.md` says every content page is statically generated and the only server code is the contact
form. The back office is the deliberate exception: `/admin`, `/admin/login` and
`/api/admin/deploy/status` are dynamic. Every one of the 40 public pages is still static, and the
build output is the check: nothing else may appear as `ƒ (Dynamic)`.
