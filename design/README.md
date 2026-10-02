# What these files are

**The design as originally delivered. Not the live site.**

These HTML files are the source the site was built from. They have not been kept in step with it,
and they are not shipped: nothing in this folder is served to anybody. Reading one and expecting
the current site will mislead you.

## Where the live copy lives

| Looking for | Read |
|---|---|
| Any page's words | `content/pages/*.json` |
| Page titles and meta descriptions | `content/pages/page-meta.json` |
| Use case FAQs | `content/pages/use-case-faqs.json` |
| Blog posts | `content/blog/*.md` |
| Layout, order, components | `app/` and `components/` |

To see what a page really says, run `npm run dev`. To search it, `grep` the JSON above, or the
built HTML under `.next/server/app/` after a build.

## Known differences, as of 2 October 2026

The site has moved on from these files in ways you will notice:

- **Locale.** The design was written for South Africa. The site is written for the United States.
  `Use Case - Accounting Firms.dc.html` still says SARS, VAT201 and EMP501 where the site says the
  IRS and Form 941; `Terms.dc.html` still bills in South African rand. The site does neither.
- **People.** Every name in the mockups is American now. These files predate that.
- **Microsoft Teams** is gone from the site. Its page and its nav links were removed here too, but
  nothing else was revisited.
- **Compare pages** were substantially rewritten: a different argument, a "what changes in the
  first month" band, no concession block, a proof band.
- **Channel language.** The site no longer says "one channel per client", and no view spans a
  channel.

## The one exception

`design/screens/*.dc.html` and `design/Screen - *.dc.html` **are** live. They are the sources for
the product mockups, captured by `npm run shots` into `design/assets/screens/` and converted into
`assets/images/screens/` by `npm run assets`. Edit those when a mockup is wrong, then recapture.

Everything else in this folder is a historical record.
