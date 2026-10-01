# Linking a cloud file into a channel

How a file in Google Drive, OneDrive or Dropbox gets into a Kolabr channel so that a free guest
can open it, without uploading a copy and without anyone fighting the provider's sharing UI.

Design note, 1 October 2026. Nothing is built. Provider specifics are from knowledge, not a fresh
crawl, and these APIs move: check them before committing to anything here.

## Why it is painful today

Three separate problems get conflated into one.

| | What it is | Who should solve it |
|---|---|---|
| **Pick** | Browse the drive, choose a file | The staff member, once, in a picker |
| **Grant** | Make the guest able to read it | **Nobody. Skip this entirely.** |
| **Serve** | Get the bytes to the guest when they click | Kolabr, server-side |

Every native sharing flow makes you do step 2, and step 2 is where it falls apart. The provider's
permission model is built around identities in *that* tenant, and an anonymous guest is not one of
them. You end up choosing between "anyone with the link", which the client's IT has probably
disabled, and a B2B guest invitation that drags the person into Entra ID.

## The approach: never grant the guest anything

Kolabr stores a **reference**, not a permission and not a copy:

```
provider · file id · name · mime · size · revision · the connection that can read it
```

When a guest clicks, Kolabr checks three things server-side:

1. Is this person still a member of this channel?
2. Is this file still attached to this request?
3. Does the stored connection still work?

Then it fetches the bytes from the provider with its own credential and streams them to the guest
through Kolabr's own domain.

**What this buys:**

- The guest never touches Google or Microsoft. No login wall, because there is nothing to log into.
- Nothing is uploaded. We hold a reference.
- Revocation is instant and in one place. Remove the guest from the channel and the next click
  fails. Granting real provider permissions means revoking in three different places, and a missed
  revoke is a leak that outlives Kolabr entirely.
- Every guest view lands in Kolabr's audit log, not in a provider log nobody reads.

## Why it is safe, and how to say so

The objection from the client's IT will be "so Kolabr can read our whole Drive?" The answer is no,
and the picker is what makes it true.

| Provider | The mechanism |
|---|---|
| **Google** | The `drive.file` scope grants access **only to files the user picked through the Picker**. Not the drive. It also avoids Google's restricted-scope security assessment, an annual third-party audit with real cost, which broader scopes like `drive.readonly` trigger. |
| **Microsoft** | The File Picker can issue item-scoped tokens rather than tenant-wide `Files.Read.All`. Graph also returns a short-lived pre-authenticated download URL per item, useful server-side. |
| **Dropbox** | Scoped apps with `files.content.read`, optionally confined to an app folder. |

The pitch: *Kolabr can read exactly the files your team handed it, one at a time, and nothing else.*

## Live or pinned: the part that is a feature

Linking raises a question uploading never does. What happens when the file changes after the
client approves it?

Make it a choice at attach time:

- **Live.** Always the current version. Right for a working document.
- **Pinned.** Kolabr snapshots that one revision. Yes, a copy, deliberately, of a single revision.

Pinned matters for the work Kolabr is sold for. "The client approved Rev C" is worthless if Rev C
silently became Rev D. Same for a marketing v3 sign-off, an engineering change notice, a signed
scope. **An approval that points at a live link is not evidence.**

Suggested default: attachments on a request are **pinned**, files dropped in chat are **live**.

## Three decisions to make first

1. **Whose credential?** The attacher's token dies when they leave the company, and every old link
   in every channel dies with it. A workspace-level connection authorised once by an admin survives
   staff turnover but is a bigger ask at setup. Recommendation: workspace connection, with the
   attacher's token as a fallback and a visible "reconnect needed" state.
2. **What happens when the source file is moved, renamed or deleted?** The guest sees something.
   Decide whether that is a tombstone with the last known name and date, or silence.
3. **Preview, or just download?** Inline preview needs conversion. Google can export Docs to PDF;
   the others have thumbnail and preview endpoints. A v1 of thumbnail, name and an Open button that
   streams is honest and much cheaper.

## What can still block it

This design needs **one OAuth consent**, and in a locked-down Microsoft tenant that means admin
consent for the app. That is a sales-cycle problem rather than a technical one, but it is real.
The argument is one approval once, instead of a per-file sharing fight forever.

## The caution

This does not make Kolabr a file store, but it does make Kolabr a **read path into the client's
document store**, which is a higher security bar than anything else in the product. It is also the
integration most likely to come up in a procurement review, which is the same conversation as
SOC 2 and ISO 27001. See [feature-gaps.md](feature-gaps.md).
