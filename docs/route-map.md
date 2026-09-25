# Kolabr website: design inventory and route map

Step 1 of the work order in `CLAUDE.md`. No project code has been written. Everything below comes from scanning `design/` on 22 September 2026.

**Short version**

- 35 of the HTML files are site pages. They map cleanly onto 30 of the 43 expected routes, plus 4 extra pages (Mobile app, Small details, Cookies, Refunds).
- 13 expected routes have no design: `/product`, `/use-cases`, `/compare`, `/security`, `/signup`, `/dpa`, `/product/scheduled-events`, and 5 use cases (`client-services`, `internal-it`, `hr-teams`, `procurement`, `project-delivery`).
- No em dashes and no retired product names on any site page. Flagged terms are everywhere, mainly "seat(s)" and "helpdesk", plus "ticket" and "agent" on a few pages (full list in the appendix).
- Every page has the same canonical URL, OG image and JSON-LD, copied from the home page. 29 of 35 titles and 19 of 35 descriptions are outside the length limits.
- The legal pages still say `[COMPANY NAME]`.
- The design uses weights 700 and 800 and loads Switzer from the Fontshare CDN. The only local fonts are OTF, 300 to 700, with no 800 and no WOFF2.

---

## 1. Inventory

`design/` holds 338 files, 84 MB.

### 1.1 Site pages (35 files, in scope)

| Group | Files |
|---|---|
| Core | `Home`, `Pricing`, `About`, `Contact` |
| Product | `Channels`, `Product - Channel Chat`, `Product - Requests`, `Product - Meetings`, `Product - Wiki`, `Product - Administration`, `Product - Mobile App`, `Product - Details` |
| Use cases (13) | Accounting Firms, Architecture Firms, Clinics, Construction, Engineering Firms, IT Service Providers, Law Firms, Logistics, Manufacturing, Marketing Agencies, Nonprofits, Property Management, Schools |
| Compare (6) | Basecamp, ClickUp, Notion, Slack, Teams, Zendesk |
| Legal | `Privacy`, `Terms`, `Cookies`, `Refunds` |

All files are named `<Name>.dc.html`. They are templates for a design-tool runtime (`<x-dc>`, `<helmet>`, `{{ }}` bindings, `<sc-if>`/`<sc-for>`, and a `class Component extends DCLogic` script at the bottom). They are not plain static HTML, so behaviour (menus, pricing toggle, hero carousel, form state, scroll reveal) has to be read from the embedded script. I have read it for every interactive piece listed below.

### 1.2 Not pages (source material, out of scope as routes)

| Path | What it is |
|---|---|
| `Screen - *.dc.html` (7) | Full-screen mockups of the Kolabr app (dashboard, chat, events, requests, wiki, mobile, school chat). Source for the screenshot PNGs. |
| `screens/*.dc.html` (78) | The same app mockups themed per industry (ACC, Arch, CLN, Con, ENG, ITSP, LAW, LOG, MFG, Mkt, NPO, PM), six screens each. Source for `assets/screens/*.png`. |
| `bases/*.txt` (7) | Templates for the mockups and a blank page shell. |
| `uploads/Kolabr Interface/*.html` (6) | The original app UI HTML the mockups were built from. |
| `uploads/*.png`, `*.jpg`, `logo.svg` (51) | Reference screenshots and duplicate copies of the competitor logos and Kolabr logo. |
| `uploads/Kolabr_Tier_Pricing.xlsx` | Internal pricing and feature matrix. It matches the Pricing page table. Its notes column has internal commentary ("Core ticketing", "Real Pro trigger") that must never reach the site. |
| `support.js`, `image-slot.js` | Runtime for the design tool. Not used in the build. |
| `.thumbnail` | Design tool thumbnail. |

### 1.3 Assets (`design/assets/`, 158 files, 61 MB)

| Kind | Files | Notes |
|---|---|---|
| Kolabr logo | `logo.svg`, `screens/kolabr-logo.svg`, `screens/kolabr-logo-dark.svg` | The site nav and footer use an **inline SVG** logo (viewBox `0 0 538.39 105.77`), not these files. `logo.svg` is only referenced by the JSON-LD `logo` URL. |
| Product screenshots, desktop | 29 × `ui-*.png`, `app-*.png` (about 1690×1017 up to 1920×964) | Used on Home and the Product pages. |
| Product screenshots, mobile | 6 × `app-m-*.png` (520×965) | Mobile app page. |
| Industry screenshots | 104 × `screens/*.png` (up to 3208×1824) | Use case and compare pages. |
| Competitor logos | `logo-slack.png`, `logo-teams.jpg`, `logo-basecamp.png`, `logo-notion.png`, `logo-clickup.jpg`, `logo-zendesk.png` | Home "How does Kolabr compare?" section. |
| Avatar photos | `screens/sm-photo-*.png` (4) | Only used inside the app mockups. |
| Fonts | `screens/switzer-300/400/500/600/700.otf` | OTF only. No WOFF2, no 800. See 5.9. |

**Every image is PNG or JPG.** The brief requires WebP, so all used images will need converting during setup. All `<img>` tags have alt text and width/height, except the 6 competitor logos on Home, which have no width/height.

**Unused assets (38).** These are not referenced by any site page. I will leave them out of `public/` unless you say otherwise:
`app-chat`, `app-dashboard`, `app-events`, `app-mobile`, `ui-dashboard-dark`, `ui-thread`, `ui-wiki-kb`, and 26 industry screens (`ac1-chat`, `ac2-mobile`, `c1-chat`, `c2-requests`, `c3-requests`, `c4-dashboard`, `c5-wiki`, `c7-mobile`, `e1-chat`, `e2-mobile`, `e3-mobile`, `f1-chat`, `f2-mobile`, `g1-chat`, `g2-mobile`, `i1-chat`, `l1-chat`, `l2-chat`, `l2-dashboard`, `l2-requests`, `l3-mobile`, `m1-chat`, `m2-mobile`, `p1-chat`, `p2-mobile`), plus `logo.svg` and the five OTF fonts.

