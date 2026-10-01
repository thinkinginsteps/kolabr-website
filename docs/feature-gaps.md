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

## Part 1: the concession block itself

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

### Tier 1: asked for on day one

| # | Gap | Who has it | Why it matters here |
|---|---|---|---|
| 1 | **Email in and out of a request.** Reply to a notification by email and it lands in the thread; forward a client's email in and it becomes a request. | Zendesk, Basecamp, ClickUp, Slack (via its email app) | The single biggest one. Our whole pitch is that the client does not have to adopt anything, and then we require them to open the app. Their finance person will not. Our own Requests CTA says "take the requests that arrive by email today", and we have no way to take them. |
| 2 | **Intake forms.** A link or embed that creates a request in the right channel with the right category and fields, without the person being in the channel yet. | Zendesk, ClickUp, Notion | The cold start. Someone at the client who has never been invited still needs a way in. Also the honest answer to "but we like having a portal". |
| 3 | **Two-way calendar sync, Google and Microsoft.** | All five, in some form | We sell scheduled events and meetings. An event that does not appear in the client's Outlook did not happen. At minimum an .ics feed per channel. |
| 4 | **A Zapier or Make connector.** | All five | We have the API and the webhooks, which is the plumbing. A connector is the product, and it is the one-line answer to "do you integrate with our CRM". Cheapest possible fix for the marketplace objection. |

### Tier 2: expected, and quietly lost deals

| # | Gap | Who has it | Why it matters here |
|---|---|---|---|
| 5 | **Saved replies / canned responses.** | Zendesk (macros), ClickUp | The chat-side twin of the wiki. The wiki stops the client asking twice; a saved reply stops your team typing it twice. We argue the first half and ignore the second. |
| 6 | **Business hours and holiday calendars on the SLA clock.** | Zendesk | We show the clock to the client. A clock that runs through Saturday is visibly wrong, and it is wrong in front of the customer, which is worse. |
| 7 | **Board and calendar views of a channel's requests.** | ClickUp, Basecamp, Notion | Within one channel this does not touch the sealed model. It is table stakes, and the absence makes us look older than we are. |
| 8 | **Time on a request.** Even a duration field and an export, not a timesheet product. | ClickUp native, Basecamp and Zendesk via apps | We concede this twice in the current copy. Agencies, law firms and accounting firms are three of our named use cases and all three bill by time. |
| 9 | **Google Drive, OneDrive and Dropbox file pickers.** | All five | Clients keep files there. Re-uploading is where "one place for everything" starts to feel like a lie. |

### Tier 3: worth having, nobody has walked over it

| # | Gap | Who has it |
|---|---|---|
| 10 | Real-time co-editing on wiki pages | Notion, ClickUp, Basecamp |
| 11 | A published, public help centre | Zendesk |
| 12 | Message scheduling and reminders | Slack |
| 13 | Drop-in audio rooms (huddles) | Slack |
| 14 | Organisation-to-organisation federation, the Slack Connect equivalent | Slack | 
| 15 | Recurring requests (playbooks may already cover part of this) | ClickUp |
| 16 | Request templates the guest sees when raising one | Zendesk, ClickUp |

### Not features, but they block deals

| # | Gap | Note |
|---|---|---|
| 17 | **SOC 2 Type II or ISO 27001** | All five have one or both. Any client with a procurement process asks. `/security` currently says nothing about either, which is worse than saying "in progress". |
| 18 | **Choice of data region** | Ties into the EU question already open on the cookie banner. |
| 19 | **A public status page** | Cheap, and the first thing a technical buyer looks for. |

---

## Part 3: deliberate absences, not gaps

These follow from the sealed-channel model and should never appear on a gap list:

- Search across every channel you belong to
- A personal "my work" queue spanning channels
- Roll-up reporting across clients

**But there is a contradiction on the live site about the third one.** Three use-case pages promise
exactly the cross-channel roll-up the model forbids, in the section image alt text:

- `use-cases.accounting-firms.oversight` : "The practice dashboard: open items **across client channels**"
- `use-cases.it-service-providers.oversight` : "The provider dashboard: requests this month **across client channels**"
- `use-cases.marketing-agencies.oversight` : "The agency dashboard: open items **across client channels**"

The body copy under each one is model-compliant ("on the client's own channel dashboard", "every
client keeps its own score"), so the section is arguing with itself. The section headings lean the
same way: "Which contracts are healthy, and which are quietly losing money" is a cross-client
question.

This needs a decision, because it is the commercial pressure point of the whole model. A firm with
forty clients will want one number. Options, roughly:

1. Hold the line. Fix the three alt texts and the headings, and accept that the owner's answer is
   "open each channel".
2. Allow a roll-up that is owner-only and counts only, never content: open, breaching, resolved,
   per channel, visible to nobody outside your company. The channels stay sealed; the tally does not
   leak anything a guest could see.
3. Allow a full cross-channel view and drop the sealed-channel claim from the marketing.

Option 2 looks like the one that keeps both promises, but it is a product decision, not a copy one.

---

## What to verify before using any of this

- Every competitor capability above, against the vendor's own current documentation. This was
  written from knowledge of these products, not from a fresh crawl of their docs.
- Whether anything in Tier 1 or 2 is already built and simply missing from `lib/plan-features.ts`.
  The list there is what we publish, not necessarily what exists.
