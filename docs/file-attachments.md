# File attachments

How a file gets into a channel, from any side, and why the channel has to hold it.

Design note, 1 October 2026. Nothing is built. Provider specifics are from knowledge, not a fresh
crawl, and these APIs move.

> Supersedes an earlier version of this note that proposed linking to files in Google Drive,
> OneDrive and Dropbox instead of copying them. That was wrong, for the reasons in the next
> section. The parts worth keeping are marked below.

## The rule

**A file attached to a channel is copied into the channel at that moment, hashed, and never
mutated.** That copy is the record. Everything else is a convenience for getting the bytes in.

## Why a link cannot be the record

The product is sold on evidence. A sample of what the site already promises:

- "What you asked for, when, and what the client **actually sent**. Decisive when a client says
  they gave you something they did not."
- "Who asked, when it was answered, **which revision went out** and who acknowledged it."
- "When a client questions an invoice, the channel answers: what was approved, by whom, **on which
  version**."
- "The photo attached to the request is **the only evidence that survives**."

A link cannot carry any of that, because the other end is not ours:

| What happens at the source | What the channel's record becomes |
|---|---|
| File edited | The record silently changes meaning. An approval now points at something nobody approved. |
| File moved or renamed | Dead pointer. |
| File deleted, or the person leaves and their drive is deprovisioned | The evidence is gone, and it was never ours to keep. |
| Sharing policy tightened by the client's IT | Everything breaks at once, retroactively, across every channel. |

One file changed on OneDrive after the fact invalidates what was sent the first time. That is the
whole objection and it is fatal on its own.

It also makes two things we sell impossible. **Retention policies** and **channel archiving and
export** (both on `/pricing`) cannot apply to bytes somebody else holds. Neither can legal hold.

## Attachments come from all sides

The earlier note assumed a staff member picking from a drive they had connected. That covers maybe
half the traffic. Guests attach things constantly, and a guest is free, joined by an email link,
and will never OAuth their personal Dropbox to us.

| Source | Who uses it |
|---|---|
| Drag and drop, or a file dialog | Everyone |
| Phone camera and photo roll | Site, clinic, plant, roadside |
| **Email in** (we already ship this) | Clients who will not open the app |
| A drive picker: Google, OneDrive, Dropbox | Staff, and optionally guests |
| Paste from the clipboard | Everyone |

**All five land in the same place.** One ingest path, one copy, one hash, one audit entry. The
source is recorded as metadata ("from Melissa's Google Drive", "by email from
finance@harlowfoods.com") because provenance is useful, but it has no bearing on how the file is
served afterwards.

## So what is the drive picker, then?

A convenience on the way in. Not an architecture.

That is a large simplification over the earlier design, and a much easier security conversation:

- **No stored token.** Pick, download once, drop the credential. Nothing to rot, nothing to
  refresh, nothing to revoke later, nothing to steal from us a year from now.
- **No permissions created anywhere.** We never touch the client's sharing model.
- **No connection to maintain.** A staff member leaving does not kill old attachments, because the
  attachments were never pointers to their account.
- *(kept from the earlier note)* The picker scopes still matter for the one-shot read. Google's
  `drive.file` grants access only to files picked through the Picker, which also keeps us out of
  Google's restricted-scope security assessment, an annual third-party audit with real cost.
  Microsoft's File Picker can issue item-scoped tokens rather than tenant-wide `Files.Read.All`.
  Dropbox uses scoped apps.

The friction a picker removes is **finding and selecting** a file. It was never **storing** it.

## Versions

A file never changes in place. A new revision is **a new attachment, linked to the previous one**.
The channel shows the chain, and every request, approval and message keeps pointing at the exact
revision it referred to.

This is what the architecture and manufacturing pages already describe: "link the new revision to
the RFI or instruction that caused it", and an engineering change notice against a specific
drawing revision.

### Optional, later: watch the source

If someone wants the convenience of a live document, the right shape keeps the record intact:
Kolabr notices the source file changed and **offers** to attach the new revision. The existing
attachment is untouched. The user gets a prompt, not a silent mutation.

This needs a stored token, so it is a separate, opt-in feature with a real cost, not part of v1.

## Serving a file to a guest

*(kept from the earlier note, and now trivial, because the bytes are ours)*

On every click, server-side: is this person still in this channel, is this file still attached,
is it still within retention. Then stream it from our storage.

The guest never meets a login wall, because there is nothing to log into. Revoking is removing
them from the channel. Every view is in our audit log.

## Consequences worth deciding

1. **Storage is the meter, and that is already the model.** `/pricing` sells 10 GB per user on Pro
   and 50 GB on Business. Ingesting every attachment consumes it, which is honest: you pay for what
   you keep. No change needed, but the numbers should be sanity-checked against real attachment
   volumes for a construction or logistics customer.
2. **Deduplication.** Store once per hash at tenant level, with channels holding references into
   that store. Decide whether a deduplicated file counts once or once per channel against quota.
   Counting once is more honest and less explicable; counting per channel is the reverse.
3. **Virus scanning on ingest.** A guest uploading to a channel your staff open is the obvious
   vector, and it is one more thing a procurement review will ask about.
4. **Size limits per plan**, and what the user sees when they exceed one.
5. **What a request shows when an attachment ages out under a retention policy.** A tombstone with
   the name, hash and date is better than silence, and keeps the audit trail readable.

## Still true: the security bar

Holding client documents is a higher bar than anything else in the product, and it is the
integration most likely to come up in a procurement review. Same conversation as SOC 2 and
ISO 27001. See [feature-gaps.md](feature-gaps.md).
