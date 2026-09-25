# Kolabr website

The marketing site for Kolabr, at [kolabr.com](https://kolabr.com), plus the back office that
publishes it.

Next.js 16 (App Router) and Tailwind 4, TypeScript throughout. Every public page is generated at
build time; the only server code is the contact form backend and the back office.

## Running it

```bash
npm install
npm run dev          # http://localhost:3000
```

The site runs with no configuration. The back office needs an account: see
[.env.example](.env.example) and

```bash
npm run admin:password -- 'a long password'
```

Put `ADMIN_EMAIL` and the printed `ADMIN_PASSWORD_HASH` in `.env.local`, then sign in at
`/admin/`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build. Every content page should report as static |
| `npm run assets` | Copies fonts from `design/` and converts its images to WebP in `assets/` |
| `npm run publish:prepare` | Type-check, lint, build, then write the deployment package |
| `npm run publish:package` | Just the package, into `publish/` |
| `npm run test:deploy` | Runs the deploy, rebuild and watchdog scripts against a fake server. Needs Linux (`zip`, `flock`, `perl`): run it on the server or in WSL, not Git Bash |

## How it is laid out

```
app/              routes: the marketing pages, /admin, and two API routes
components/       shared components, grouped by the pages that use them
lib/              content loaders, SEO helpers, the deploy and admin logic
content/          the words: blog posts (Markdown) and page copy (JSON)
design/           the finished design this site was built from: the source of truth
assets/           images the pages import, converted to WebP by npm run assets
deploy/           the server side: deploy and rebuild scripts, systemd unit, nginx, sudoers
docs/             the build report, SEO notes, metadata and FAQ reviews
```

**Code owns the shape, content owns the words.** Keys, routes and slugs live in TypeScript so the
compiler checks them; the strings live in `content/` so the back office can edit them without
being able to break a page.

## Deploying

You do not need SSH. Build a package locally, upload it in the back office, and watch it land;
content changes are published with a rebuild instead. The whole thing, including the one-time
server setup, is in [DEPLOY.md](DEPLOY.md).

## Worth reading first

- [CLAUDE.md](CLAUDE.md): the brief this was built to, and the rules that still apply
- [docs/build-report.md](docs/build-report.md): what was changed from the design and why, what is
  still open
- [docs/seo.md](docs/seo.md): how the site is set up for search, and what needs doing outside it
