# Feature gaps against the competitors we compare ourselves to

Written 1 October 2026, prompted by the concession block on the compare pages.

**How this was built.** Three sources: what `lib/plan-features.ts` says we ship (43 rows, agreed
30 September), what the compare tables already concede, and long-standing capabilities of Slack,
Basecamp, Notion, ClickUp and Zendesk. The competitor column is deliberately vague about plan
names and prices, because those move; every line needs checking against the vendor's own page
before it goes anywhere near the site or a sales conversation.

**What this is not.** It is not a roadmap and it does not price anything. It is the list of things
a buyer coming from one of those five products will expect to find and will not.

---

## Part 1: the concession block (removed, commit 6d0ab8d)

Four problems with it, in order of how much they matter.

**It contradicts our own pricing page.** The Slack card says "there is no directory of integrations
to browse". `/pricing` sells a public API, inbound and outbound webhooks, and "custom integrations
and private connectors" on Business. The ClickUp card says Kolabr "is not a builder for arbitrary
workflows" while `/pricing` sells automation rules (30 active on Pro, unlimited on Business),
routing rules and playbooks. Both can be literally true at once, and both still read as us talking
ourselves down in front of a reader who can open the other tab.

**Most of the cards are roadmap, not principle.** An app marketplace, a developer platform, an
automation builder, time tracking, publishing, a public help centre: all of these are buildable,
and several are on this list below. Printing them as "where Kolabr stops" is a public commitment
against our own roadmap, bought for nothing.

**It is redundant.** Every point is already made positively somewhere earlier on the same page:

| Concession | The positive version, already on the page |
|---|---|
| An app marketplace | "One subscription, not three. Nothing to integrate, nothing else to renew in March." |
| Nothing to build / configure | Notion and ClickUp both have a whole "nothing to build before you can use it" band |
| A standalone task manager | Basecamp and ClickUp both have a full section on tasks living inside a request |
| A one-day migration | The proof band, on all five pages: Monday, one channel, nothing exported |

**It is the largest block of negative copy on the site.** Four cards times five pages is twenty.

### The two things in it that do earn their place

Not features, which is the point.

1. **The Zendesk fit statement.** "If you run phone support at scale, or thousands of requests a
   month from strangers, buy a helpdesk." That is not a gap, it is a definition of who the product
   is for, and it turns away a customer who would churn in month four. It is the most valuable
   sentence on that page. It already exists in the Zendesk FAQ, so the block is not what carries it.

2. **Sealed channels.** Slack's "a place for everything at once" and Notion's "a company
   encyclopaedia" both describe the central design decision of the product: a channel has a subject
   and a membership, so a client sees one channel and nothing else of your business. Written as a
   concession, the idea reads as a shortfall. It belongs in "what only Kolabr does".

---

## Part 2: what the competitors have that we do not

Tier 1 is "a buyer asks in the first conversation". Tier 3 is "nice, and nobody has walked over it".
The original Tier 1 was reviewed by Dom on 1 October 2026 and is resolved just below.

### Resolved, 1 October 2026

Dom went through the original Tier 1 and three of the four come off the list. What is left of them
is a marketing problem, not a product one.

| Was | Dom's answer | What that leaves |
|---|---|---|
| Email in and out of a request | **We already have it.** | Not a gap. It is a **selling point nobody can find**: it appears nowhere on the site and has no row in `lib/plan-features.ts`. See below. |
| Intake forms | **We do not want them.** | A deliberate absence. A form into a queue is the portal we spend the Zendesk page arguing against, so it belongs with the other design decisions, not on a gap list. |
| Two-way calendar sync | **We will have it.** | Planned. Nothing on the site should promise it until it ships. |
| A Zapier or Make connector | **No. The API is the answer, plus hands-on help to integrate, on Business.** | Not a gap. `/pricing` already sells the public API, inbound and outbound webhooks, and custom integrations and private connectors on Business. The integration answer is a service, not a directory. |

**The one to act on: email in and out is invisible.** It is arguably the strongest thing on this
list, it is the direct answer to "my client will never log into another tool", and the site does
not mention it once. Worse, the Requests page CTA says "take the requests that arrive by email
today" without saying we can. It needs a feature row on `/pricing`, a mention on
`/product/requests`, and a line in the Zendesk and Slack comparisons, where "no portal" currently
rests on the channel alone and could rest on email as well.

