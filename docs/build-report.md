# Build report

Step 6 of the work order. Written 23 September 2026, covering the whole build: what was changed
from `design/`, what was flagged rather than changed, and what is still open.

Companion documents: [`route-map.md`](route-map.md) (the original inventory),
[`metadata-review.md`](metadata-review.md) (every title and description, before and after),
[`faq-review.md`](faq-review.md) (the 65 use case FAQs), [`seo.md`](seo.md) (search setup and
your to-do list), [`screenshot-regeneration.md`](screenshot-regeneration.md) (the em dash pass
over the app mockups), and [`../DEPLOY.md`](../DEPLOY.md).

## 1. What was built

40 pages, all statically generated: home, pricing, 8 product pages, 13 use case pages, 6 compare
pages, about, contact, 4 legal pages, the blog listing and 4 posts. The only server code is the
contact form backend at `app/api/contact/route.ts`.

Verified on the production build: every content page is reported static, all 40 indexable pages
pass a crawl of titles, descriptions, canonicals, heading order, image alt text, JSON-LD and
internal links, and Lighthouse scores 96 to 99 for performance and 100 for accessibility, best
practices and SEO on every page type.

## 2. Em dashes

The rule was no em dashes anywhere, with every change listed.

**Page copy: none to fix.** All 35 design page files were checked end to end and contain no em
dashes. Nothing in the visible copy of the site needed changing, and there are none in the
shipped source today (`app/`, `components/`, `lib/`, `content/`).

**App mockups: 832 edits across 85 files** in the first pass, then a second pass on 23 September
that cleared what was left. Both are listed in
[`screenshot-regeneration.md`](screenshot-regeneration.md):

1. **The 126 placeholder dashes are now hyphens.** The mockups used an em dash as the "no value"
   marker and compared against it in code, so both changed together and the 13 Requests
   screenshots were recaptured.
2. **The 28 dashes in the hand-taken screenshots were retouched.** These have no source to
   re-render, so each dash was repainted as a hyphen of the same colour and thickness, and every
   edit was reviewed as a before and after crop.
3. **`c2-chat.png` is no longer used**: the Construction page it appeared on now has its own
   screenshots (see section 6).

No screenshot on the site contains an em dash.

**New copy written during the build** (the 65 FAQs, 4 blog posts, contact form states) contains
no em dashes.

## 3. Flagged terms

Your rulings, applied throughout: "helpdesk" is allowed when describing a competitor and never
for Kolabr; "seats" stays; "ticket" and "service desk" are allowed for the reader's current tools
or industry, and Kolabr's own items are always "requests"; "agent" is allowed as a job title
(site agent, managing agent) with the product role held for your decision.

Counts in the shipped content:

| Term | Uses | Where they are |
| --- | --- | --- |
| seat / seats | 98 | Plans, the comparison tables and the legal pages. Allowed by your ruling |
| agent | 39 | 17 competitor pricing (Zendesk), 16 job titles (site agent, managing agent), 3 Kolabr's own (below), 3 contrasting Kolabr with per-agent tools |
| ticket | 14 | 7 competitor, 3 the reader's current tools on the IT page, 1 contrast ("no ticket portal"), 3 source comments only |
| helpdesk | 14 | Competitor descriptions, the Zendesk page, and the question "Is this a helpdesk?", answered no |
| service desk | 5 | 1 competitor (Teams), 4 on the IT providers page describing Kolabr (below) |
| outsider | 3 | 1 About, 2 compare pages (below) |
| third party | 7 | 3 competitor descriptions, 4 in the privacy and cookie policies |

**Still needing your decision:**

1. **The product role called "Agent"** (`/product/administration`): the roles list reads "Admin,
   agent or participant", and the role card is titled "Agent". This is Kolabr's own vocabulary,
   which is the case you held. The Wiki page also says "the next agent stops asking the same
   question", which reads as a colleague rather than a job title. If you want it renamed, the
   natural alternatives are "Member" or "Responder": a one-word change in three places.
2. **The IT service providers page** describes Kolabr itself as a service desk: the heading "A
   service desk your clients will actually use", a channel named "Service desk" in the
   screenshots and their alt text, and "project work is not eaten by tickets". The page's other
   references to tickets are about the reader's current tools, which your ruling allows.
3. **"Outsider"** appears once on About ("Charge for every outsider and firms ration access") and
   twice on the compare pages ("How an outsider joins" on Notion, one line on Teams).

The Construction page's "When an agent moves to the next job" means the site agent, so it falls
under the job title ruling and was left alone. Three screenshot alt texts said "ticket number"
in the design and were changed to "request number", since they describe Kolabr's own screens.

## 4. Metadata

