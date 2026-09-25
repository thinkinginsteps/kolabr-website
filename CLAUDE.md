# Kolabr Website: Build Instructions

You are converting a fully designed website into a production Next.js site. The design is finished. Your job is faithful recreation in proper, maintainable, SEO-ready code, not redesign.

## Source of truth

- `design/` contains every page as HTML, fully designed, with final copy, images and links.
- `design/assets/` contains all design elements, images and logos.
- Visuals, layout, copy and links come from `design/`. Do not change them unless a rule below requires it.
- If something in `design/` is broken, missing or contradicts a rule below, stop and report it rather than guessing.

## Stack

- Next.js, latest stable, App Router, TypeScript
- Tailwind CSS, latest stable
- npm
- Runs as a Node server: `output: 'standalone'` in `next.config`. The server exists to host the BFF (see Integrations).
- Every content page is statically generated at build. No dynamic rendering, no runtime data fetching, no `cookies()` or `headers()` in pages. If a page would render dynamically, treat it as a bug.
- The only server code is the BFF under `app/api/`. Keep it that way.
- `trailingSlash: true`
- Use `next/image` with optimisation on. Source images in WebP, always with width and height.

## About Kolabr

Kolabr is a collaboration platform built around channels. A channel is a shared workspace where a team and the people it works with (clients, partners, suppliers, other departments) work together. Each channel holds chat, requests, meetings, scheduled events and a wiki. Users are paid accounts. Guests are invited by email link and are free.

Kolabr is not helpdesk software. Never describe it as one.

Kolabr is an independent entity. Do not reference or imply connection to any other company or product. The product was previously called ChannelFlow, ChanFlow or Channel Flow. Those names are retired. If you find them anywhere in `design/`, flag them.

## Copy rules

Copy is final. Do not rewrite it. The exceptions:

- **No em dashes anywhere.** Replace with a comma, full stop or parentheses and list every change in your report.
- Spell the name **Kolabr** exactly.
- Flag, do not fix, any use of: "ticket", "helpdesk", "support desk", "service desk", "agent", "outsiders", "external parties", "third parties", "seats". Dom approves replacements.

## Routes

Map every file in `design/` to a route. Expected routes:

```
/  /product  /pricing  /use-cases  /compare  /security  /about  /contact
/signup  /privacy  /terms  /dpa

/product/channels  /product/chat  /product/requests  /product/meetings
/product/scheduled-events  /product/wiki  /product/administration

/use-cases/schools  /nonprofits  /architecture-firms  /engineering-firms
/marketing-agencies  /accounting-firms  /law-firms  /it-service-providers
/construction  /property-management  /clinics  /logistics  /manufacturing
/client-services  /internal-it  /hr-teams  /procurement  /project-delivery

/compare/slack  /teams  /basecamp  /notion  /clickup  /zendesk
```

Reserve `/blog` but do not build it.

Before writing any page, produce a route map: each design file, its route, and any mismatch with the list above (missing, extra, or differently named). Wait for Dom to confirm it.

## Components

Extract anything that repeats into a shared component rather than copying markup per page. Likely candidates: Nav, Footer, Section, GlassCard, Button, FeatureCard, FAQ, CompareTable, PricingCard, CTA band, Breadcrumbs. Page files should read as content, not layout.

Use `next/link` for all internal links. Nothing should 404.

## Design system

Read the exact values from `design/`. Expected tokens:

```
--ink          #33505B
--ink-muted    #5D7380
--accent       #15C0E8
--surface      #FFFFFF
--surface-tint #F2F6FA
--border       #DDE6ED
```

- Define tokens as CSS variables and map them into the Tailwind theme. No hardcoded hex values in components.
- Structure tokens so dark mode can be added later.
- Content max width 1400px.
- Font: Switzer, self-hosted WOFF2 via `next/font/local`, preloaded. Two weights, regular and semibold.
- `--accent` on white fails text contrast. Never use it for body text or small labels.
- Glass morphism belongs on the nav, floating feature cards, the highlighted pricing card and modals. Never apply backdrop blur to full-width sections. If the design does, flag it.

## Motion

- Recreate the animations in `design/` faithfully.
- Prefer CSS transitions plus a small IntersectionObserver hook. Add a motion library only if an effect genuinely needs it, and say why.
- Animate only `transform` and `opacity`. Nothing may shift layout.
- Respect `prefers-reduced-motion` everywhere.

## SEO

- Metadata API on every page: unique title (50 to 60 characters) and meta description (140 to 155 characters). Use values from `design/` where they exist. Where missing, list the page rather than inventing copy.
- One H1 per page. No skipped heading levels.
- Canonical URL on every page, with trailing slash, on `https://kolabr.com`.
- Open Graph and Twitter card tags with a per-page image.
- `sitemap.ts` and `robots.ts`, generated at build.
- JSON-LD: Organization and WebSite on home, SoftwareApplication on `/product` and `/pricing`, FAQPage on every use case and compare page, BreadcrumbList sitewide.
- All text in the DOM at build time. No text in images, nothing injected after load.

## Performance targets

LCP under 2.5s, CLS under 0.1, Lighthouse 90+ on performance, accessibility, best practices and SEO for every page type.

## Integrations

**App links.** Sign up and sign in are handled by the Kolabr app. Link to `${NEXT_PUBLIC_APP_URL}`. The URL is not yet known, leave it as an env variable.

**Contact form BFF (Resend).** The site has its own backend for frontend as a Route Handler at `app/api/contact/route.ts`, accepting `POST` only.

- Validate the payload server-side with zod. Never trust the client validation alone.
- Honeypot field: if filled, return success and send nothing.
- Rate limit by IP (for example 5 requests per 10 minutes). An in-memory limiter is acceptable for a single instance. Note in code that multiple instances would need a shared store.
- Reject requests whose `Origin` is not the site's own domain.
- Send via the Resend Node SDK. Set `reply-to` to the sender's email.
- Return JSON `{ ok: true }` or `{ ok: false, error }` with correct status codes. Never leak internal error details.
- Server-only env: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`. The from address must be on a domain verified in Resend. None of these may carry the `NEXT_PUBLIC_` prefix.
- Frontend: the form posts to `/api/contact` with client-side validation, loading, success and error states. No page reload.

If other forms appear in `design/` (newsletter, demo request), route them through the same BFF pattern, one handler per form.

**Analytics.** Google Analytics via `next/script`, loaded only when `NEXT_PUBLIC_GA_ID` is set. Wrap it in a single analytics module so more tools can be added later without touching pages.

Provide `.env.example` with every variable: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_GA_ID`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`.

## Deployment

Self-hosted. The standalone build runs with `node server.js` behind nginx as a reverse proxy, kept alive by systemd or pm2. Serve `/_next/static` and `public/` directly from nginx with long cache headers. Include a sample nginx config and a short `DEPLOY.md`.

## Open items (do not decide these, ask)

- App URL for signup and signin
- The verified sending domain and recipient address for Resend
- Cookie consent. The site targets all markets including the EU, so GA will likely need a consent banner. Raise it before launch.

## Work order

1. Inventory `design/` and produce the route map. Stop for confirmation.
2. Set up the project, tokens, fonts and the shared layout (Nav, Footer).
3. Build the five reference pages: `/`, `/product/requests`, `/use-cases/architecture-firms`, `/compare/slack`, `/pricing`. Stop for review.
4. Build the remaining pages from the approved components.
5. SEO pass, integrations and BFF. Run `npm run build` and confirm every content page is reported as static. Test the contact form end to end with `npm start`.
6. Report: em dash fixes, flagged terms, missing metadata, anything in `design/` that was unclear.