**And the integration answer needs stating.** "We have an API and we will help you connect it, on
Business" is a good answer to "do you integrate with our CRM", better than a directory of
half-maintained connectors. It is currently only visible as three rows deep in the pricing table.
It should be a sentence somebody can read.

### Tier 1: asked for on day one

What is left at the top, renumbered.

| # | Gap | Who has it | Why it matters here |
|---|---|---|---|
| 1 | **Saved replies / canned responses.** | Zendesk (macros), ClickUp | The chat-side twin of the wiki. The wiki stops the client asking twice; a saved reply stops your team typing it twice. We argue the first half and ignore the second. |
| 2 | **Business hours and holiday calendars on the SLA clock.** | Zendesk | We show the clock to the client. A clock that runs through Saturday is visibly wrong, and it is wrong in front of the customer, which is worse. |
| 3 | **Time on a request.** Even a duration field and an export, not a timesheet product. | ClickUp native, Basecamp and Zendesk via apps | Agencies, law firms and accounting firms are three of our named use cases and all three bill by time. |

### Tier 2: expected, and quietly lost deals

| # | Gap | Who has it | Why it matters here |
|---|---|---|---|
| 4 | **Board and calendar views of a channel's requests.** | ClickUp, Basecamp, Notion | Within one channel this does not touch the channel boundary. It is table stakes, and the absence makes us look older than we are. |
| 5 | **Google Drive, OneDrive and Dropbox file pickers.** | All five | Clients keep files there. Re-uploading is where "one place for everything" starts to feel like a lie. |
| 6 | **Two-way calendar sync, Google and Microsoft.** *(planned)* | All five, in some form | Listed for completeness because it is not shipped yet. An event that does not appear in the client's Outlook did not happen. |

### Tier 3: worth having, nobody has walked over it

| # | Gap | Who has it |
|---|---|---|
| 7 | Real-time co-editing on wiki pages | Notion, ClickUp, Basecamp |
| 8 | A published, public help centre | Zendesk |
| 9 | Message scheduling and reminders | Slack |
| 10 | Drop-in audio rooms (huddles) | Slack |
| 11 | Organisation-to-organisation federation, the Slack Connect equivalent | Slack | 
| 12 | Recurring requests (playbooks may already cover part of this) | ClickUp |
| 13 | Request templates the guest sees when raising one | Zendesk, ClickUp |

### Not features, but they block deals

| # | Gap | Note |
|---|---|---|
| 14 | **SOC 2 Type II or ISO 27001** | All five have one or both. Any client with a procurement process asks. `/security` currently says nothing about either, which is worse than saying "in progress". |
| 15 | **Choice of data region** | Ties into the EU question already open on the cookie banner. |
| 16 | **A public status page** | Cheap, and the first thing a technical buyer looks for. |

---

## Part 3: deliberate absences, not gaps

These follow from the sealed-channel model and should never appear on a gap list:

- Search across every channel you belong to
- A personal "my work" queue spanning channels
- Roll-up reporting across clients
- **Intake forms** (decided 1 October 2026). A form filing into a queue is the portal the Zendesk
  page argues against. A client gets in by being invited, which costs nothing.
- **A connector directory.** The integration answer is the public API, webhooks, and help building
  the connection, on Business. A service rather than a catalogue.

**Decided, 1 October 2026.** A channel shows that channel, and nothing on the site may suggest
otherwise. Settings already sit outside the channel system: they define things once and those
definitions apply inside channels. Analytics will be a third area of that same kind, outside the
channel system, owner-side only and never reachable by a guest, and that is where cross-channel
numbers live. So the roll-up does exist as a product, it is simply not a channel view and must
never be drawn as one.

Applied in commit `bdc5110`: the twelve industry dashboards and the schools dashboard are now
channel-scoped, and the copy around them with it. Nothing on the site markets Analytics yet,
because it is not built and is not on `/pricing`. When it ships it needs its own page and its own
feature row, drawn with its own chrome so a reader never mistakes it for something inside a channel.

## What to verify before using any of this

- Every competitor capability above, against the vendor's own current documentation. This was
  written from knowledge of these products, not from a fresh crawl of their docs.
- Whether anything in Tier 1 or 2 is already built and simply missing from `lib/plan-features.ts`.
  The list there is what we publish, not necessarily what exists. Email in and out of a request
  was exactly this: shipped, and absent from both the table and the site.