No page is missing metadata. Every design page carried a title and description; both were
adjusted to the length rules during the build, then rewritten for search intent in step 5 with
the before and after in [`metadata-review.md`](metadata-review.md).

The blog listing and the four posts had no design source, so their titles and descriptions are
new, written to the same rules (50 to 60 characters, 140 to 155).

## 5. Departures from the design

Everything below is deliberate. Everything not listed matches the design, verified by pixel
comparison at 1440, 900 and 390.

**You asked for these:**

- Mobile navigation: a burger icon instead of the word "Menu", the trial button moved out of the
  phone bar into the menu sheet, Home moved out of the Product group, the long groups made
  expandable, and the sheet redesigned as one uniform list.
- Card grids on phones (step cards, "Take a closer look", the compare tiles) stack one per row
  instead of two up. The compare tiles had a real bug at two up: the competitor logo was pushed
  out of the card.
- Glass on the Pro pricing card; the Analytics card removed; the footer trial link pointed at
  `/signup/`; every `#` placeholder wired to its real page.
- A Blog link in the top navigation, which also required the nav labels to stop wrapping at
  1081px.

**Accessibility, where the design's colours fail contrast:**

- Small accent text on white uses `accent-ink` (#0B7A96) rather than `accent` (#15C0E8), which is
  1.8:1 on white.
- Small bold text on an accent-wash chip uses a darker shade again (4.03:1 before, 5.4:1 now).
- Small accent text on the deep panel uses a lighter shade (4.03:1 before, 5.5:1 now). This also
  applies to the trial card in the product menu.

**Behaviour the design could not demonstrate:**

- Sticky elements actually stick (the pricing table header, the contact aside, the legal page
  navigation). In the design a wrapper with `overflow-x: hidden` disabled them.
- On phones, the legal pages ignore the design's global section padding, which was also being
  applied to each numbered clause: it left roughly 170px of empty space between clauses and
  pushed the tables off the side of the screen.
- The Pricing link in the navigation goes to the top of the page rather than scrolling down it.

**New, because the design had no source:**

- The blog: listing, post template, RSS feed, four posts.
- A "Frequently asked questions" section on each use case page. FAQ schema is only legitimate
  when the questions are visible on the page.
- The cookie consent banner and the "Cookie settings" link in the footer.
- The favicon, drawn from the logo's own "k" and accent dot. Replace it if you have something
  better.
- Contact form states: "Sending", "Please add your name and a work email we can reply to.",
  "Your message did not send. Please try again in a moment.", "This request was not accepted.",
  "Too many messages from this address. Please try again in a few minutes." The success text is
  the design's own.

## 6. Unclear or broken in the design

- **Links with no destination.** Several `#` links, plus "Product overview" in the footer, which
  has no page: it points at `/product/channels`, which the design's own navigation treats as the
  product entry point.
- **Routes in `CLAUDE.md` with no design file**: `/security` and a `/product` overview. Neither
  is built, because the content would have to be invented. `/blog` was reserved in the brief and
  built later at your request.
- **The Construction use case reused the clinic screenshots.** Fixed on 23 September: its own
  mockups existed but had never been captured, so they were captured and the page now points at
  them. The alt text already described construction content and now matches the images.
- **Competitor prices** on the compare pages are the design's and date quickly. Each page carries
  a trademark and accuracy disclaimer; re-check the numbers before launch.
- **Fonts.** The design loaded Switzer from a CDN and shipped OTFs. You supplied the official
  WOFF2 files, which are what the site uses. Two weights are also decompressed to OTF at build,
  because the social image generator cannot read WOFF2.
- **The phone navigation** in the design overflowed at 390px with the trial button in the bar.
  That is resolved by the mobile changes above.

## 7. Open items

**Blocking launch:**

1. **`NEXT_PUBLIC_APP_URL`.** Without it `/signup/` returns 404 and every trial button on the
   site leads nowhere.
2. **The legal entity.** The four legal pages show `[COMPANY NAME]` and are noindex until it is
   supplied.
3. **Resend**: API key, a verified sending domain and the recipient address. The contact form is
   built and tested apart from a real send.

**Waiting on you, not blocking:**

4. Approve the four blog posts in `content/blog/`.
5. Add GA4 (or other tags) inside GTM container `GTM-M37PVG29`. The container is installed and
   loads after consent.
6. The three flagged-term decisions in section 3.
7. Nothing outstanding: the screenshots were fixed on 23 September (see section 2).
8. App Store and Play Store URLs. Until they exist, the Mobile app page renders the store badges
   as plain text with a "Coming soon to the App Store and Google Play" note underneath.
9. Brand profiles (LinkedIn and so on) for the Organization schema. Left out rather than invented.
10. The cookie policy's table should name the actual cookies once GA4 is live in GTM.