---

## 2. Route map

### 2.1 Design file to route

| Design file | Route | Status |
|---|---|---|
| `Home` | `/` | OK |
| `Pricing` | `/pricing` | OK |
| `About` | `/about` | OK |
| `Contact` | `/contact` | OK |
| `Privacy` | `/privacy` | OK |
| `Terms` | `/terms` | OK |
| `Channels` | `/product/channels` | OK. Also the target of the top-level "Product" nav link. |
| `Product - Channel Chat` | `/product/chat` | OK. Named differently (file says "Channel Chat"). |
| `Product - Requests` | `/product/requests` | OK |
| `Product - Meetings` | `/product/meetings` | OK. The nav and footer label this link **"Scheduled Events"**, and it is the only design for both `/product/meetings` and `/product/scheduled-events`. |
| `Product - Wiki` | `/product/wiki` | OK |
| `Product - Administration` | `/product/administration` | OK |
| `Product - Mobile App` | `/product/mobile-app` (proposed) | **Extra.** In nav, footer and mobile menu as "Mobile app". |
| `Product - Details` | `/product/details` (proposed) | **Extra.** In nav as "Small details". |
| `Cookies` | `/cookies` (proposed) | **Extra.** In footer. |
| `Refunds` | `/refunds` (proposed) | **Extra.** In footer. |
| `Use Case - Schools` | `/use-cases/schools` | OK |
| `Use Case - Nonprofits` | `/use-cases/nonprofits` | OK |
| `Use Case - Architecture Firms` | `/use-cases/architecture-firms` | OK |
| `Use Case - Engineering Firms` | `/use-cases/engineering-firms` | OK |
| `Use Case - Marketing Agencies` | `/use-cases/marketing-agencies` | OK |
| `Use Case - Accounting Firms` | `/use-cases/accounting-firms` | OK |
| `Use Case - Law Firms` | `/use-cases/law-firms` | OK |
| `Use Case - IT Service Providers` | `/use-cases/it-service-providers` | OK |
| `Use Case - Construction` | `/use-cases/construction` | OK |
| `Use Case - Property Management` | `/use-cases/property-management` | OK |
| `Use Case - Clinics` | `/use-cases/clinics` | OK |
| `Use Case - Logistics` | `/use-cases/logistics` | OK |
| `Use Case - Manufacturing` | `/use-cases/manufacturing` | OK |
| `Compare - Slack` | `/compare/slack` | OK |
| `Compare - Teams` | `/compare/teams` | OK. Also the target of the top-level "Compare" nav link. |
| `Compare - Basecamp` | `/compare/basecamp` | OK |
| `Compare - Notion` | `/compare/notion` | OK |
| `Compare - ClickUp` | `/compare/clickup` | OK |
| `Compare - Zendesk` | `/compare/zendesk` | OK |

### 2.2 Expected routes with no design file (13)

