# SEO: what the site does, and what you need to do

Last updated 23 September 2026. Decisions taken with Dom: global English (no regional
targeting), a blog built from Markdown files in the repository, Google Analytics behind a
consent banner, and metadata rewritten for search intent.

## The strategy in one paragraph

Nobody searches for "Kolabr". Every page therefore targets the words a buyer already uses:
their industry ("client collaboration software for law firms"), the tool they are trying to
replace ("slack alternative for client work"), or the job they are trying to do ("how to track
client requests"). The product pages carry the feature language, the use case pages carry the
industry language, the compare pages carry the switching language, and the blog carries the
question language. Everything links back to the pages that convert.

## What is built

**Metadata.** Every page has a unique title (50 to 60 characters) and description (140 to 155),
written for search intent. The searched phrase leads and the brand comes last. Before and after
in `docs/metadata-review.md`.

**Canonicals.** Absolute, with a trailing slash, on `https://kolabr.com`. One address per page.

**Sitemap** at `/sitemap.xml`, generated at build from the same map the pages use, so a new page
cannot be forgotten. The four legal pages are noindex and deliberately excluded.

**robots.txt** allows everything except `/api/`, and names the sitemap.

**Social images.** One per page, drawn at build time by `lib/og.tsx` from that page's own title,
in the brand colours and typeface. Open Graph and Twitter tags on every page.

**Structured data** (JSON-LD, one `@graph` per page):

| Page | Schema |
| --- | --- |
| Home | Organization, WebSite, BreadcrumbList |
| Pricing, Channels | SoftwareApplication with the three plans as Offers, BreadcrumbList |
| Use cases (13) | FAQPage from the questions shown on the page, BreadcrumbList |
| Compare (6) | FAQPage, BreadcrumbList |
| Blog listing | Organization, Blog, BreadcrumbList |
| Blog posts | Organization, BlogPosting, BreadcrumbList |
| Everything else | BreadcrumbList |

The FAQ schema is generated from the questions that are visible on the page, which is what
Google requires. Prices come from `lib/pricing.ts`, so the schema cannot drift from the page.

**The blog.** Posts are Markdown files in `content/blog/`. A file becomes a page, a sitemap
entry, a feed item and a social image automatically. There is an RSS feed at `/blog/rss.xml`,
heading anchors, reading times, related posts, and `draft: true` in the frontmatter keeps a post
noindex until you remove it. Four posts are written and awaiting your approval.

**Analytics** loads through one module (`components/analytics/Analytics.tsx`) and only after a
visitor accepts the banner. No script, no cookie and no request to Google before that. Declining
is remembered, the choice can be changed from "Cookie settings" in the footer, and a browser
sending a Global Privacy Control signal is treated as a decline. Withdrawing after accepting
clears Google's cookies and reloads, so it is as effective as never having accepted.

**Google Tag Manager**, container `GTM-M37PVG29`, is the way tags are loaded. Three differences
from the snippet Google gives you, all deliberate:

1. **It loads on consent, not on page load.** Google's snippet goes in `<head>` and runs for
   everybody. Ours runs when the visitor accepts, which is what the banner promises them.
2. **The `<noscript>` iframe is left out.** It exists for visitors without JavaScript, who can
   never have accepted the banner, so including it would load the container without consent.
3. **Consent Mode v2 is set before the container**: `analytics_storage` granted, all advertising
   signals denied, because the banner does not ask about advertising.

Two things to know when configuring the container:

- **Page views on navigation.** Moving between pages on this site does not load a new document,
  so the container only sees the first page. Every navigation after that pushes
  `{ event: "page_view", page_path, page_title }` to the dataLayer. In GTM, make a **Custom Event**
  trigger on `page_view` and fire your GA4 event tag on it, alongside the All Pages trigger for
  the first load. Without that, GA4 records one page view per visit.
- **Add GA4 inside the container**, not through `NEXT_PUBLIC_GA_ID`. If both are set the container
  wins, so GA4 cannot be counted twice, but the tidy setup is container only.

**Performance** (Lighthouse, mobile, on the production build):

| Page | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Home | 96 | 100 | 100 | 100 |
| Pricing | 97 | 100 | 100 | 100 |
| Use case | 97 | 100 | 100 | 100 |
| Compare | 97 | 100 | 100 | 100 |
| Blog post | 97 | 100 | 100 | 100 |

## What you need to do

1. **Google Search Console.** Create a property for `kolabr.com`. Verify by DNS TXT record
   (easiest for a domain you own) or ask me to add a verification file. Then submit
   `https://kolabr.com/sitemap.xml`, and check the Coverage and Core Web Vitals reports monthly.
2. **Bing Webmaster Tools.** Same thing, five minutes, and it feeds several other engines and
   some AI answers. You can import the Search Console property directly.
3. **Google Analytics, inside GTM.** Create a GA4 property, then in container `GTM-M37PVG29` add
   a Google Tag with the measurement ID on the All Pages trigger, plus a GA4 event tag on the
   `page_view` Custom Event trigger described above. Nothing needs redeploying: the container is
   already installed and publishing in GTM is enough.
4. **Approve the blog posts** in `content/blog/`, or tell me what to change.
5. **Give me the app URL.** Without `NEXT_PUBLIC_APP_URL`, `/signup/` is a 404 and every trial
   button on the site leads nowhere.
6. **Give me the legal entity**, so the legal pages can drop `[COMPANY NAME]` and come out of
   noindex.
7. **Create the brand profiles** you want associated with Kolabr (LinkedIn at least). Send me the
   URLs and I will add them to the Organization schema, which is how Google connects a name to an
   entity. I have left them out rather than invent them.

## Worth doing next, in order of value

1. **Write more posts.** Four is a start, not a blog. The pages that earn links are the ones that
   answer a question nobody else answers properly. Two a month beats ten in one week.
2. **Get the first links.** A new domain ranks for almost nothing until other sites point at it.
   Realistic sources: the software directories (G2, Capterra, Product Hunt, AlternativeTo), your
   customers' supplier pages, and any industry body your first customers belong to.
3. **Add customer proof.** Nothing here claims a customer, a rating or a review, because none of
   it would be true yet. When it is, review schema and named case studies are the strongest
   single addition to both ranking and conversion.
4. **Watch what people actually search.** After a month in Search Console you will have real
   queries. Rewrite the weakest three titles against them; that beats any amount of guessing now.
5. **Consider a second compare set.** "Kolabr vs Monday", "vs Asana", "vs Trello" if the demand
   shows up in Search Console. The template already exists.
6. **Keep the blog fed.** It is linked from the top navigation, the phone menu and the footer, so
   every new post is one click from every page and gets crawled quickly. That only pays off if
   posts keep arriving.

## Things deliberately not done

- **No keyword stuffing of the copy.** The page copy is yours and final; only titles,
  descriptions and the new FAQ and blog content were written for search.
- **No FAQ schema on pages without visible questions.** Google requires the words on the page.
- **No invented ratings, review counts or customer names** in structured data. That risks a
  manual penalty and is not true.
- **No hreflang or regional targeting.** You chose global English. If you later target a region,
  this is where it would be added.
- **No AI crawler blocks.** `robots.txt` allows GPTBot and similar. Being quoted in AI answers is
  currently worth more to an unknown brand than the content is worth protecting. Say the word and
  I will block them.
