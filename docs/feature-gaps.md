# Feature gaps

What a buyer coming from Slack, Basecamp, Notion, ClickUp or Zendesk expects to find and will not.
Written 1 October 2026. Not a roadmap, and it prices nothing.

## Do these two first

Neither is a missing feature. Both are things we have and do not say.

**1. Email in and out of a request is invisible.** We ship it. The site never mentions it, and it
has no row in `lib/plan-features.ts`. It is the direct answer to "my client will never log into
another tool", and the `/product/requests` CTA already says "take the requests that arrive by
email today" without claiming we can. Needs: a `/pricing` row, a mention on `/product/requests`,
a line in the Slack and Zendesk comparisons.

**2. The integration answer needs one sentence.** "We have a public API and we will help you
connect it, on Business." Better than a directory of half-maintained connectors, and currently
only visible three rows deep in the pricing table.

## Gaps

| Tier | Gap | Who has it | Why it matters |
|---|---|---|---|
| 1 | Saved replies / canned responses | Zendesk, ClickUp | The wiki stops the client asking twice. A saved reply stops your team typing it twice. We argue the first half only. |
| 1 | Business hours on the SLA clock | Zendesk | We show the clock to the client. A clock running through Saturday is wrong in front of the customer. |
| 1 | Time on a request (a duration field and an export, not timesheets) | ClickUp | Agencies, law firms and accounting firms all bill by time. Three of our named use cases. |
| 2 | Board and calendar views of a channel's requests | ClickUp, Basecamp, Notion | Table stakes. Within one channel, so it does not touch the channel boundary. |
| 2 | Google Drive, OneDrive, Dropbox file pickers | All five | Clients keep files there. Re-uploading is where "one place for everything" starts to feel like a lie. |
| 2 | Two-way calendar sync *(planned)* | All five | An event that does not reach the client's Outlook did not happen. |
| 3 | Real-time co-editing on wiki pages | Notion, ClickUp, Basecamp | |
| 3 | Published public help centre | Zendesk | |
| 3 | Message scheduling and reminders | Slack | |
| 3 | Drop-in audio rooms | Slack | |
| 3 | Org-to-org federation (Slack Connect equivalent) | Slack | |
| 3 | Recurring requests | ClickUp | Playbooks may already cover part of this. |
| 3 | Request templates the guest sees | Zendesk, ClickUp | |

Tier 1 is asked about in the first conversation. Tier 3 has not lost anyone a deal.

## Not features, but they block deals

- **SOC 2 Type II or ISO 27001.** All five competitors have one or both. `/security` says nothing
  about either, which reads as "no" to anyone who knows to check.
- **Choice of data region.** Ties into the EU question open on the cookie banner.
- **A public status page.** Cheap, and the first thing a technical buyer looks for.

## Deliberate absences

Never put these on a gap list.

| | Why |
|---|---|
| Cross-channel search, a personal queue spanning channels, roll-up reporting across clients | The channel boundary. See below. |
| Intake forms | A form filing into a queue is the portal the Zendesk page argues against. A client gets in by being invited, which costs nothing. |
| A connector directory | The answer is the API, webhooks, and help building the connection, on Business. A service, not a catalogue. |
| An app marketplace, a developer platform, an automation builder | We say "nothing to integrate, nothing to configure" as a strength. Saying it twice, as a shortfall, is why the concession block came off the compare pages (`6d0ab8d`). |

### The channel boundary

Decided 1 October 2026. **A channel shows that channel**, and nothing on the site may suggest
otherwise. Settings sits outside the channel system and defines things that apply inside channels.
Analytics will be a third area of that kind: outside channels, owner-side only, never reachable by
a guest. That is where cross-channel numbers live, so the roll-up exists; it is just never a
channel view.

Applied in `bdc5110`. When Analytics ships it needs its own page, its own `/pricing` row, and its
own chrome, so nobody mistakes it for something inside a channel.

## Before using any of this

- **Check every competitor claim** against the vendor's own current docs. Written from knowledge of
  these products, not a fresh crawl, and plan names and prices move.
- **Check `lib/plan-features.ts` against what actually exists.** That list is what we publish, not
  what we have. Email in and out was exactly this: shipped, and absent from both.