| Route | Notes |
|---|---|
| `/product` | No overview page. The footer "Product overview" link points to `#` (or to a `#product` anchor that doesn't exist on Home). The nav "Product" link goes to Channels. |
| `/product/scheduled-events` | Only one design (`Product - Meetings`) covers both meetings and scheduled events. |
| `/use-cases` | No index page. The nav "Use cases" link is `#` and only opens the mega menu. |
| `/compare` | No index page. The nav "Compare" link goes to `/compare/teams`. |
| `/security` | No design, and nothing links to it. The Contact form offers "Security review" as a topic. |
| `/signup` | No design. The brief says sign-up is handled by the app at `NEXT_PUBLIC_APP_URL`. |
| `/dpa` | No design, and nothing links to it. |
| `/use-cases/client-services` | Missing |
| `/use-cases/internal-it` | Missing |
| `/use-cases/hr-teams` | Missing |
| `/use-cases/procurement` | Missing |
| `/use-cases/project-delivery` | Missing |

The use cases mega menu only has a "By industry" column, so there is no slot yet for the five functional use cases.

### 2.3 Reserved

`/blog`: not built. The design already has a hidden "Blog" nav item behind a `showBlog` toggle (default off). I will keep it hidden and leave the route unbuilt.

---

## 3. Shared components

I checked every site page. "All pages" means all 35.

| Component | What it is | Pages |
|---|---|---|
| **SiteNav** | Fixed glass nav bar (max 1400px). Logo, links, Sign in, Start free trial. Three mega menus (Product, Use cases, Compare) that open on hover, focus or click and close on a 260ms delay or Escape. Includes a mobile "Menu" sheet. | All pages |
| **MegaMenu / PromoCard** | Glass dropdown panels. The dark "Free trial / Want to see it at work?" promo card sits inside Product and Use cases. | All pages (inside SiteNav) |
| **MobileSheet** | Full menu for narrow screens (Product, Use cases, Compare, Pricing, Contact, Sign in). | All pages |
| **Footer** | Dark footer: logo, tagline, four link columns, copyright and legal links. | All pages |
| **Button** | Primary (ink fill), secondary (glass outline), on-dark (white fill), text link with arrow. Hover lifts 2px. | All pages |
| **Section** | Width wrapper (1400px, 40px gutters), vertical rhythm, alternating `surface` / `surface-tint` backgrounds. | All pages |
| **SectionHeader** | Eyebrow (uses `#0B7A96`), H2 and intro paragraph. | All pages |
| **PageHero** | Radial accent gradient, eyebrow pill, H1, lede, CTAs, optional screenshot. | All except Home and Pricing |
| **HomeHero + ScreenshotStack** | 3D stacked screenshots that rotate every 4.2s (4 frames). Collapses to one frame below 1080px. Paused under reduced motion. | Home |
| **LegalHero** | Smaller hero with "Last updated" date. | Privacy, Terms, Cookies, Refunds |
| **CTABand** (`#cta`) | Radial gradient band with H2, line, and two buttons (Start free trial, Talk to us). Heading and line change per page. | 31 pages (not the four legal pages) |
| **FeatureCard / FeatureGrid** | H3 + text cards in a grid that reveals as a staggered group. | Nearly all non-legal pages |
| **WideCard** (`data-reqcard`) | Glass card, full grid width, text plus screenshot. | Channels, Channel Chat, Requests, Meetings, Wiki, Administration, Mobile App, Details, all 13 use cases |
| **ScreenshotFrame** | Framed `next/image` screenshot with shadow. | Home, all Product, all Use cases, all Compare |
| **PhoneFrame** | Mobile screenshot in a phone frame. | Channels, Requests, Mobile App, Details, all 13 use cases |
| **FloatingChip** | Small glass badge over a screenshot with a slow float animation (`kFloat`). | Channels, Channel Chat |
| **ChannelExamples** | "Where a practice puts its channels" grid of example channels. | All 13 use cases |
| **StageSteps** | Three-step "start / next / pay" row. | All 13 use cases, Home |
| **PricingCards + BillingToggle** | Starter / Pro / Max with a Monthly/Yearly switch ($9.99 / $19.99 / $39.99 per month, or $109.89 / $219.89 / $439.89 per year, "11 months, 1 free"). Pro is highlighted. | Home, Pricing |
| **PlanComparisonTable** | Full feature matrix, grouped rows, included/not-included icons. | Pricing |
| **CompareTable** (`data-cmp`) | Kolabr vs competitor, feature by feature. | All 6 compare pages |
| **CompareSummary** | "The short version" and "Proof takes one week" cards in the hero. | All 6 compare pages |
| **CostComparison** | "What each one actually costs you" block. | All 6 compare pages |
| **FAQ** | Static question and answer list. No accordion in the design. | All 6 compare pages (see 5.8: use cases have none) |
| **CompetitorGrid** | Competitor logo cards. | Home |
| **UseCaseGrid** | Grid of use case links. | Home |
| **LegalLayout** | Sticky table of contents, "In short" box, numbered sections, closing "Questions" block. | Privacy, Terms, Cookies, Refunds |
| **LegalTable** | Simple data table. | Privacy, Cookies, Refunds |
| **ValuesRow** | "What we believe" rows. | About |
| **ContactForm** | See section 4. | Contact |
| **ThemeRevealSlider** | Drag handle that wipes between light and dark screenshots (pointer-driven). | Details |
| **AppStoreBadges** | App Store and Google Play buttons. | Mobile App |
| **Reveal hook** | IntersectionObserver fade and rise (26px, 0.6s, 75ms stagger, threshold 0.1). Only applies to elements below the fold, and is off under reduced motion. | All pages |
| **JsonLd / Breadcrumbs** | Structured data. **The design has no visible breadcrumbs.** | All pages (JSON-LD only) |

All motion in the design uses only `transform` and `opacity` except the mega menu background tint and the Details slider (which moves a clip). I don't expect to need a motion library.

---

## 4. Forms

Only one form exists: **Contact**. There is no newsletter or demo request form anywhere.

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` "Your name" | text, `autocomplete=name` | Yes | |
| `email` "Work email" | email, `autocomplete=email` | Yes | |
| `company` "Company" | text, `autocomplete=organization` | No | |
| `size` "People on your team" | select: 1 to 5 / **6 to 20** (default) / 21 to 60 / 61 to 200 / More than 200 | No | |
| topic "What is this about?" | chip buttons: **A trial** (default) / Pricing or plans / Security review / Something else | No | These are buttons, not form inputs. I'll send the value as a hidden field. |
| `message` "How do you work with people outside your company?" | textarea, 5 rows | No | |

- The design has a success state only. The button changes to "Thank you, we have it" and the note changes to "We reply within one working day, to the address you gave us." **There is no error state or validation message copy.**
- No honeypot in the design. I'll add a visually hidden one as the brief asks.
- Placeholders are sample content ("Nadia Fourie", "Reyes + Malan", and a sample message).
- Legal pages send privacy and support requests to "the contact form". There is no published email address anywhere on the site.

---

## 5. Rule breaks and problems in `design/`

### 5.1 Em dashes

- **Site pages: none.** Zero em dashes in visible text, alt text, metadata or scripts on all 35 pages. No fixes needed.
- **App mockups: many.** About 960 across `Screen - *`, `screens/*` and `bases/*` (for example "Transport change — Sipho off the afternoon bus"). This text is baked into the screenshot PNGs shown on the site, so it can't be fixed in code. Removing it means regenerating the screenshots.
- FYI, not a rule break: `Compare - Teams` uses en dashes in price ranges ("$9.99 – $39.99", "$4 – $22").

### 5.2 Retired product names

None. ChannelFlow, ChanFlow and Channel Flow do not appear in any HTML, text or script file. I cannot check text inside the images; the reference screenshots in `uploads/` are the most likely place for the old name.

### 5.3 Flagged terms (not changed, for Dom to approve)

Summary by term (site pages only, full excerpts in the appendix):

| Term | Where |
|---|---|
| **"helpdesk"** | **All 35 pages**, via the Compare mega menu line for Zendesk: "Helpdesk software, which Kolabr is not". Also in body copy on Compare Basecamp, Teams and Zendesk (many), and Product Requests ("Is this a helpdesk, or a task manager?"). |
| **"seat(s)"** | 27 pages. Pricing, Terms and Refunds use it as the plan unit ("Seats per channel", "Accounts, seats and guests"), and so does the seat-count paragraph on all 13 use cases. Also Admin ("Staff seats"), Mobile App ("included with every seat", including the meta description), Details, Meetings, About and all compare pages. |
| **"ticket(s)"** | IT Service Providers (heavily, including meta description and headings "Tickets from conversation"), Zendesk, Requests, and alt text on Channels and Channel Chat ("ticket number"). |
| **"service desk"** | IT Service Providers (heading "A service desk your clients will actually use", a channel named "Service desk", og description), Teams. |
| **"agent(s)"** | Zendesk (throughout, and the meta description "per-agent pricing"). Administration has a **product role called "Agent"** ("Admin, agent or participant"). Requests ("per-agent bill"), Wiki ("the next agent"). **"Site agent"** (a construction job title) on Architecture, Engineering and Construction. **"Managing agent"** (property job title) on Property Management. |
| **"outsider(s)"** | About, Notion ("How an outsider joins"). My scan also caught "outside your company" on Contact, Teams and others, which is a different phrase and not on the list. |
| **"third parties" / "third-party"** | Cookies (section heading "3. Third parties", "no third-party trackers"), Slack and Teams ("a third-party tool / helpdesk"). |
| "support desk", "external parties" | Not found. |

Some of these are hard to replace. "Agent" is a role name in the product UI, "site agent" and "managing agent" are real job titles, and Zendesk genuinely prices per agent. The app screenshots also contain "ticket" (65 hits), "agent" (61) and "service desk" (48), and those can only be changed by regenerating the images.

### 5.4 Glass blur

No backdrop blur on any full-width section. Where blur is used:

| Element | Pages | Allowed by brief? |
|---|---|---|
| Nav bar | All | Yes |
| Mega menus and mobile sheet | All | I treat these as overlay panels (like modals). Please confirm. |
| **Secondary buttons** ("Sign in", "Talk to us" style, 14px blur) | All / 31 | **Not in the allowed list.** |
| **Hero eyebrow pill** ("Pay for your team, not your clients") | Home | **Not in the allowed list.** |
| **WideCard** (glass card spanning the full content grid) | 21 pages | Floating card, so probably allowed. It does span the full 1400px container, though. |
| FloatingChip | Channel Chat | Yes (floating feature card) |
| Highlighted pricing card | | The design gives Pro a highlight but **no blur**. |

Should I keep the blur on the buttons and the pill (faithful to the design) or drop it (strict brief)?

### 5.5 Links

No link points to a missing file, and there are no external links at all. The problems are placeholders:

- **301 `href="#"` links** across the site:
  - "Sign in" and "Start free trial" in the nav, the "Sign up" footer link, CTA buttons and pricing card buttons should go to `NEXT_PUBLIC_APP_URL`. Some "Start free trial" buttons point to `#cta` instead, which scrolls to the CTA band.
  - **Home "Take a closer look" cards**: Channel chat, Wiki, Administration and **Analytics** all link to `#`. There is no Analytics page. I'd point the first three at their product pages.
  - **Home "How does Kolabr compare?" cards**: all six link to `#`, not to the compare pages. I'd point them at the compare pages.
  - Footer "Product overview" links to `#` (no `/product` page).
  - Nav "Use cases" links to `#` (menu only).
  - Mobile App: App Store and Google Play buttons (×2 each) and "Get started". There are no store URLs.
- **Broken anchors**: the footer "Start free trial" links to `#cta`, but the four legal pages have no `#cta` section. Home's "Product overview" links to `#product`, which doesn't exist on Home.
- The nav **Compare** link goes to `/compare/teams`, and **Product** goes to `/product/channels`. That looks deliberate but may change once index pages exist.

### 5.6 Images

- No missing image files.
- All are PNG or JPG and need WebP conversion. The largest are 3208×1824, and `assets/screens` alone is 53 MB.
- The screenshots contain app UI text, including em dashes and flagged terms (see 5.1 and 5.3). The brief's "no text in images" rule can't apply literally to product screenshots. I assume screenshots are fine as long as all marketing copy is live text, which it is.
- **No OG images exist.** Every page points to `https://kolabr.com/og/home.webp`, which isn't in `design/`.
- Six competitor logos are shown on Home. Showing their marks is normal on comparison pages, but you should be comfortable with it given the rule about implying connections.

### 5.7 SEO metadata

- **Canonical, `og:url`, `og:image` and JSON-LD are identical on every page** (`https://kolabr.com/`, `og/home.webp`, and Organization + WebSite + a single-item Home breadcrumb). They were copied from the page shell. I will generate the correct values per page. That is mechanical, not new copy.
- No `twitter:title`, `twitter:description` or `twitter:image`. I'll derive them from the OG values.
- **Titles need to be 50 to 60 characters.** Only 6 pass: Compare Basecamp (54), ClickUp (53), Notion (52), Slack (51), Zendesk (56), Contact (52).
  - Too long: Home (64), Compare Teams (61).
  - Too short (13 to 42 characters): every other page. For example "Kolabr | Pricing" (16) and "Kolabr | Wiki" (13). Use case titles repeat the brand: "Kolabr | Kolabr for schools".
- **Descriptions need to be 140 to 155 characters.**
  - Pass (16): Home, About, Channels, Slack, Zendesk, Pricing, Administration, Meetings, Requests, Wiki, Clinics, Construction, Engineering, Law, Manufacturing, Property Management.
  - Too long: Basecamp 162, ClickUp 158, Notion 157, Teams 158, Channel Chat 174, Details 169, Accounting 187, Architecture 179, IT Service Providers 168, Logistics 164, Marketing 174, Nonprofits 176.
  - Too short: Contact 137, Mobile App 138, Schools 136, Terms 131, Privacy 130, Cookies 118, Refunds 115.
  - **Duplicates:** Channels and Pricing reuse the Home description word for word.
- Per the brief I will not invent copy. Pages with non-compliant or duplicate metadata need new titles and descriptions from you. That is 29 titles and 21 descriptions (19 out of range plus the 2 duplicates).
- There is no metadata at all for the 13 routes without designs.

### 5.8 Structure and headings

- One H1 per page everywhere.
- **Pricing skips a level**: H1 "Pay for your team, invite everyone else" goes straight to H3 "Starter / Pro / Max". I'd make the plan names H2, with no visual change.
- **Use case pages have no FAQ**, but the brief requires FAQPage JSON-LD on every use case page. I need FAQ copy for all 13, or permission to skip FAQPage there.
- The brief lists Breadcrumbs as a component, but the design shows none. I plan to use BreadcrumbList JSON-LD only, with no visible breadcrumbs, so the design stays unchanged.

### 5.9 Fonts and weights

- The design loads Switzer from the Fontshare CDN at weights **400, 600 and 800**. The brief says self-hosted WOFF2, regular and semibold only.
- In use: 400 (body), 600, **800** (every H1 and large headings, all pages) and **700** (46 places on Home and Pricing: small badges, check marks, prices).
- The local files are OTF only, at 300, 400, 500, 600 and 700. **There is no 800 file at all.**
- Options:
  - (a) Get Switzer 400, 600 and 800 as WOFF2 and allow three weights.
  - (b) Map 800 and 700 down to 600, which will visibly soften the headings.

  Either way I need WOFF2 files or permission to convert the OTFs. Check the Switzer licence (Fontshare's ITF Free Font Licence allows self-hosting).

### 5.10 Colour and contrast

- The tokens match the brief exactly. The design also defines `--glass`, `--glass-line`, `--shadow-sm/--shadow/--shadow-lg`, `--deep`, `--footer` (`#22363E`), `--on-deep` and `--on-deep-muted`, **and already has a full `[data-theme="dark"]` token set**. I'll carry all of them over.
- `#0B7A96` is hard-coded 160 times as the eyebrow and label colour. It is the accessible, darker version of the accent. I'll make it a token (`--accent-ink`). Smaller one-off colours (status reds, greens and ambers in mock UI chips) also become tokens.
- **Accent used as text on white:**
  - The global rule `a:hover { color: var(--accent) }` turns every hovered link cyan. That's small text in many places.
  - On Home, "See pricing" and the 12px "Guests, free" label use `--accent` on a light background.
  - "GUEST" on Channel Chat.
  - The "Free trial" labels in the mega menu are accent on the dark card, which is fine.

  I'd use `--accent-ink` for all the light-background cases. That is a slight visual change, so please confirm.

### 5.11 Content that is unfinished or contradicts itself

- **`[COMPANY NAME]` placeholder** appears in Privacy, Terms, Cookies and Refunds, in the ledes and the legal body ("Kolabr is operated by [COMPANY NAME]"). I need the legal entity name.
- The legal pages say "Last updated 21 September 2026", Terms is governed by South African law, and Privacy is written for POPIA with GDPR secondary. Just confirming this is intended for a site that targets all markets.
- **SLA claim conflict:** Compare Zendesk says "SLAs on every plan" and "Response-time targets on every plan rather than a higher tier". But the Pricing table shows **SLA profiles as not included on Starter**. Home's Product menu also says "Owner, category, SLA and status on every item".
- Terms says Pro and Max "have the response targets set out on the pricing page". The pricing page lists "Priority support" and "Dedicated account manager", but no response targets.
- The Home "Take a closer look" section has an **Analytics** card with no matching page.
- The compare pages quote competitor prices (for example Slack, Teams $4 to $22, ClickUp $7 and $12, Zendesk $19, $55 and $115). They will go out of date and should be re-checked just before launch.
- The Contact page script has leftover carousel code for three screenshots, but no images. It's harmless and I'll drop it.

---

## 6. What I need from you

**Routes**

1. **Missing pages.** For `/product`, `/use-cases`, `/compare`, `/security`, `/dpa` and the five functional use cases, will designs come later, or should I leave them out of the build for now? Nothing will link to them until they exist, so nothing 404s.
2. **`/product/scheduled-events` vs `/product/meetings`.** There's one design for both. Should I build it at `/product/meetings` only, or at `/product/scheduled-events` (the nav label) with `/product/meetings` redirecting?
3. **Extra pages.** Are the proposed routes OK? `/product/mobile-app`, `/product/details`, `/cookies`, `/refunds`.
4. **`/signup`.** Should it redirect to `${NEXT_PUBLIC_APP_URL}` (my suggestion), or not exist, with all sign-up buttons linking straight to the app?
5. **Top-level nav links.** Should Product keep pointing to Channels and Compare to Teams, or should they wait for the index pages?

**Links**

6. **Placeholder links.**
   - Can I point the Home "closer look" and "compare" cards at the matching pages?
   - Should the Analytics card be removed, or given a page?
   - What should the footer "Product overview" link to?
   - Are there App Store and Google Play URLs, or should those buttons be hidden for now?

**Copy**

7. **Flagged terms.** Please give replacements, or an explicit "keep", for each term in 5.3 and the appendix. Note especially the product role "Agent", the plan unit "seats", and the IT Service Providers page, which is built around "tickets" and "service desk".
8. **Metadata.** I need new titles and descriptions for the pages listed in 5.7, and for any routes added later.
9. **FAQ copy for the 13 use case pages**, or permission to skip FAQPage JSON-LD there.
10. **Legal entity name** to replace `[COMPANY NAME]`.
11. **SLA on Starter.** Which is right, Zendesk page or Pricing table?

**Design**

12. **Font.** Choose option (a) three weights (400, 600, 800) or (b) two weights (400, 600). I also need WOFF2 files or an OK to convert the OTFs.
13. **Blur on the secondary buttons and the Home hero pill.** Keep it or drop it?
14. **Accent text on light backgrounds** (link hover, "See pricing", "Guests, free", "GUEST"). Can I switch these to `#0B7A96`?
15. **Screenshots.** Should the app screenshots be regenerated to remove em dashes and flagged terms, or used as they are?
16. **OG images.** Will you supply one per page (1200×630 WebP), or should I generate simple branded ones from the page title at build time?

**Still open from the brief** (not blocking step 2): app URL, Resend sending domain and recipient, and cookie consent for GA in the EU.

---

## Appendix: flagged terms by page

Verbatim excerpts, trimmed. The Compare mega menu line "Helpdesk software, which Kolabr is not" appears on every page and is not repeated below.

**About** (`/about`)

- seat: “Everyone outside the company gets email, or a guest seat somebody has to pay for and therefore rations. We started Kolabr because that gap is where th…”
- seat: “Per-seat pricing punishes the point”
- outsider: “Charge for every outsider and firms ration access to the people they most need in the room. The pricing model quietly decides how the work gets done, …”

**Channels** (`/product/channels`)

- ticket _(alt text)_: “A list of requests with ticket number, title and status columns”

**Compare - Basecamp** (`/compare/basecamp`)

- seats: “Above about twenty staff the flat plan is the lower number, so compare what the number buys. Kolabr includes requests with response targets, a wiki in…”
- helpdesk: “If you currently pay for a helpdesk or a knowledge base alongside your project tool, add those in before you compare.”
- seat: “…a large team it is the lower number. Below roughly twenty people, per-seat pricing applies on both sides and they are closer. The ”

**Compare - ClickUp** (`/compare/clickup`)

- seat: “…e on their side who has ever had a question. Nothing to configure, no seat arithmetic, and by Friday the requests arrive from the people who actually …”
- seat: “…lient needs to comment, approve or change anything, they take a guest seat from an allowance that scales with how many paid users you have, and once t…”
- seat: “Kolabr has one kind of guest and they participate fully. They raise requests, answer questions, read the wiki and join calls, and they are free on eve…”
- seat: “View-only guests are free and unlimited. A guest who can comment or edit takes a guest seat.”
- seat: “As many as the channel seat count allows: 30 on Starter, 100 on Pro, unlimited on Max.”
- seat: “Priced per seat on top of the plan.”
- seat: “…o $10 and $19 paid monthly, with Enterprise quoted and AI charged per seat on top. Kolabr is $9.99, $19.99 o”
- seat, seats: “Per internal seat ClickUp is the lower number. The figure that changes the answer is the client side: a guest who can comment or approve consumes an a…”
- seat: “per user per month on annual billing for the published tiers, with Enterprise quoted and AI per seat. Participating guests draw on an allowance.”
- seat: “… is free and unlimited. A guest who can comment or edit takes a guest seat from an allowance that scales with your paid users, and once that allowance…”
- seat, seats: “… and Business at $12 per user per month are below Kolabr per internal seat. The number that moves is participating guests: if your clients need to com…”
- seat: “Not at all, and it is a reason to keep it for internal delivery. The usual approach is to leave the build where it is and open Kolabr channels for the…”
- seats _(meta description)_: “Kolabr vs ClickUp compared feature by feature: guest seats and view-only limits, requests with owners and SLAs, tasks inside requests, chat, wiki and …”

**Compare - Notion** (`/compare/notion`)

- outsider: “How an outsider joins”
- seat: “Guests do not consume a member seat. The free plan allows ten, and caps on paid plans vary by tier.”
- seats: “The comparison is only fair once you add what sits beside Notion. Most teams running it also pay for a chat tool, and often a tracker on top, because …”
- seat: “per member per month on annual billing, with Enterprise quoted. Guests do not consume a member seat.”

**Compare - Slack** (`/compare/slack`)

- seat: “… channel you put a client in: in Slack that person becomes a billable seat, and in Kolabr they stay free. This page sets the two side by side on”
- seat: “Slack gives you free guests on one condition: one channel each, and no more than five for every paid member. It holds up while a client only ever need…”
- seat: “…with no allowance to track and nothing that converts them into a paid seat later. The practical result is that you stop deciding who is worth ”
- seat: “Becomes a multi-channel guest, charged at the full per-seat rate of your plan.”
- third-party: “Not native to messaging. Slack lists, workflows or a third-party tool, added and maintained separately.”
- third-party: “Reminders and third-party calendar apps, not tied to a request.”
- seats: “The number that decides it is the one outside your company. Take an agency of twelve with forty client contacts who each need more than one channel. I…”
- seat: “…nel they become a multi-channel guest and are billed at your full per-seat rate.”
- seat, seats: “Per internal seat the two are in the same territory once you compare like for like. The difference is everyone who is not staff. If you work with clie…”
- seat _(meta description)_: “In Slack a client in a second channel becomes a billable seat. In Kolabr guests are free wherever you put them.”

**Compare - Teams** (`/compare/teams`)

- outsider: “Teams was built for the people inside your company. Kolabr runs your internal channels too, and every client, contractor, consultant and supplier in t…”
- helpdesk, third-party: “Not in Teams itself. Planner, Lists or a third-party helpdesk, added and maintained separately.”
- service desk: “No native SLA concept. Requires an add-on service desk.”
- helpdesk: “…s answers that by adding something alongside it: Planner, Lists, or a helpdesk product. That me”
- seat: “Both are priced per internal seat. Teams Essentials is $4 per user per month on annual billing, Microsoft 365 Business Basic $7, Business Standard $14…”
- seats: “…, on any plan, however many of them there are. What your plan buys is seats per channel: 30 on Starter, 100 on Pro, unlimited on Max, ”
- seat: “…n how many outside people you work with. Teams is priced per internal seat from $4, Kolabr from $9.99, but Kolabr never charges for a guest and needs …”

**Compare - Zendesk** (`/compare/zendesk`)

- helpdesk: “A helpdesk is built for volume from people you will never meet. Kolabr is built for the forty clients whose names you know, where the request is one m…”
- helpdesk: “…f your customers are strangers and there are thousands of them, buy a helpdesk. If they are named accounts you will still have in five years, the queu…”
- seat: “…othered to log in, and answers coming from colleagues who never had a seat.”
- helpdesk: “Helpdesk software is designed around a stranger with a problem. It is why there is a portal, a form and a set of macros: when the volume is thousands …”
- tickets: “Their tickets, in the help centre.”
- ticket: “Conversation outside a ticket”
- tickets: “Conversation happens inside tickets and side conversations.”
- tickets, agent, seat: “Priced per agent. A person who replies to tickets needs a full seat.”
- agents: “Light agents are free on the plans that include them, and are view or comment only.”
- seat: “One person, one seat, any number of channels.”
- seats: “Customer service and employee service are separate product lines with separate seats.”
- ticket: “Tasks are handled through the ticket itself or a connected tool.”
- agent: “… ticketing only, Suite Team at $55 and Suite Professional at $115 per agent per month on annual billing, with Enterprise quoted.”
- agent, agents: “Copilot and other bundles are charged per agent, and AI agents are billed per automated resolution.”
- agent: “Per-agent pricing decides who is allowed to help”
- seat: “When every person who can reply costs a full seat, the engineer who actually knows the answer gets left out and the request is relayed to them instead…”
- agent: “No agent maths.”
- agent, seat: “No per-agent add-ons stacked on the seat price.”
- tickets: “Thousands of tickets a month”
- agent, agents: “Zendesk is priced per agent on annual terms: Support Team at $19 for ticketing only, Suite Team at $55 and Suite Professional at $115, with Enterprise…”
- agent, seats: “…y occasionally answers a client pays for ten people in Kolabr. On per-agent pricing the same firm either buys ten se”
- seat: “Also worth checking: whether somebody who answers both customer and internal requests needs a seat on two separate products.”
- agent: “per agent per month on annual billing for the published tiers, with Enterprise quoted, per-agent add-ons and per-resolution AI charges.”
- helpdesk: “Is Kolabr a helpdesk?”
- tickets, helpdesk: “No, and it is the comparison we are most careful about. A helpdesk is built for volume from people you will never meet: a portal, a queue, macros, def…”
- agent: “Do we pay per agent?”
- agent, seat: “…nswer a request. Nobody has to decide whether a colleague is worth an agent seat before letting them help, and the client ”
- helpdesk: “Yes, and some do. A helpdesk handles high-volume inbound from the general public while Kolabr runs the named accounts, where the relationship matters …”
- helpdesk: “What does Kolabr include that a helpdesk plan charges for?”
- agent: “Response-time targets on every plan rather than a higher tier, a wiki in every channel instead of a help centre you build and publish, full chat with …”
- agent _(meta description)_: “Kolabr vs Zendesk compared feature by feature: per-agent pricing, portals versus channels, SLAs on every plan, wiki, tasks inside requests and cost.”
- helpdesk _(meta description)_: “A helpdesk is built for strangers. Kolabr is built for the clients whose names you know, with the same owners, categories and clocks.”

**Cookies** (`/cookies`)

- third parties: “3. Third parties”
- third-party: “…ll amount of privacy-respecting analytics. No advertising cookies, no third-party trackers, and nothing that follows you around other website”
- third parties: “Third parties”
- third-party: “Chrome: Settings, then Privacy and security, then Third-party cookies.”

**Pricing** (`/pricing`)

- seats: “…ery option included, no card needed. Each channel has a set number of seats on your plan, and your own team and your guests share them: 30 seats on St…”
- seats: “Seats per channel (team + guests)”
- seat, seats: “…e a channel, though, team members and guests draw on the same pool of seats: a Starter channel with 29 of your own people has one”

**Product - Administration** (`/product/administration`)

- agent: “Admin, agent or participant: set per person, applied per channel. Changing someone’s role takes effect everywhere they are a member.”
- agent: “Agent”
- seats: “Seats you can see”
- seats: “Usage sits in the sidebar: staff seats and channels against your plan, so a limit never arrives as a surprise mid-week.”
- seats: “Staff seats”

**Product - Channel Chat** (`/product/chat`)

- ticket _(alt text)_: “A list of requests with ticket number, title and status columns”

**Product - Details** (`/product/details`)

- seat: “Most people end up with more than one Kolabr identity: the seat their employer pays for, and the guest account a supplier invited them into. Add them …”
- seat: “Not just two. A staff seat, a guest account at one client, another at a supplier, each with its own channels and notifications.”

**Product - Meetings** (`/product/meetings`)

- seats: “Calls and the channel calendar come with your team’s seats. No separate video bill, and no per-guest charge.”

**Product - Mobile App** (`/product/mobile-app`)

- seat: “A free companion app for iOS and Android, included with every seat. The same channels, requests, chats, events and wiki: built for the times you are n…”
- seat: “See what a seat costs”
- seat: “The app is included with every Kolabr seat: nothing to buy, nothing to add on. Sign in with the account you already have and your channels are there.”
- seat: “with every seat”
- seat: “Free with every seat, on iOS and Android.”
- seat _(meta description)_: “The free Kolabr companion app for iOS and Android: your channels, requests, chats, events and wiki on the phone, included with every seat.”
- seat _(meta description)_: “A free companion app for iOS and Android, included with every Kolabr seat.”

**Product - Requests** (`/product/requests`)

- helpdesk: “Is this a helpdesk, or a task manager?”
- ticket, agent: “Neither. There is no ticket portal and no separate agent tool: requests sit in the channel next to the chat, the meetings and the wiki they belong to.…”
- agent: “One price, not a per-agent bill”
- ticket _(alt text)_: “The Requests list: ticket number, title, status, priority, owner, assigned team, channel, category, SLA state and created date for ten requests”

**Product - Wiki** (`/product/wiki`)

- agent: “The third time a request repeats, write the article. Link it from the request, and the next agent stops asking the same question in the channel.”

**Refunds** (`/refunds`)

- seat: “5. Downgrades and seat changes”
- seat: “Downgrades and seat changes”
- seats: “…e difference for the current period. You keep the higher plan and the seats un”

**Terms** (`/terms`)

- seats: “3. Accounts, seats and guests”
- seats: “Accounts, seats and guests”
- seat: “Each channel has a seat limit set by your plan: thirty on Starter, one hundred on Pro, and unlimited on Max. That limit counts everyone in the channel…”
- seats _(meta description)_: “The terms governing use of Kolabr: plans and seats, payment, acceptable use, your content, availability, liability and termination.”

**Use Case - Accounting Firms** (`/use-cases/accounting-firms`)

- seat: “Each channel has a seat count on your plan: 30 on Starter, 100 on Pro, unlimited on Max, shared between your staff and your client’s. A client with th…”

**Use Case - Architecture Firms** (`/use-cases/architecture-firms`)

- seat: “The project channel. Client, contractor, engineer, QS and landscape architect in one place, each of them a guest, none of them paying for a seat.”
- agent: “The site agent photographs the clash at 07:10, and the answer lands before the trade moves on. No “I sent it to someone at your office”.”
- seat: “Each channel has a seat count on your plan: 30 on Starter, 100 on Pro, unlimited on Max, shared between your studio and your guests. A project with a …”
- agent: “The site agent writes it as a message; anyone in the studio turns that message into a numbered RFI in one step, photographs attached.”
- agent: “Your technologist is at a desk with the model open. The site agent is standing in front of the clash with a phone. Same channel, same RFI number, same…”

**Use Case - Clinics** (`/use-cases/clinics`)

- seat: “Each channel has a seat count on your plan: 30 on Starter, 100 on Pro, unlimited on Max, shared between your staff and your guests. A single-site prac…”

**Use Case - Construction** (`/use-cases/construction`)

- seat: “Each channel has a seat count on your plan: 30 on Starter, 100 on Pro, unlimited on Max, shared between your own staff and your guests. A site with a …”
- agent: “The site, not the site agent”
- agent: “When an agent moves to the next job, the claim history stays with the project instead of leaving in a mailbox.”

**Use Case - Engineering Firms** (`/use-cases/engineering-firms`)

- agent: “The site agent’s direct line to the engineer. Photographs at 06:40, a decision before the concrete arrives.”
- seat: “Each channel has a seat count on your plan: 30 on Starter, 100 on Pro, unlimited on Max, shared between your engineers and your guests. A project with…”
- agent: “The site agent photographs the bar spacing; one step turns it into a numbered query with the image attached and a name against the answer.”
- agent: “Your engineer is at a desk with the bending schedule open. The site agent is standing over the rebar at twenty to seven with a phone. Same channel, sa…”

**Use Case - IT Service Providers** (`/use-cases/it-service-providers`)

- ticket: “A ticket portal nobody logs into, an inbox that swallows requests, and a client who only hears from you when something breaks. One channel per client …”
- tickets: “… is a group of people plus the work they share: the conversation, the tickets, the calendar and the runbooks. Most providers run one per client, split…”
- service desk: “Service desk”
- tickets: “The migration, the rollout, the refresh. Separate from the desk so project work is not eaten by tickets.”
- seat: “Each channel has a seat count on your plan: 30 on Starter, 100 on Pro, unlimited on Max, shared between your engineers and your client’s staff. A fort…”
- service desk: “A service desk your clients will actually use”
- tickets: “Tickets from conversation”
- ticket: “The user describes the problem in the channel; one step makes it a ticket with the whole thread attached. Nobody retypes anything.”
- ticket, tickets: “Ticket volume per client, what is about to breach, and the estate generating three times the tickets it is priced for.”
- tickets: “Pick the account where tickets arrive by phone, email and corridor. One channel, their staff invited, two weeks. Your first-line will tell you by Frid…”
- tickets: “Client staff are guests and are never billed, however many of them raise tickets. The plan covers your own people.”
- tickets: “Fourteen days free on Max, every option included, no card. Invite one client’s staff and watch where the tickets come from.”
- service desk _(alt text)_: “The Service desk channel for Rossgrove Legal: a pinned P1 notice promising updates every thirty minutes, the practice manager asking how bad the mail …”
- service desk _(alt text)_: “The provider calendar: service desk stand-ups, a P1 incident bridge, the monthly service review, the firewall change window, the M365 pilot cutover an…”
- ticket, tickets _(alt text)_: “The provider dashboard: tickets this month across client channels, open tickets, unassigned, SLA at risk with the next breach time, ticket volume for …”
- tickets _(meta description)_: “A channel per client. Tickets, incidents, change control and runbooks in one place, with the client in the room as a free guest and the SLA clock visi…”
- service desk _(meta description)_: “A service desk clients actually use, incidents run the same way every time, and evidence ready for the quarterly review.”

**Use Case - Law Firms** (`/use-cases/law-firms`)

- seat: “Each channel has a seat count on your plan: 30 on Starter, 100 on Pro, unlimited on Max, shared between your fee earners and your guests. A matter wit…”

**Use Case - Logistics** (`/use-cases/logistics`)

- seat: “Each channel has a seat count on your plan: 30 on Starter, 100 on Pro, unlimited on Max, shared between your controllers and the client’s depots. A na…”

**Use Case - Manufacturing** (`/use-cases/manufacturing`)

- seat: “Each channel has a seat count on your plan: 30 on Starter, 100 on Pro, unlimited on Max, shared between your plant and your guests. A production chann…”

**Use Case - Marketing Agencies** (`/use-cases/marketing-agencies`)

- seat: “Each channel has a seat count on your plan: 30 on Starter, 100 on Pro, unlimited on Max, shared between your team and your guests. A client with four …”

**Use Case - Nonprofits** (`/use-cases/nonprofits`)

- seat: “Each channel has a seat count on your plan: 30 on Starter, 100 on Pro, unlimited on Max, shared between your staff and your guests. Volunteers and fun…”
- seat _(meta description)_: “Funder reporting assembled from work already recorded, safeguarding with one clear path, and volunteers who never cost you a seat.”

**Use Case - Property Management** (`/use-cases/property-management`)

- agent: “Where a managing agent puts its channels”
- agents: “…ey share: the conversation, the jobs, the calendar and the wiki. Most agents run one per building, split by who is allowed to see what.”
- seat: “Each channel has a seat count on your plan: 30 on Starter, 100 on Pro, unlimited on Max, shared between your staff and your guests. A residents channe…”

**Use Case - Schools** (`/use-cases/schools`)

- seat, seats: “Each channel has a seat count on your plan: 30 on Starter, 100 on Pro, unlimited on Max, and your staff and your guests share those seats. A class of …”
