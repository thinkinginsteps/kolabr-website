# Screenshot regeneration: em dash removal

**Second pass, 23 September 2026 (see the section at the end): the remaining em dashes are gone.**
The 126 placeholder dashes became hyphens and the affected screenshots were recaptured, the 28
dashes in the hand-taken screenshots were retouched, and the Construction use case now has its own
screenshots instead of the clinic ones.

Date of the first pass: 2026-09-22. Scope: the Kolabr app mockups in `design/` that feed the product screenshots used on the marketing site. Only `design/`, `.design-backup/` and this file were touched.

## Summary

- 832 em dash edits across 85 files (78 industry mockups in `design/screens/`, the 7 school mockups `design/Screen - *.dc.html`, and 6 templates in `design/bases/`). Every edit is listed below.
- 126 em dashes were deliberately not changed: they are the empty-cell placeholder symbol used as data in code (see "Not changed"). They still show in the Requests screenshots.
- 70 PNGs in `design/assets/screens/` were regenerated at identical pixel dimensions. 5 were not affected (no em dash in the captured area). 1 (`c2-chat.png`) was left alone because its source has changed since it was captured.
- The 32 used PNGs in `design/assets/` (ui-*, app-*) have no reproducible source in `design/`: they are hand-taken macOS screenshots of the real app (byte-identical copies of files in `design/uploads/`). They were left alone. 19 of them still visibly contain em dashes (listed below).
- Backups of every edited HTML/TXT file and of every PNG in `design/assets/screens/` are in `.design-backup/design/...` (same relative paths).

## How to rerun

The capture script and shot list are in the project:

```
scripts/screenshots/capture.mjs   # Playwright capture script
scripts/screenshots/jobs.json     # PNG to source mapping and per-shot settings (75 shots; c2-chat excluded, see below)
```

From the project root:

```
npm i -D playwright && npx playwright install chromium
node scripts/screenshots/capture.mjs scripts/screenshots/jobs.json   # overwrites design/assets/screens/*.png
npm run assets                                                        # refreshes the WebP copies in assets/images/
```

Needs network access (the mockups load React, ReactDOM and Babel from unpkg, and Material Symbols from Google Fonts). The script retries page loads up to 3 times and logs any broken image. Originals from before this run are in `.design-backup/design/`.

## Capture settings (reverse-engineered)

Each setting was confirmed by rendering the unedited source and pixel-diffing it against the original PNG. With these settings the unedited sources reproduce the originals to within 0.001% to 0.04% of pixels (antialiasing only), except where noted.

- Chromium via Playwright, `deviceScaleFactor: 2`, file:// URL, wait for network idle, `document.fonts.ready`, all images loaded, then 1.5 s.
- Desktop screens: viewport 1604x912 CSS px, full viewport screenshot (3208x1824 PNG).
- Mobile screens: viewport 520x912 (1040x1824 PNG).
- Scrollbars visible (Playwright's default `--hide-scrollbars` removed) and the thumb restyled to match the originals: `rgba(0,0,0,.5)`, 7 px wide, inset 1 px left and 2 px right. The originals were captured in an environment with a darker overlay-style thumb; the page CSS alone draws a pale one.
- Every scroll container reset to `scrollTop = 0` after load. The chat views auto-scroll to the bottom on load; the originals are at the top.
- Wiki crops (`*-wiki.png`, `a7-wiki-crop.png`; 2004 px wide, variable height): element screenshot of the white wiki card (nav plus article, 1002 CSS px wide), transparent outside its 20 px rounded corners. Layout is kept as at 1604x912 (main keeps its scrollbar gutter, the wiki nav keeps `max-height: 762px`, i.e. `100vh - 150px` at 912) but the page is rendered in a 2600 px tall viewport so the whole card is painted. Clip height is the card height rounded to the nearest CSS px (this is how the original heights were produced).
- `shot-wiki.png` only: the right-hand rail ("On this page", tags, attachments) sits 10 CSS px further right in the original than the current source lays it out. Emulated at capture time with `margin-left: 10px; margin-right: -10px` on the rail (no source change). With it the unedited source matches to 0.003%.
- `i2-wiki.png` only: after the edits the article is one line shorter, so the card would come out 21 CSS px shorter than the original PNG. The card was given `min-height: 1646px` at capture time so the PNG keeps its exact 2004x3292 size; the result is 21 px of extra white space at the bottom of the card.

## PNG to source mapping

### design/assets/screens/

Letter prefixes are iteration labels. Mapping confirmed by content and pixel diff: a = architecture, ac = accounting, c = clinics (and one construction), e = engineering, i = IT service providers, l = law, g = logistics, f = manufacturing, m = marketing, n = nonprofits, p = property management, shot = schools.

| PNG | Size | Source | Mode | Used on | Result |
|---|---|---|---|---|---|
| a5-chat.png | 3208x1824 | `screens/Arch - Chat.dc.html` | desktop 1604x912 | Compare - Basecamp, Use Case - Architecture Firms | Regenerated |
| a5-requests.png | 3208x1824 | `screens/Arch - Requests.dc.html` | desktop 1604x912 | Compare - Basecamp, Use Case - Architecture Firms | Regenerated |
| a7-wiki-crop.png | 2004x3250 | `screens/Arch - Wiki.dc.html` | wiki card crop | Use Case - Architecture Firms | Regenerated |
| a3-mobile.png | 1040x1824 | `screens/Arch - Mobile.dc.html` | mobile 520x912 | Use Case - Architecture Firms | Regenerated |
| a5-events.png | 3208x1824 | `screens/Arch - Events.dc.html` | desktop 1604x912 | Use Case - Architecture Firms | Not affected (no em dash in captured area), unchanged |
| a5-dashboard.png | 3208x1824 | `screens/Arch - Dashboard.dc.html` | desktop 1604x912 | Use Case - Architecture Firms | Regenerated |
| ac2-chat.png | 3208x1824 | `screens/ACC - Chat.dc.html` | desktop 1604x912 | Use Case - Accounting Firms | Regenerated |
| ac2-requests.png | 3208x1824 | `screens/ACC - Requests.dc.html` | desktop 1604x912 | Use Case - Accounting Firms | Regenerated |
| ac2-wiki.png | 2004x3352 | `screens/ACC - Wiki.dc.html` | wiki card crop | Use Case - Accounting Firms | Regenerated |
| ac3-mobile.png | 1040x1824 | `screens/ACC - Mobile.dc.html` | mobile 520x912 | Use Case - Accounting Firms | Regenerated |
| ac2-events.png | 3208x1824 | `screens/ACC - Events.dc.html` | desktop 1604x912 | Use Case - Accounting Firms | Not affected (no em dash in captured area), unchanged |
| ac2-dashboard.png | 3208x1824 | `screens/ACC - Dashboard.dc.html` | desktop 1604x912 | Use Case - Accounting Firms | Regenerated |
| c3-chat.png | 3208x1824 | `screens/CLN - Chat.dc.html` | desktop 1604x912 | Use Case - Clinics | Regenerated |
| c5-requests.png | 3208x1824 | `screens/CLN - Requests.dc.html` | desktop 1604x912 | Use Case - Clinics | Regenerated |
| c6-wiki.png | 2004x3204 | `screens/CLN - Wiki.dc.html` | wiki card crop | Use Case - Clinics, Use Case - Construction | Regenerated |
| c8-mobile.png | 1040x1824 | `screens/CLN - Mobile.dc.html` | mobile 520x912 | Use Case - Clinics | Regenerated |
| c6-events.png | 3208x1824 | `screens/CLN - Events.dc.html` | desktop 1604x912 | Use Case - Clinics | Not affected (no em dash in captured area), unchanged |
| c5-dashboard.png | 3208x1824 | `screens/CLN - Dashboard.dc.html` | desktop 1604x912 | Use Case - Clinics, Use Case - Construction | Regenerated |
| c2-chat.png | 3208x1824 | `screens/CLN - Chat.dc.html` (older version) | desktop 1604x912 | Use Case - Construction | Left alone: source changed since capture (see below) |
| c4-requests.png | 3208x1824 | `screens/CLN - Requests.dc.html` | desktop 1604x912 | Use Case - Construction | Regenerated |
| c6-mobile.png | 1040x1824 | `screens/Con - Mobile.dc.html` | mobile 520x912 | Use Case - Construction | Regenerated |
| c5-events.png | 3208x1824 | `screens/CLN - Events.dc.html` | desktop 1604x912 | Use Case - Construction | Not affected (no em dash in captured area), unchanged |
| e2-chat.png | 3208x1824 | `screens/ENG - Chat.dc.html` | desktop 1604x912 | Use Case - Engineering Firms | Regenerated |
| e2-requests.png | 3208x1824 | `screens/ENG - Requests.dc.html` | desktop 1604x912 | Use Case - Engineering Firms | Regenerated |
| e2-wiki.png | 2004x3414 | `screens/ENG - Wiki.dc.html` | wiki card crop | Use Case - Engineering Firms | Regenerated |
| e4-mobile.png | 1040x1824 | `screens/ENG - Mobile.dc.html` | mobile 520x912 | Use Case - Engineering Firms | Regenerated |
| e2-events.png | 3208x1824 | `screens/ENG - Events.dc.html` | desktop 1604x912 | Use Case - Engineering Firms | Regenerated |
| e2-dashboard.png | 3208x1824 | `screens/ENG - Dashboard.dc.html` | desktop 1604x912 | Use Case - Engineering Firms | Regenerated |
| i2-chat.png | 3208x1824 | `screens/ITSP - Chat.dc.html` | desktop 1604x912 | Compare - Teams, Use Case - IT Service Providers | Regenerated |
| i2-requests.png | 3208x1824 | `screens/ITSP - Requests.dc.html` | desktop 1604x912 | Compare - Teams, Use Case - IT Service Providers | Regenerated |
| i2-wiki.png | 2004x3292 | `screens/ITSP - Wiki.dc.html` | wiki card crop | Use Case - IT Service Providers | Regenerated (min-height kept, see settings) |
| i2-mobile.png | 1040x1824 | `screens/ITSP - Mobile.dc.html` | mobile 520x912 | Use Case - IT Service Providers | Regenerated |
| i2-events.png | 3208x1824 | `screens/ITSP - Events.dc.html` | desktop 1604x912 | Use Case - IT Service Providers | Regenerated |
| i2-dashboard.png | 3208x1824 | `screens/ITSP - Dashboard.dc.html` | desktop 1604x912 | Use Case - IT Service Providers | Regenerated |
| l3-chat.png | 3208x1824 | `screens/LAW - Chat.dc.html` | desktop 1604x912 | Compare - ClickUp, Use Case - Law Firms | Regenerated |
| l3-requests.png | 3208x1824 | `screens/LAW - Requests.dc.html` | desktop 1604x912 | Compare - ClickUp, Use Case - Law Firms | Regenerated |
| l3-wiki.png | 2004x3324 | `screens/LAW - Wiki.dc.html` | wiki card crop | Use Case - Law Firms | Regenerated |
| l4-mobile.png | 1040x1824 | `screens/LAW - Mobile.dc.html` | mobile 520x912 | Use Case - Law Firms | Regenerated |
| l3-events.png | 3208x1824 | `screens/LAW - Events.dc.html` | desktop 1604x912 | Use Case - Law Firms | Regenerated |
| l3-dashboard.png | 3208x1824 | `screens/LAW - Dashboard.dc.html` | desktop 1604x912 | Use Case - Law Firms | Regenerated |
| g2-chat.png | 3208x1824 | `screens/LOG - Chat.dc.html` | desktop 1604x912 | Compare - Zendesk, Use Case - Logistics | Regenerated |
| g2-requests.png | 3208x1824 | `screens/LOG - Requests.dc.html` | desktop 1604x912 | Compare - Zendesk, Use Case - Logistics | Regenerated |
| g2-wiki.png | 2004x3366 | `screens/LOG - Wiki.dc.html` | wiki card crop | Use Case - Logistics | Regenerated |
| g3-mobile.png | 1040x1824 | `screens/LOG - Mobile.dc.html` | mobile 520x912 | Use Case - Logistics | Regenerated |
| g2-events.png | 3208x1824 | `screens/LOG - Events.dc.html` | desktop 1604x912 | Use Case - Logistics | Regenerated |
| g2-dashboard.png | 3208x1824 | `screens/LOG - Dashboard.dc.html` | desktop 1604x912 | Use Case - Logistics | Regenerated |
| f2-chat.png | 3208x1824 | `screens/MFG - Chat.dc.html` | desktop 1604x912 | Use Case - Manufacturing | Regenerated |
| f2-requests.png | 3208x1824 | `screens/MFG - Requests.dc.html` | desktop 1604x912 | Use Case - Manufacturing | Regenerated |
| f2-wiki.png | 2004x3334 | `screens/MFG - Wiki.dc.html` | wiki card crop | Use Case - Manufacturing | Regenerated |
| f3-mobile.png | 1040x1824 | `screens/MFG - Mobile.dc.html` | mobile 520x912 | Use Case - Manufacturing | Regenerated |
| f2-events.png | 3208x1824 | `screens/MFG - Events.dc.html` | desktop 1604x912 | Use Case - Manufacturing | Not affected (no em dash in captured area), unchanged |
| f2-dashboard.png | 3208x1824 | `screens/MFG - Dashboard.dc.html` | desktop 1604x912 | Use Case - Manufacturing | Regenerated |
| m2-chat.png | 3208x1824 | `screens/Mkt - Chat.dc.html` | desktop 1604x912 | Compare - Slack, Use Case - Marketing Agencies | Regenerated |
| m2-requests.png | 3208x1824 | `screens/Mkt - Requests.dc.html` | desktop 1604x912 | Compare - Slack, Use Case - Marketing Agencies | Regenerated |
| m2-wiki.png | 2004x3300 | `screens/Mkt - Wiki.dc.html` | wiki card crop | Compare - Notion, Use Case - Marketing Agencies | Regenerated |
| m3-mobile.png | 1040x1824 | `screens/Mkt - Mobile.dc.html` | mobile 520x912 | Use Case - Marketing Agencies | Regenerated |
| m2-events.png | 3208x1824 | `screens/Mkt - Events.dc.html` | desktop 1604x912 | Use Case - Marketing Agencies | Regenerated |
| m2-dashboard.png | 3208x1824 | `screens/Mkt - Dashboard.dc.html` | desktop 1604x912 | Use Case - Marketing Agencies | Regenerated |
| n2-chat.png | 3208x1824 | `screens/NPO - Chat.dc.html` | desktop 1604x912 | Use Case - Nonprofits | Regenerated |
| n2-requests.png | 3208x1824 | `screens/NPO - Requests.dc.html` | desktop 1604x912 | Use Case - Nonprofits | Regenerated |
| n2-wiki.png | 2004x3292 | `screens/NPO - Wiki.dc.html` | wiki card crop | Use Case - Nonprofits | Regenerated |
| n4-mobile.png | 1040x1824 | `screens/NPO - Mobile.dc.html` | mobile 520x912 | Use Case - Nonprofits | Regenerated |
| n2-events.png | 3208x1824 | `screens/NPO - Events.dc.html` | desktop 1604x912 | Use Case - Nonprofits | Regenerated |
| n2-dashboard.png | 3208x1824 | `screens/NPO - Dashboard.dc.html` | desktop 1604x912 | Use Case - Nonprofits | Regenerated |
| p2-chat.png | 3208x1824 | `screens/PM - Chat.dc.html` | desktop 1604x912 | Compare - Notion, Use Case - Property Management | Regenerated |
| p2-requests.png | 3208x1824 | `screens/PM - Requests.dc.html` | desktop 1604x912 | Use Case - Property Management | Regenerated |
| p2-wiki.png | 2004x3300 | `screens/PM - Wiki.dc.html` | wiki card crop | Use Case - Property Management | Regenerated |
| p3-mobile.png | 1040x1824 | `screens/PM - Mobile.dc.html` | mobile 520x912 | Use Case - Property Management | Regenerated |
| p2-events.png | 3208x1824 | `screens/PM - Events.dc.html` | desktop 1604x912 | Use Case - Property Management | Regenerated |
| p2-dashboard.png | 3208x1824 | `screens/PM - Dashboard.dc.html` | desktop 1604x912 | Use Case - Property Management | Regenerated |
| shot-chat.png | 3208x1824 | `Screen - School Channel Chat.dc.html` | desktop 1604x912 | Use Case - Schools | Regenerated |
| shot-mobile.png | 1040x1824 | `Screen - Mobile Chat.dc.html` | mobile 520x912 | Use Case - Schools | Regenerated |
| shot-requests.png | 3208x1824 | `Screen - Requests.dc.html` | desktop 1604x912 | Use Case - Schools | Regenerated |
| shot-events.png | 3208x1824 | `Screen - Events.dc.html` | desktop 1604x912 | Use Case - Schools | Regenerated |
| shot-wiki.png | 3208x1824 | `Screen - Wiki.dc.html` | desktop 1604x912, rail offset | Use Case - Schools | Regenerated |
| shot-dashboard-final.png | 3208x1824 | `Screen - Dashboard.dc.html` | desktop 1604x912 | Use Case - Schools | Regenerated |

### design/assets/ (ui-*, app-*)

No mockup source in `design/`. Every one is a byte-identical copy of a macOS screenshot in `design/uploads/` (window captures of the real Kolabr app at 1x, "Northwind Trading" tenant) or a crop of one. `design/uploads/Kolabr Interface/*.html` are bundled mockups of an earlier app build with different data (rendered and compared: 3.2% pixel difference on the requests list, different rows, missing photos and logo), so they are not the source either. All 32 were left alone.

| PNG | Origin | Visible em dash? |
|---|---|---|
| ui-dashboard.png | uploads/Screenshot 2026-09-16 at 14.46.00.png | no |
| ui-events.png | uploads/Screenshot 2026-09-16 at 14.47.13.png | yes: truncated calendar chip "11:30 SLA review —..." |
| ui-chat.png | uploads/Screenshot 2026-09-16 at 14.46.22.png | yes: 3 messages ("staging first please — I want...", "Dylan, Lena — once staging...", "staging now — I will drop...") |
| ui-call.png | uploads/Screenshot 2026-09-16 at 14.47.56.png | no |
| ui-channel-dashboard.png | no upload match (identical content to ui-dashboard) | no |
| ui-channel-switcher.png | uploads/Screenshot 2026-09-16 at 15.49.01.png | no |
| app-requests.png | uploads/pasted-1789542306328-0.png | yes: "Payment Issue in Prod — Minimum amount" |
| ui-admin-channels.png | uploads/Screenshot 2026-09-17 at 15.03.22.png | no |
| ui-admin-users.png | uploads/Screenshot 2026-09-17 at 15.03.12.png | no |
| ui-admin-config.png | uploads/Screenshot 2026-09-17 at 15.03.59.png | no |
| ui-admin-audit.png | uploads/Screenshot 2026-09-17 at 15.03.46.png | possibly: empty Entity ID / IP cells show a dash placeholder (monospace, could be an en or em dash) |
| ui-channel-chat.png | uploads/Screenshot 2026-09-17 at 13.00.22.png | yes: pinned "Fri 14:00 — no production deploys", "Staging first please — replay...", "Deploy review scheduled — today 15:00", "staging now — I will drop..." |
| ui-thread-crop.png | crop of uploads/Screenshot 2026-09-17 at 13.03.06.png | yes: "Morning all — invoice sync...", "gateway logs — every failure..." |
| ui-dash-dark.png | uploads/Screenshot 2026-09-16 at 14.48.30-50d7e3f2.png | no |
| ui-pop-account.png | crop of uploads/Screenshot 2026-09-17 at 15.09.54.png | no |
| ui-pop-notifications.png | uploads/Screenshot 2026-09-17 at 15.09.36.png | yes: "SLA at risk on #4821 — “Invoice sync failing since Monday”" |
| ui-pop-chats.png | uploads/Screenshot 2026-09-17 at 15.09.22.png | yes: "Thanks — that worked." |
| ui-events-page.png | uploads/Screenshot 2026-09-17 at 13.43.13.png | yes: calendar chips "11:30 SLA review — Pay...", "15:00 Payments retro — ..." |
| ui-schedule-modal.png | uploads/Screenshot 2026-09-17 at 13.43.30.png | no |
| ui-meeting-call.png | uploads/Screenshot 2026-09-17 at 13.44.14.png | no |
| ui-events-day.png | uploads/Screenshot 2026-09-17 at 13.43.15.png | no |
| app-m-dash.png | uploads/Screenshot 2026-09-17 at 14.42.38.png | yes: "Escalation review — #4804" |
| app-m-chat.png | uploads/Screenshot 2026-09-17 at 14.43.28.png | yes: "fix at 4pm — I’ll update #4821 after" |
| app-m-events.png | uploads/Screenshot 2026-09-17 at 14.43.39.png | yes: "Design review — request intake", "Escalation review — #4804" (twice incl. list) |
| app-m-requests.png | uploads/Screenshot 2026-09-17 at 14.43.01.png | no |
| app-m-chats.png | uploads/Screenshot 2026-09-17 at 14.43.15.png | yes: "Thanks — that worked.", "Escalations — Northwind" |
| app-m-wiki.png | uploads/Screenshot 2026-09-17 at 14.43.57.png | yes: title "Invoice sync — runbook" |
| ui-requests-list.png | uploads/Screenshot 2026-09-17 at 13.13.55.png | yes: "Payment Issue in Prod — Minimum amount" and a placeholder dash in Assigned to |
| ui-request-detail.png | uploads/Screenshot 2026-09-17 at 13.14.56.png | yes: "various legitimate reasons —", "Request auto-closed — no response within 24 hours" |
| ui-wiki-article.png | uploads/Screenshot 2026-09-17 at 14.18.25.png | yes: "reflect the new time — the old batch window", "not the right page — use" |
| ui-wiki-new.png | uploads/Screenshot 2026-09-17 at 14.19.58.png | yes: select placeholders "— any —" (Service type, Category) |
| ui-wiki-kb-crop.png | crop of uploads/Screenshot 2026-09-17 at 14.20.54.png | no |

These need to be retaken from the live app (or edited by hand) once its copy is fixed. Note that the app copy they show also uses terms from the flag list (for example "Ticket #", "agents", "Support lead", "SLA"), which is out of scope here.

## Em dash edits

Rules applied: label or subject lines ("X — Y") became a colon, or a comma where the second part is a time or a name; an em dash introducing a new clause in running text became a full stop with the next word capitalised; an aside became a comma; seven short asides (a tooltip, a checklist item, a step heading, three system event lines and a file name) became parentheses. No other characters were changed. Identical strings are grouped; the Files column lists every file (and the count) where that exact string was changed.

| # | Before | After | Files (file:line) |
|---|---|---|---|
| 1 | Post as a channel announcement — notifies every member | Post as a channel announcement (notifies every member) | bases/base-chat.txt:614, Screen - Channel Chat.dc.html:619, Screen - School Channel Chat.dc.html:619, screens/ACC - Chat.dc.html:619, screens/Arch - Chat.dc.html:619, screens/CLN - Chat.dc.html:619, screens/Con - Chat.dc.html:619, screens/ENG - Chat.dc.html:619, screens/ITSP - Chat.dc.html:619, screens/LAW - Chat.dc.html:619, screens/LOG - Chat.dc.html:619, screens/MFG - Chat.dc.html:619, screens/Mkt - Chat.dc.html:619, screens/NPO - Chat.dc.html:619, screens/PM - Chat.dc.html:619 |
| 2 | Thanks — that worked. | Thanks, that worked. | bases/base-chat.txt:707, bases/base-dashboard.txt:573, bases/base-events.txt:896, bases/base-requests.txt:580, bases/base-wiki.txt:637, Screen - Channel Chat.dc.html:712 |
| 3 | Release freeze from Fri 14:00 — no production deploys over month-end. | Release freeze from Fri 14:00: no production deploys over month-end. | bases/base-chat.txt:746, Screen - Channel Chat.dc.html:751 |
| 4 | Morning all — invoice sync is still failing on our side. Finance has 41 unsynced invoices from Monday onward. | Morning all, invoice sync is still failing on our side. Finance has 41 unsynced invoices from Monday onward. | bases/base-chat.txt:750, bases/base-chat.txt:875, Screen - Channel Chat.dc.html:755, Screen - Channel Chat.dc.html:880 |
| 5 | Pulled the gateway logs — every failure is a 422 on the same batch id. | Pulled the gateway logs: every failure is a 422 on the same batch id. | bases/base-chat.txt:752, Screen - Channel Chat.dc.html:757 |
| 6 | Staging first please — replay the 41 stalled invoices there before it touches production, and I want someone from Northwind finance on the totals check. | Staging first please: replay the 41 stalled invoices there before it touches production, and I want someone from Northwind finance on the totals check. | bases/base-chat.txt:878, Screen - Channel Chat.dc.html:883 |
| 7 | Deploy review scheduled — today 15:00 | Deploy review scheduled: today 15:00 | bases/base-chat.txt:880, Screen - Channel Chat.dc.html:885 |
| 8 | Deploying to staging now — I will drop the replay window in here as soon as the build is up. | Deploying to staging now. I will drop the replay window in here as soon as the build is up. | bases/base-chat.txt:881, Screen - Channel Chat.dc.html:886 |
| 9 | SLA at risk on #4821 — “Invoice sync failing since Monday” | SLA at risk on #4821: “Invoice sync failing since Monday” | bases/base-chat.txt:992, bases/base-dashboard.txt:754, bases/base-events.txt:1463, bases/base-mobile.txt:687, bases/base-requests.txt:873, bases/base-wiki.txt:976, Screen - Channel Chat.dc.html:997 |
| 10 | Payments retro — July incidents | Payments retro: July incidents | bases/base-events.txt:984 |
| 11 | SLA review — Payments | SLA review: Payments | bases/base-events.txt:986 |
| 12 | Ruben is pushing the invoice-sync fix at 4pm — I’ll update #4821 after. | Ruben is pushing the invoice-sync fix at 4pm. I’ll update #4821 after. | bases/base-mobile.txt:152 |
| 13 | Escalation review — #4804 | Escalation review: #4804 | bases/base-mobile.txt:683, screens/CLN - Mobile.dc.html:684, screens/LOG - Mobile.dc.html:688, screens/MFG - Mobile.dc.html:688 |
| 14 | Payment Issue in Prod — Minimum amount | Payment Issue in Prod: Minimum amount | bases/base-requests.txt:624 |
| 15 | Mandate cut-off moves to 09:00 from 1 September 2026. The steps below already reflect the new time — the old batch window no longer applies. | Mandate cut-off moves to 09:00 from 1 September 2026. The steps below already reflect the new time: the old batch window no longer applies. | bases/base-wiki.txt:501 |
| 16 | Check the merchant is on an active mandate profile and that the request has an owner. If the batch has already settled, this is not the right page — use  | Check the merchant is on an active mandate profile and that the request has an owner. If the batch has already settled, this is not the right page. Use  | bases/base-wiki.txt:507 |
| 17 | Paste this into the channel once the corrected batch is queued. Keep the reference — it is what the merchant quotes back if the second attempt also fails. | Paste this into the channel once the corrected batch is queued. Keep the reference. It is what the merchant quotes back if the second attempt also fails. | bases/base-wiki.txt:547 |
| 18 | Hi — the mandate for account ending 4417 was rejected (code M04). We have corrected the account details and re-queued it in tonight's batch. Reference NW-MAND-8821. You will get a confirmation from us by 09:00 tomorrow. | Hi, the mandate for account ending 4417 was rejected (code M04). We have corrected the account details and re-queued it in tonight's batch. Reference NW-MAND-8821. You will get a confirmation from us by 09:00 tomorrow. | bases/base-wiki.txt:548 |
| 19 | New mandate required — do not retry | New mandate required, do not retry | bases/base-wiki.txt:854 |
| 20 | Thanks — noted. | Thanks, noted. | bases/base-wiki.txt:883, Screen - Wiki.dc.html:888, screens/ACC - Wiki.dc.html:884, screens/Arch - Wiki.dc.html:884, screens/CLN - Wiki.dc.html:884, screens/Con - Wiki.dc.html:884, screens/ENG - Wiki.dc.html:884, screens/ITSP - Wiki.dc.html:884, screens/LAW - Wiki.dc.html:884, screens/LOG - Wiki.dc.html:884, screens/MFG - Wiki.dc.html:884, screens/Mkt - Wiki.dc.html:884, screens/NPO - Wiki.dc.html:884, screens/PM - Wiki.dc.html:884 |
| 21 | Thank you — Sipho is back Monday. | Thank you. Sipho is back Monday. | Screen - Dashboard.dc.html:578, Screen - Events.dc.html:901, Screen - Requests.dc.html:585, Screen - School Channel Chat.dc.html:712, Screen - Wiki.dc.html:642 |
| 22 | Due today — #2184 “Absence: Amelia Adams, Wed–Thu” | Due today: #2184 “Absence: Amelia Adams, Wed–Thu” | Screen - Dashboard.dc.html:759, Screen - Events.dc.html:1470, Screen - Mobile Chat.dc.html:692, Screen - Requests.dc.html:879, Screen - School Channel Chat.dc.html:1014, Screen - Wiki.dc.html:981 |
| 23 | Pieter Malan assigned you request #2179 — transport change | Pieter Malan assigned you request #2179: transport change | Screen - Dashboard.dc.html:761, Screen - Events.dc.html:1472, Screen - Mobile Chat.dc.html:694, Screen - Requests.dc.html:881, Screen - School Channel Chat.dc.html:1016, Screen - Wiki.dc.html:983 |
| 24 | Request #2170 resolved — projector replaced in 4B | Request #2170 resolved: projector replaced in 4B | Screen - Dashboard.dc.html:762, Screen - Events.dc.html:1473, Screen - Mobile Chat.dc.html:695, Screen - Requests.dc.html:882, Screen - School Channel Chat.dc.html:1017, Screen - Wiki.dc.html:984 |
| 25 | Transport change — Sipho off the afternoon bus | Transport change: Sipho off the afternoon bus | Screen - Dashboard.dc.html:868, Screen - Events.dc.html:1020, Screen - Requests.dc.html:626, Screen - Requests.dc.html:1036, Screen - School Channel Chat.dc.html:1215 |
| 26 | Permission slip outstanding — Planetarium | Permission slip outstanding: Planetarium | Screen - Dashboard.dc.html:869, Screen - Events.dc.html:1021, Screen - Requests.dc.html:627, Screen - Requests.dc.html:1037, Screen - School Channel Chat.dc.html:1216 |
| 27 | e.g. Parent evening — Grade 4B | e.g. Parent evening: Grade 4B | Screen - Events.dc.html:645 |
| 28 | Grade 4 planning — Term 3 Week 6 | Grade 4 planning, Term 3 Week 6 | Screen - Events.dc.html:983 |
| 29 | Admissions interviews — 2027 intake | Admissions interviews: 2027 intake | Screen - Events.dc.html:987 |
| 30 | Attendance review — Grade 4 | Attendance review: Grade 4 | Screen - Events.dc.html:991 |
| 31 | Planetarium outing — final arrangements | Planetarium outing: final arrangements | Screen - Events.dc.html:993 |
| 32 | Parent evening slot — Dube family | Parent evening slot: Dube family | Screen - Events.dc.html:995, Screen - Mobile Chat.dc.html:688 |
| 33 | Assembly — Heritage Week | Assembly: Heritage Week | Screen - Events.dc.html:1000 |
| 34 | Catering review — tuck shop menu | Catering review: tuck shop menu | Screen - Events.dc.html:1001 |
| 35 | Grant is posting the Week 6 worksheets at 16:00 — I’ll update #2184 after. | Grant is posting the Week 6 worksheets at 16:00. I’ll update #2184 after. | Screen - Mobile Chat.dc.html:157 |
| 36 | Transport change — Sipho, afternoon bus | Transport change: Sipho, afternoon bus | Screen - Mobile Chat.dc.html:683 |
| 37 | Lunch order change — no dairy for Ruby | Lunch order change: no dairy for Ruby | Screen - Requests.dc.html:632 |
| 38 | Late arrival — bus delayed on the N2 route | Late arrival: bus delayed on the N2 route | Screen - Requests.dc.html:636 |
| 39 | Replacement library book — lost in transit | Replacement library book: lost in transit | Screen - Requests.dc.html:639 |
| 40 | Planetarium outing — permission slips and R120 due Thursday 14:00. | Planetarium outing: permission slips and R120 due Thursday 14:00. | Screen - School Channel Chat.dc.html:751 |
| 41 | Morning — Amelia is off today and probably tomorrow, chest infection. Doctor’s note attached. Could she get the maths worksheets? | Morning. Amelia is off today and probably tomorrow, chest infection. Doctor’s note attached. Could she get the maths worksheets? | Screen - School Channel Chat.dc.html:755, Screen - School Channel Chat.dc.html:897 |
| 42 | @channel permission slips for the Planetarium outing are due Thursday 14:00. R120 covers the bus and entry — pay through the office or the school app. | @channel permission slips for the Planetarium outing are due Thursday 14:00. R120 covers the bus and entry. Pay through the office or the school app. | Screen - School Channel Chat.dc.html:895 |
| 43 | Request #2184 created from a message — Absence: Amelia Adams | Request #2184 created from a message (Absence: Amelia Adams) | Screen - School Channel Chat.dc.html:899 |
| 44 | Reminder that Friday is a civvies day for the outing fund — R10, no uniform. Swimming moves to Monday because the pool is being serviced. | Reminder that Friday is a civvies day for the outing fund, R10, no uniform. Swimming moves to Monday because the pool is being serviced. | Screen - School Channel Chat.dc.html:900 |
| 45 | Three families have asked about lift arrangements for the outing — I have started a wiki page with who is driving and how many seats are left. | Three families have asked about lift arrangements for the outing. I have started a wiki page with who is driving and how many seats are left. | Screen - School Channel Chat.dc.html:901 |
| 46 | Parent evening slots open — Thu 17:00–19:30 | Parent evening slots open, Thu 17:00–19:30 | Screen - School Channel Chat.dc.html:902 |
| 47 | From 1 September absences must be logged before 08:15, not 09:00. The steps below already reflect the new cut-off — the old deadline no longer applies. | From 1 September absences must be logged before 08:15, not 09:00. The steps below already reflect the new cut-off: the old deadline no longer applies. | Screen - Wiki.dc.html:506 |
| 48 | Check the child is on your class register and that the message came from a listed guardian. If the absence runs longer than five school days, this is not the right page — use  | Check the child is on your class register and that the message came from a listed guardian. If the absence runs longer than five school days, this is not the right page. Use  | Screen - Wiki.dc.html:512 |
| 49 | Paste this into the private thread once the register is corrected. Keep the reference — it is what the family quotes back if the absence shows up on a statement later. | Paste this into the private thread once the register is corrected. Keep the reference. It is what the family quotes back if the absence shows up on a statement later. | Screen - Wiki.dc.html:552 |
| 50 | Hi — Amelia's absence for Wed 26 and Thu 27 August is recorded as illness with a doctor's note (code I2). The register is corrected and no catch-up meeting is needed. Reference RG-ATT-4417. Week 6 worksheets are on the class wiki. | Hi, Amelia's absence for Wed 26 and Thu 27 August is recorded as illness with a doctor's note (code I2). The register is corrected and no catch-up meeting is needed. Reference RG-ATT-4417. Week 6 worksheets are on the class wiki. | Screen - Wiki.dc.html:553 |
| 51 | VAT201 for August is due on the 25th. Supporting schedules must be in this channel by the 22nd — not emailed to anyone individually. | VAT201 for August is due on the 25th. Supporting schedules must be in this channel by the 22nd, not emailed to anyone individually. | screens/ACC - Chat.dc.html:751 |
| 52 | Good. And September is unaffected — I do not want one query delaying the next filing. | Good. And September is unaffected. I do not want one query delaying the next filing. | screens/ACC - Chat.dc.html:760 |
| 53 | @channel six stock count queries are still open from the June count. We cannot sign the audit with them outstanding — the list is on the wiki with what we need for each. | @channel six stock count queries are still open from the June count. We cannot sign the audit with them outstanding. The list is on the wiki with what we need for each. | screens/ACC - Chat.dc.html:878 |
| 54 | Request #714 raised from a message — SARS verification, 21 day deadline | Request #714 raised from a message: SARS verification, 21 day deadline | screens/ACC - Chat.dc.html:882 |
| 55 | Bank reconciliation is done to 31 July and posted. Two unidentified deposits from Harlow’s Durban account — flagged rather than guessed at, and the query is on the wiki. | Bank reconciliation is done to 31 July and posted. Two unidentified deposits from Harlow’s Durban account, flagged rather than guessed at, and the query is on the wiki. | screens/ACC - Chat.dc.html:884 |
| 56 | Year-end planning meeting — Thu 14:00 | Year-end planning meeting, Thu 14:00 | screens/ACC - Chat.dc.html:885 |
| 57 | Creditors recon uploaded here. Also — payroll shows a variance on four employees for August, probably the shift allowance change. Logged separately so it does not get lost behind the SARS query. | Creditors recon uploaded here. Also, payroll shows a variance on four employees for August, probably the shift allowance change. Logged separately so it does not get lost behind the SARS query. | screens/ACC - Chat.dc.html:886 |
| 58 | VAT201 due in 2 days — “August return, Harlow Foods” | VAT201 due in 2 days: “August return, Harlow Foods” | screens/ACC - Chat.dc.html:997, screens/ACC - Dashboard.dc.html:759, screens/ACC - Events.dc.html:1465, screens/ACC - Mobile.dc.html:692, screens/ACC - Requests.dc.html:879, screens/ACC - Wiki.dc.html:977 |
| 59 | VAT201 — August return, supporting schedules | VAT201: August return, supporting schedules | screens/ACC - Chat.dc.html:1197, screens/ACC - Dashboard.dc.html:867, screens/ACC - Events.dc.html:1013, screens/ACC - Mobile.dc.html:681, screens/ACC - Requests.dc.html:625, screens/ACC - Requests.dc.html:1035 |
| 60 | Stock count queries — 6 items unresolved | Stock count queries: 6 items unresolved | screens/ACC - Chat.dc.html:1198, screens/ACC - Dashboard.dc.html:868, screens/ACC - Events.dc.html:1015, screens/ACC - Mobile.dc.html:683, screens/ACC - Requests.dc.html:627, screens/ACC - Requests.dc.html:1036 |
| 61 | Payroll variance — 4 employees, August | Payroll variance: 4 employees, August | screens/ACC - Chat.dc.html:1200, screens/ACC - Dashboard.dc.html:870, screens/ACC - Mobile.dc.html:682, screens/ACC - Requests.dc.html:629, screens/ACC - Requests.dc.html:1038 |
| 62 | Audit planning — Harlow Foods | Audit planning: Harlow Foods | screens/ACC - Events.dc.html:978 |
| 63 | SARS verification request — 21 day deadline | SARS verification request: 21 day deadline | screens/ACC - Events.dc.html:1014, screens/ACC - Requests.dc.html:626 |
| 64 | SARS verification on the August refund — 21 days. Document list is up. | SARS verification on the August refund: 21 days. Document list is up. | screens/ACC - Mobile.dc.html:157 |
| 65 | Unidentified deposits — Durban account | Unidentified deposits: Durban account | screens/ACC - Requests.dc.html:633 |
| 66 | Debtors provision — aged over 120 days | Debtors provision: aged over 120 days | screens/ACC - Requests.dc.html:638 |
| 67 | From 1 September every document supporting a filing lives in the client channel, not in a mailbox. The steps below reflect that — if it is in someone’s inbox when a query lands, it does not exist. | From 1 September every document supporting a filing lives in the client channel, not in a mailbox. The steps below reflect that: if it is in someone’s inbox when a query lands, it does not exist. | screens/ACC - Wiki.dc.html:506 |
| 68 | Check what kind of letter it is and diarise the deadline the same day it arrives. If it is an assessment or an objection, this is not the right page — escalate to the tax specialist directly. Nothing is submitted to SARS without a partner reviewing it first. | Check what kind of letter it is and diarise the deadline the same day it arrives. If it is an assessment or an objection, this is not the right page. Escalate to the tax specialist directly. Nothing is submitted to SARS without a partner reviewing it first. | screens/ACC - Wiki.dc.html:512 |
| 69 | SARS has issued a verification on the August VAT refund — this is routine, not an audit. We need: tax invoices over R50 000 for August, the two cold-chain import documents, and the customs release notices. Please upload them in this channel by the 18th so we submit with a week in hand. Deadline is 9 September; we will post the submission reference here. | SARS has issued a verification on the August VAT refund. This is routine, not an audit. We need: tax invoices over R50 000 for August, the two cold-chain import documents, and the customs release notices. Please upload them in this channel by the 18th so we submit with a week in hand. Deadline is 9 September; we will post the submission reference here. | screens/ACC - Wiki.dc.html:553 |
| 70 | Priced the variation — sending through. | Priced the variation, sending through. | screens/Arch - Chat.dc.html:712, screens/Arch - Dashboard.dc.html:578, screens/Arch - Events.dc.html:901, screens/Arch - Requests.dc.html:585, screens/Arch - Wiki.dc.html:642 |
| 71 | Rev C set issued 12 Aug — supersedes Rev B for construction. Do not price off Rev B. | Rev C set issued 12 Aug, supersedes Rev B for construction. Do not price off Rev B. | screens/Arch - Chat.dc.html:751 |
| 72 | Morning — the balcony balustrade on the north units. Can the fixing move off the slab edge? The contractor says the edge detail is tight. | Morning. The balcony balustrade on the north units. Can the fixing move off the slab edge? The contractor says the edge detail is tight. | screens/Arch - Chat.dc.html:755, screens/Arch - Chat.dc.html:880 |
| 73 | @channel Rev C issued to the contractor and the QS. Drawing list, revision notes and the superseded schedule are all on the channel wiki — please work off Rev C only. | @channel Rev C issued to the contractor and the QS. Drawing list, revision notes and the superseded schedule are all on the channel wiki. Please work off Rev C only. | screens/Arch - Chat.dc.html:878 |
| 74 | RFI 214 created from a message — balustrade fixing at slab edge | RFI 214 created from a message: balustrade fixing at slab edge | screens/Arch - Chat.dc.html:882 |
| 75 | Design review with the client — Thu 14:00 | Design review with the client, Thu 14:00 | screens/Arch - Chat.dc.html:885 |
| 76 | RFI 214 due today — “Balustrade fixing at slab edge” | RFI 214 due today: “Balustrade fixing at slab edge” | screens/Arch - Chat.dc.html:997, screens/Arch - Dashboard.dc.html:759, screens/Arch - Events.dc.html:1466, screens/Arch - Mobile.dc.html:692, screens/Arch - Requests.dc.html:879, screens/Arch - Wiki.dc.html:977 |
| 77 | Variation 07 approved — glazing spec change | Variation 07 approved: glazing spec change | screens/Arch - Chat.dc.html:1000, screens/Arch - Dashboard.dc.html:762, screens/Arch - Events.dc.html:1469, screens/Arch - Mobile.dc.html:695, screens/Arch - Requests.dc.html:882, screens/Arch - Wiki.dc.html:980 |
| 78 | RFI 214 — balustrade fixing at slab edge | RFI 214: balustrade fixing at slab edge | screens/Arch - Chat.dc.html:1197, screens/Arch - Dashboard.dc.html:867, screens/Arch - Events.dc.html:1014, screens/Arch - Mobile.dc.html:681, screens/Arch - Requests.dc.html:625, screens/Arch - Requests.dc.html:1035 |
| 79 | Variation 07 — glazing spec change, pricing | Variation 07: glazing spec change, pricing | screens/Arch - Chat.dc.html:1198, screens/Arch - Dashboard.dc.html:868, screens/Arch - Events.dc.html:1016, screens/Arch - Mobile.dc.html:683, screens/Arch - Requests.dc.html:626, screens/Arch - Requests.dc.html:1036 |
| 80 | Client sign-off outstanding — Rev C set | Client sign-off outstanding: Rev C set | screens/Arch - Chat.dc.html:1199, screens/Arch - Dashboard.dc.html:869, screens/Arch - Events.dc.html:1017, screens/Arch - Requests.dc.html:627, screens/Arch - Requests.dc.html:1037 |
| 81 | Site instruction 09 — soffit clash at grid E | Site instruction 09: soffit clash at grid E | screens/Arch - Chat.dc.html:1200, screens/Arch - Dashboard.dc.html:870, screens/Arch - Events.dc.html:1015, screens/Arch - Mobile.dc.html:682, screens/Arch - Requests.dc.html:628, screens/Arch - Requests.dc.html:1038 |
| 82 | Council comment response — parking ratio | Council comment response: parking ratio | screens/Arch - Chat.dc.html:1201, screens/Arch - Dashboard.dc.html:871, screens/Arch - Events.dc.html:1018, screens/Arch - Requests.dc.html:629, screens/Arch - Requests.dc.html:1039 |
| 83 | Structural coordination — level 3 frame | Structural coordination: level 3 frame | screens/Arch - Events.dc.html:979 |
| 84 | Rev C is on the server — I’ll update RFI 214 with the marked-up section after. | Rev C is on the server. I’ll update RFI 214 with the marked-up section after. | screens/Arch - Mobile.dc.html:157 |
| 85 | Soffit clash at grid E — photos attached. Can the duct drop 80mm? | Soffit clash at grid E, photos attached. Can the duct drop 80mm? | screens/Arch - Mobile.dc.html:185 |
| 86 | RFI 213 — lift shaft tolerance at level 3 | RFI 213: lift shaft tolerance at level 3 | screens/Arch - Requests.dc.html:630 |
| 87 | Variation 06 — ironmongery substitution | Variation 06: ironmongery substitution | screens/Arch - Requests.dc.html:637 |
| 88 | From 1 September the contractor receives issues through the channel only, not by email. The steps below already reflect that — the old distribution list no longer applies. | From 1 September the contractor receives issues through the channel only, not by email. The steps below already reflect that: the old distribution list no longer applies. | screens/Arch - Wiki.dc.html:506 |
| 89 | Check the change is captured as an RFI, variation or site instruction and that it has an owner. If the drawing has not yet been issued for construction, this is not the right page — use  | Check the change is captured as an RFI, variation or site instruction and that it has an owner. If the drawing has not yet been issued for construction, this is not the right page. Use  | screens/Arch - Wiki.dc.html:512 |
| 90 | Paste this into the channel once the set is issued. Keep the transmittal number — it is what the contractor quotes back if someone prices off a superseded sheet. | Paste this into the channel once the set is issued. Keep the transmittal number. It is what the contractor quotes back if someone prices off a superseded sheet. | screens/Arch - Wiki.dc.html:552 |
| 91 | Rev C issued today, transmittal SB-TX-0143. Sheets A-210, A-512 and the window schedule are superseded — Rev B is for record only. RFI 214 is answered on detail 4/A-512. Price Variation 07 off Rev C. | Rev C issued today, transmittal SB-TX-0143. Sheets A-210, A-512 and the window schedule are superseded. Rev B is for record only. RFI 214 is answered on detail 4/A-512. Price Variation 07 off Rev C. | screens/Arch - Wiki.dc.html:553 |
| 92 | No patient identifiers in this channel. Use the file number only — clinical detail belongs in the record, not in chat. | No patient identifiers in this channel. Use the file number only. Clinical detail belongs in the record, not in chat. | screens/CLN - Chat.dc.html:751 |
| 93 | Looking now. 22841 is the potassium — that one I need to act on this morning, and I would rather not have found out at nine. | Looking now. 22841 is the potassium. That one I need to act on this morning, and I would rather not have found out at nine. | screens/CLN - Chat.dc.html:758 |
| 94 | @channel vaccine fridge logged at 4.1°C this morning and again at close. Reminder that the log is a channel task now — if it is not ticked here, it did not happen as far as an inspection is concerned. | @channel vaccine fridge logged at 4.1°C this morning and again at close. Reminder that the log is a channel task now. If it is not ticked here, it did not happen as far as an inspection is concerned. | screens/CLN - Chat.dc.html:878 |
| 95 | Request #512 raised from a message — urgent result unactioned, file 22841 | Request #512 raised from a message: urgent result unactioned, file 22841 | screens/CLN - Chat.dc.html:882 |
| 96 | Fourteen repeat script requests came in overnight. Working through them now — flagging that four are for patients who have not been seen in over six months. | Fourteen repeat script requests came in overnight. Working through them now, flagging that four are for patients who have not been seen in over six months. | screens/CLN - Chat.dc.html:884 |
| 97 | Practice meeting — Thu 13:00 | Practice meeting, Thu 13:00 | screens/CLN - Chat.dc.html:885 |
| 98 | Locum here — I am in on Tuesday. Can someone set up my access before then? Last time I spent the first hour of a full list waiting for a login. | Locum here. I am in on Tuesday. Can someone set up my access before then? Last time I spent the first hour of a full list waiting for a login. | screens/CLN - Chat.dc.html:886 |
| 99 | Urgent result unactioned 2h — “Abnormal potassium, ward round list” | Urgent result unactioned 2h: “Abnormal potassium, ward round list” | screens/CLN - Chat.dc.html:997, screens/CLN - Dashboard.dc.html:759, screens/CLN - Events.dc.html:1465, screens/CLN - Mobile.dc.html:688, screens/CLN - Requests.dc.html:879, screens/CLN - Wiki.dc.html:977 |
| 100 | Cold chain log completed — vaccine fridge 4.1°C | Cold chain log completed: vaccine fridge 4.1°C | screens/CLN - Chat.dc.html:1000, screens/CLN - Dashboard.dc.html:762, screens/CLN - Events.dc.html:1468, screens/CLN - Mobile.dc.html:691, screens/CLN - Requests.dc.html:882, screens/CLN - Wiki.dc.html:980 |
| 101 | Urgent result unactioned — abnormal potassium | Urgent result unactioned: abnormal potassium | screens/CLN - Chat.dc.html:1197, screens/CLN - Dashboard.dc.html:867, screens/CLN - Mobile.dc.html:677, screens/CLN - Requests.dc.html:1035 |
| 102 | Locum access for Tuesday — Dr Meyer | Locum access for Tuesday, Dr Meyer | screens/CLN - Chat.dc.html:1198, screens/CLN - Dashboard.dc.html:868, screens/CLN - Events.dc.html:1015, screens/CLN - Mobile.dc.html:679, screens/CLN - Requests.dc.html:626, screens/CLN - Requests.dc.html:1036 |
| 103 | Medical aid rejection — code 3014, 8 claims | Medical aid rejection: code 3014, 8 claims | screens/CLN - Chat.dc.html:1199, screens/CLN - Dashboard.dc.html:869, screens/CLN - Events.dc.html:1016, screens/CLN - Requests.dc.html:627, screens/CLN - Requests.dc.html:1037 |
| 104 | Referral not acknowledged — 5 days | Referral not acknowledged: 5 days | screens/CLN - Chat.dc.html:1200, screens/CLN - Dashboard.dc.html:870, screens/CLN - Events.dc.html:1014, screens/CLN - Mobile.dc.html:678, screens/CLN - Requests.dc.html:628, screens/CLN - Requests.dc.html:1038 |
| 105 | Locum induction — Dr Meyer | Locum induction: Dr Meyer | screens/CLN - Events.dc.html:986 |
| 106 | Urgent result unactioned — file 22841 | Urgent result unactioned: file 22841 | screens/CLN - Events.dc.html:1013, screens/CLN - Requests.dc.html:625 |
| 107 | Urgent on file 22841 — needs action today. Flagging here, result is in the portal. | Urgent on file 22841, needs action today. Flagging here, result is in the portal. | screens/CLN - Mobile.dc.html:155 |
| 108 | Specimen rejected — insufficient sample | Specimen rejected: insufficient sample | screens/CLN - Requests.dc.html:631 |
| 109 | Room 3 running late — patient comms | Room 3 running late: patient comms | screens/CLN - Requests.dc.html:632 |
| 110 | Patient complaint — waiting time | Patient complaint: waiting time | screens/CLN - Requests.dc.html:636 |
| 111 | From 1 September urgent results are flagged in the clinical channel by file number, not left in the shared inbox. The steps below reflect that — an unacknowledged urgent escalates after one hour. | From 1 September urgent results are flagged in the clinical channel by file number, not left in the shared inbox. The steps below reflect that: an unacknowledged urgent escalates after one hour. | screens/CLN - Wiki.dc.html:506 |
| 112 | Never put clinical detail or a patient name in the channel — the file number is the identifier, and the result stays in the record. If the patient is in the building and unwell, this is not the right page — use the emergency procedure and call the doctor in the room. | Never put clinical detail or a patient name in the channel. The file number is the identifier, and the result stays in the record. If the patient is in the building and unwell, this is not the right page. Use the emergency procedure and call the doctor in the room. | screens/CLN - Wiki.dc.html:512 |
| 113 | This is the whole message. File number, priority and who is being asked to act — nothing clinical, nothing identifying, and no assumption that somebody will open the portal unprompted. | This is the whole message. File number, priority and who is being asked to act, nothing clinical, nothing identifying, and no assumption that somebody will open the portal unprompted. | screens/CLN - Wiki.dc.html:552 |
| 114 | URGENT result in the portal for file 22841, received 16:42. Action needed today. Dr Steyn is on this list — please acknowledge here within the hour or it escalates to the practice manager. No clinical detail in this channel. | URGENT result in the portal for file 22841, received 16:42. Action needed today. Dr Steyn is on this list. Please acknowledge here within the hour or it escalates to the practice manager. No clinical detail in this channel. | screens/CLN - Wiki.dc.html:553 |
| 115 | The file number — never the patient’s name in the channel | The file number (never the patient’s name in the channel) | screens/CLN - Wiki.dc.html:842 |
| 116 | Variation 12 priced — sending through. | Variation 12 priced, sending through. | screens/Con - Chat.dc.html:712, screens/Con - Dashboard.dc.html:578, screens/Con - Events.dc.html:901, screens/Con - Requests.dc.html:585, screens/Con - Wiki.dc.html:642 |
| 117 | Variation 12 created from a message — rock excavation at grid C | Variation 12 created from a message: rock excavation at grid C | screens/Con - Chat.dc.html:882 |
| 118 | Near miss on level 2 — a panel was lifted with the barrier still open. No injury. Logged as NM-15 with photos so it is closed out properly, not just mentioned at the talk. | Near miss on level 2: a panel was lifted with the barrier still open. No injury. Logged as NM-15 with photos so it is closed out properly, not just mentioned at the talk. | screens/Con - Chat.dc.html:884 |
| 119 | Site meeting with the client — Thu 07:00 | Site meeting with the client, Thu 07:00 | screens/Con - Chat.dc.html:885 |
| 120 | Due today — “Concrete cube results, grid C pour” | Due today: “Concrete cube results, grid C pour” | screens/Con - Chat.dc.html:997, screens/Con - Dashboard.dc.html:759, screens/Con - Events.dc.html:1465, screens/Con - Mobile.dc.html:692, screens/Con - Requests.dc.html:879, screens/Con - Wiki.dc.html:977 |
| 121 | Near miss NM-14 closed out — edge protection | Near miss NM-14 closed out: edge protection | screens/Con - Chat.dc.html:1000, screens/Con - Dashboard.dc.html:762, screens/Con - Events.dc.html:1468, screens/Con - Mobile.dc.html:695, screens/Con - Requests.dc.html:882, screens/Con - Wiki.dc.html:980 |
| 122 | Concrete cube results outstanding — grid C | Concrete cube results outstanding: grid C | screens/Con - Chat.dc.html:1197, screens/Con - Dashboard.dc.html:867, screens/Con - Events.dc.html:1015, screens/Con - Mobile.dc.html:681, screens/Con - Requests.dc.html:626, screens/Con - Requests.dc.html:1035 |
| 123 | Variation 12 — rock excavation, pricing | Variation 12: rock excavation, pricing | screens/Con - Chat.dc.html:1198, screens/Con - Dashboard.dc.html:868, screens/Con - Mobile.dc.html:683, screens/Con - Requests.dc.html:1036 |
| 124 | Near miss NM-15 — unguarded edge, level 2 | Near miss NM-15: unguarded edge, level 2 | screens/Con - Chat.dc.html:1200, screens/Con - Dashboard.dc.html:870, screens/Con - Events.dc.html:1014, screens/Con - Mobile.dc.html:682, screens/Con - Requests.dc.html:628, screens/Con - Requests.dc.html:1038 |
| 125 | Snag list unit 6 — 14 items outstanding | Snag list unit 6: 14 items outstanding | screens/Con - Chat.dc.html:1201, screens/Con - Dashboard.dc.html:871, screens/Con - Events.dc.html:1017, screens/Con - Requests.dc.html:629, screens/Con - Requests.dc.html:1039 |
| 126 | Toolbox talk — edge protection | Toolbox talk: edge protection | screens/Con - Events.dc.html:977 |
| 127 | Toolbox talk — lifting operations | Toolbox talk: lifting operations | screens/Con - Events.dc.html:983 |
| 128 | Toolbox talk — working at height | Toolbox talk: working at height | screens/Con - Events.dc.html:987 |
| 129 | Programme review — critical path | Programme review: critical path | screens/Con - Events.dc.html:993 |
| 130 | Variation 12 — rock excavation at grid C | Variation 12: rock excavation at grid C | screens/Con - Events.dc.html:1013, screens/Con - Requests.dc.html:625 |
| 131 | Rock at grid C is deeper than the geotech — I’ll raise the variation before the shift ends. | Rock at grid C is deeper than the geotech. I’ll raise the variation before the shift ends. | screens/Con - Mobile.dc.html:157 |
| 132 | Standing time — plumbers waiting on slab | Standing time: plumbers waiting on slab | screens/Con - Requests.dc.html:632 |
| 133 | Variation 11 — additional dewatering | Variation 11: additional dewatering | screens/Con - Requests.dc.html:637 |
| 134 | From 1 September every variation must carry dayworks sheets and photographs before it is submitted. The steps below reflect that — a bare description will be rejected at valuation. | From 1 September every variation must carry dayworks sheets and photographs before it is submitted. The steps below reflect that: a bare description will be rejected at valuation. | screens/Con - Wiki.dc.html:506 |
| 135 | Check the work is genuinely outside the contract and that the instruction came from someone entitled to give it. If the work is your own rework, this is not the right page — use  | Check the work is genuinely outside the contract and that the instruction came from someone entitled to give it. If the work is your own rework, this is not the right page. Use  | screens/Con - Wiki.dc.html:512 |
| 136 | Post this in the client channel the same day. Keep the reference — it is what the QS quotes at valuation and what an adjudicator reads if it goes that far. | Post this in the client channel the same day. Keep the reference. It is what the QS quotes at valuation and what an adjudicator reads if it goes that far. | screens/Con - Wiki.dc.html:552 |
| 137 | The instruction — who told you to do it, and when | The instruction: who told you to do it, and when | screens/Con - Wiki.dc.html:842 |
| 138 | Labour hours, plant hours, materials. The QS prices off these sheets — a description without them gets struck out at valuation. | Labour hours, plant hours, materials. The QS prices off these sheets. A description without them gets struck out at valuation. | screens/Con - Wiki.dc.html:849 |
| 139 | Rebar is fixed for slab 4C and we are booked to pour Thursday 05:30. Spacing at the eastern edge looks wider than the bending schedule — photos attached. Can you confirm or do we stop? | Rebar is fixed for slab 4C and we are booked to pour Thursday 05:30. Spacing at the eastern edge looks wider than the bending schedule, photos attached. Can you confirm or do we stop? | screens/ENG - Chat.dc.html:755, screens/ENG - Chat.dc.html:880 |
| 140 | Measuring off your photographs it is about 180mm against 150mm specified. That is outside tolerance — do not pour on it. | Measuring off your photographs it is about 180mm against 150mm specified. That is outside tolerance. Do not pour on it. | screens/ENG - Chat.dc.html:757 |
| 141 | @channel 28-day cube results for the level 2 pour are in and they are 3MPa under spec. Flagging now rather than at the end of the week — testing report attached to INS-091. | @channel 28-day cube results for the level 2 pour are in and they are 3MPa under spec. Flagging now rather than at the end of the week, testing report attached to INS-091. | screens/ENG - Chat.dc.html:878 |
| 142 | Request #614 raised from a message — slab 4C rebar spacing, pour on hold | Request #614 raised from a message: slab 4C rebar spacing, pour on hold | screens/ENG - Chat.dc.html:882 |
| 143 | Re-inspection, slab 4C — Wed 07:00 | Re-inspection, slab 4C, Wed 07:00 | screens/ENG - Chat.dc.html:885 |
| 144 | Hold on pour — “Slab 4C, rebar spacing query” due in 3h | Hold on pour: “Slab 4C, rebar spacing query” due in 3h | screens/ENG - Chat.dc.html:997, screens/ENG - Dashboard.dc.html:759, screens/ENG - Events.dc.html:1465, screens/ENG - Mobile.dc.html:692, screens/ENG - Requests.dc.html:879, screens/ENG - Wiki.dc.html:977 |
| 145 | Inspection INS-091 signed off — level 2 slab | Inspection INS-091 signed off: level 2 slab | screens/ENG - Chat.dc.html:1000, screens/ENG - Dashboard.dc.html:762, screens/ENG - Events.dc.html:1468, screens/ENG - Mobile.dc.html:695, screens/ENG - Requests.dc.html:882, screens/ENG - Wiki.dc.html:980 |
| 146 | Slab 4C — rebar spacing query, pour on hold | Slab 4C: rebar spacing query, pour on hold | screens/ENG - Chat.dc.html:1197, screens/ENG - Dashboard.dc.html:867, screens/ENG - Events.dc.html:1013, screens/ENG - Mobile.dc.html:681, screens/ENG - Requests.dc.html:625, screens/ENG - Requests.dc.html:1035 |
| 147 | Fire water pressure test — witness required | Fire water pressure test: witness required | screens/ENG - Chat.dc.html:1199, screens/ENG - Dashboard.dc.html:869, screens/ENG - Events.dc.html:1016, screens/ENG - Requests.dc.html:628, screens/ENG - Requests.dc.html:1037 |
| 148 | Inspection INS-091 — level 2 slab sign-off | Inspection INS-091: level 2 slab sign-off | screens/ENG - Chat.dc.html:1201, screens/ENG - Dashboard.dc.html:871, screens/ENG - Events.dc.html:1017, screens/ENG - Requests.dc.html:629, screens/ENG - Requests.dc.html:1039 |
| 149 | Design coordination — level 3 frame | Design coordination: level 3 frame | screens/ENG - Events.dc.html:978 |
| 150 | Inspection — level 2 slab | Inspection: level 2 slab | screens/ENG - Events.dc.html:979 |
| 151 | Re-inspection — slab 4C rebar | Re-inspection: slab 4C rebar | screens/ENG - Events.dc.html:987, screens/ENG - Mobile.dc.html:688 |
| 152 | Client & approvals — certificate status | Client & approvals: certificate status | screens/ENG - Events.dc.html:988 |
| 153 | Measured off your photos — spacing is 180mm against 150mm. Do not pour. | Measured off your photos: spacing is 180mm against 150mm. Do not pour. | screens/ENG - Mobile.dc.html:157 |
| 154 | Design change — column relocation at grid F | Design change: column relocation at grid F | screens/ENG - Requests.dc.html:630 |
| 155 | From 1 September every sign-off is recorded in the project channel against the inspection number. The steps below reflect that — a verbal approval on site carries no weight and protects nobody. | From 1 September every sign-off is recorded in the project channel against the inspection number. The steps below reflect that: a verbal approval on site carries no weight and protects nobody. | screens/ENG - Wiki.dc.html:506 |
| 156 | How an inspection is booked, witnessed, recorded and signed — and what to do when the work is not acceptable. Written for candidate engineers and technologists; a professional signs the certificate, but anyone can run the process. | How an inspection is booked, witnessed, recorded and signed, and what to do when the work is not acceptable. Written for candidate engineers and technologists; a professional signs the certificate, but anyone can run the process. | screens/ENG - Wiki.dc.html:509 |
| 157 | Check the inspection was booked against a hold point and that the contractor has given notice. If work has already been covered up, this is not the right page — use  | Check the inspection was booked against a hold point and that the contractor has given notice. If work has already been covered up, this is not the right page. Use  | screens/ENG - Wiki.dc.html:512 |
| 158 | Not a general view of the slab — the tape against the bar. In two years the photograph is the only thing that answers the question. | Not a general view of the slab, the tape against the bar. In two years the photograph is the only thing that answers the question. | screens/ENG - Wiki.dc.html:848 |
| 159 | P1 comms drafted — check before I send. | P1 comms drafted. Check before I send. | screens/ITSP - Chat.dc.html:713, screens/ITSP - Dashboard.dc.html:579, screens/ITSP - Events.dc.html:902, screens/ITSP - Requests.dc.html:586, screens/ITSP - Wiki.dc.html:643 |
| 160 | Projects — M365 migration | Projects: M365 migration | screens/ITSP - Chat.dc.html:724, screens/ITSP - Chat.dc.html:1201, screens/ITSP - Dashboard.dc.html:590, screens/ITSP - Dashboard.dc.html:871, screens/ITSP - Events.dc.html:668, screens/ITSP - Events.dc.html:913, screens/ITSP - Events.dc.html:957, screens/ITSP - Events.dc.html:979, screens/ITSP - Events.dc.html:991, screens/ITSP - Events.dc.html:1017, screens/ITSP - Mobile.dc.html:385, screens/ITSP - Requests.dc.html:597, screens/ITSP - Requests.dc.html:629, screens/ITSP - Requests.dc.html:638, screens/ITSP - Requests.dc.html:644, screens/ITSP - Requests.dc.html:1039, screens/ITSP - Wiki.dc.html:654, screens/ITSP - Wiki.dc.html:698 |
| 161 | Hybrid connector is throttling on one transport server. Mail is queued, not lost — nothing has bounced. | Hybrid connector is throttling on one transport server. Mail is queued, not lost. Nothing has bounced. | screens/ITSP - Chat.dc.html:757 |
| 162 | @channel MFA enforcement goes live Monday 06:00. Fourteen users still have not enrolled — the list is on the wiki and they will be locked out, not warned again. | @channel MFA enforcement goes live Monday 06:00. Fourteen users still have not enrolled. The list is on the wiki and they will be locked out, not warned again. | screens/ITSP - Chat.dc.html:878 |
| 163 | INC-4412 raised from a message — P1, mail flow degraded | INC-4412 raised from a message: P1, mail flow degraded | screens/ITSP - Chat.dc.html:882 |
| 164 | Rossgrove sees the same clock we do on this one. If we are going to breach, they hear it from us first — not from a partner standing in a corridor. | Rossgrove sees the same clock we do on this one. If we are going to breach, they hear it from us first, not from a partner standing in a corridor. | screens/ITSP - Chat.dc.html:883 |
| 165 | Monthly service review — Thu 14:00 | Monthly service review, Thu 14:00 | screens/ITSP - Chat.dc.html:885 |
| 166 | While you are in here — new paralegal starts Monday. Laptop, mailbox and practice-management access, logged as a request so it does not get lost behind the incident. | While you are in here, new paralegal starts Monday. Laptop, mailbox and practice-management access, logged as a request so it does not get lost behind the incident. | screens/ITSP - Chat.dc.html:886 |
| 167 | P1 breach in 38m — “Mail flow degraded, Exchange hybrid” | P1 breach in 38m: “Mail flow degraded, Exchange hybrid” | screens/ITSP - Chat.dc.html:997, screens/ITSP - Dashboard.dc.html:759, screens/ITSP - Events.dc.html:1465, screens/ITSP - Mobile.dc.html:692, screens/ITSP - Requests.dc.html:879, screens/ITSP - Wiki.dc.html:977 |
| 168 | Change CHG-238 completed — firewall firmware | Change CHG-238 completed: firewall firmware | screens/ITSP - Chat.dc.html:1000, screens/ITSP - Dashboard.dc.html:762, screens/ITSP - Events.dc.html:1468, screens/ITSP - Mobile.dc.html:695, screens/ITSP - Requests.dc.html:882, screens/ITSP - Wiki.dc.html:980 |
| 169 | P1 — mail flow degraded, Exchange hybrid | P1: mail flow degraded, Exchange hybrid | screens/ITSP - Chat.dc.html:1197, screens/ITSP - Dashboard.dc.html:867, screens/ITSP - Events.dc.html:1013, screens/ITSP - Mobile.dc.html:681, screens/ITSP - Requests.dc.html:625, screens/ITSP - Requests.dc.html:1035 |
| 170 | Onboard new paralegal — laptop and licences | Onboard new paralegal: laptop and licences | screens/ITSP - Chat.dc.html:1198, screens/ITSP - Dashboard.dc.html:868, screens/ITSP - Events.dc.html:1015, screens/ITSP - Mobile.dc.html:683, screens/ITSP - Requests.dc.html:626, screens/ITSP - Requests.dc.html:1036 |
| 171 | MFA rollout — 14 users outstanding | MFA rollout: 14 users outstanding | screens/ITSP - Chat.dc.html:1199, screens/ITSP - Dashboard.dc.html:869, screens/ITSP - Events.dc.html:1016, screens/ITSP - Requests.dc.html:627, screens/ITSP - Requests.dc.html:1037 |
| 172 | M365 migration — pilot group cutover | M365 migration: pilot group cutover | screens/ITSP - Chat.dc.html:1201, screens/ITSP - Dashboard.dc.html:871, screens/ITSP - Events.dc.html:1017, screens/ITSP - Requests.dc.html:629, screens/ITSP - Requests.dc.html:1039 |
| 173 | Monthly service review — Rossgrove | Monthly service review: Rossgrove | screens/ITSP - Events.dc.html:978, screens/ITSP - Events.dc.html:989 |
| 174 | Change window — firewall firmware | Change window: firewall firmware | screens/ITSP - Events.dc.html:980 |
| 175 | RCA walkthrough — INC-4380 | RCA walkthrough: INC-4380 | screens/ITSP - Events.dc.html:981 |
| 176 | P1 incident bridge — mail flow | P1 incident bridge: mail flow | screens/ITSP - Events.dc.html:988 |
| 177 | Onboarding prep — new paralegal | Onboarding prep: new paralegal | screens/ITSP - Events.dc.html:990 |
| 178 | Failover is running now — I’ll post the next update on INC-4412 at 09:56. | Failover is running now. I’ll post the next update on INC-4412 at 09:56. | screens/ITSP - Mobile.dc.html:157 |
| 179 | Offboard departing associate — revoke access | Offboard departing associate: revoke access | screens/ITSP - Requests.dc.html:635 |
| 180 | RCA for INC-4380 — storage latency | RCA for INC-4380: storage latency | screens/ITSP - Requests.dc.html:637 |
| 181 | From 1 September the client sees the incident channel live, including the SLA clock. The steps below reflect that — there is no longer a private version of the timeline. | From 1 September the client sees the incident channel live, including the SLA clock. The steps below reflect that: there is no longer a private version of the timeline. | screens/ITSP - Wiki.dc.html:506 |
| 182 | Confirm it is genuinely a P1: business-wide, or a whole site, or money or court deadlines at stake. If one user cannot print, this is not the right page — use  | Confirm it is genuinely a P1: business-wide, or a whole site, or money or court deadlines at stake. If one user cannot print, this is not the right page. Use  | screens/ITSP - Wiki.dc.html:512 |
| 183 | Post this in the client channel within fifteen minutes of declaring. Plain language, no jargon — the practice manager forwards it to people who do not care what a transport server is. | Post this in the client channel within fifteen minutes of declaring. Plain language, no jargon. The practice manager forwards it to people who do not care what a transport server is. | screens/ITSP - Wiki.dc.html:552 |
| 184 | P1 declared 09:26, ref INC-4412. Mail is delayed, not lost — messages are queued and nothing has bounced. Cause identified: one mail server throttling. We are failing over now and expect the queue to clear within 15 minutes. Next update 09:56 or sooner if it resolves. | P1 declared 09:26, ref INC-4412. Mail is delayed, not lost. Messages are queued and nothing has bounced. Cause identified: one mail server throttling. We are failing over now and expect the queue to clear within 15 minutes. Next update 09:56 or sooner if it resolves. | screens/ITSP - Wiki.dc.html:553 |
| 185 | An incident lead and a scribe — two people, two jobs | An incident lead and a scribe: two people, two jobs | screens/ITSP - Wiki.dc.html:843 |
| 186 | Resolution is not the end. The RCA is a request with an owner and a due date, and the client sees it — that is what renews the contract. | Resolution is not the end. The RCA is a request with an owner and a due date, and the client sees it. That is what renews the contract. | screens/ITSP - Wiki.dc.html:850 |
| 187 | Matter — Kingsway acquisition | Matter: Kingsway acquisition | screens/LAW - Chat.dc.html:434, screens/LAW - Chat.dc.html:722, screens/LAW - Chat.dc.html:1198, screens/LAW - Chat.dc.html:1199, screens/LAW - Chat.dc.html:1201, screens/LAW - Dashboard.dc.html:588, screens/LAW - Dashboard.dc.html:868, screens/LAW - Dashboard.dc.html:869, screens/LAW - Dashboard.dc.html:871, screens/LAW - Events.dc.html:668, screens/LAW - Events.dc.html:911, screens/LAW - Events.dc.html:955, screens/LAW - Events.dc.html:978, screens/LAW - Events.dc.html:979, screens/LAW - Events.dc.html:982, screens/LAW - Events.dc.html:987, screens/LAW - Events.dc.html:988, screens/LAW - Events.dc.html:992, screens/LAW - Events.dc.html:993, screens/LAW - Events.dc.html:995, screens/LAW - Events.dc.html:1015, screens/LAW - Events.dc.html:1016, screens/LAW - Events.dc.html:1017, screens/LAW - Mobile.dc.html:378, screens/LAW - Mobile.dc.html:678, screens/LAW - Requests.dc.html:595, screens/LAW - Requests.dc.html:626, screens/LAW - Requests.dc.html:627, screens/LAW - Requests.dc.html:629, screens/LAW - Requests.dc.html:634, screens/LAW - Requests.dc.html:636, screens/LAW - Requests.dc.html:644, screens/LAW - Requests.dc.html:1036, screens/LAW - Requests.dc.html:1037, screens/LAW - Requests.dc.html:1039, screens/LAW - Wiki.dc.html:652, screens/LAW - Wiki.dc.html:696 |
| 188 | Litigation — supplier dispute | Litigation: supplier dispute | screens/LAW - Chat.dc.html:723, screens/LAW - Chat.dc.html:1197, screens/LAW - Dashboard.dc.html:589, screens/LAW - Dashboard.dc.html:867, screens/LAW - Events.dc.html:668, screens/LAW - Events.dc.html:912, screens/LAW - Events.dc.html:956, screens/LAW - Events.dc.html:980, screens/LAW - Events.dc.html:981, screens/LAW - Events.dc.html:986, screens/LAW - Events.dc.html:989, screens/LAW - Events.dc.html:990, screens/LAW - Events.dc.html:1013, screens/LAW - Mobile.dc.html:379, screens/LAW - Mobile.dc.html:676, screens/LAW - Requests.dc.html:596, screens/LAW - Requests.dc.html:625, screens/LAW - Requests.dc.html:632, screens/LAW - Requests.dc.html:633, screens/LAW - Requests.dc.html:638, screens/LAW - Requests.dc.html:644, screens/LAW - Requests.dc.html:1035, screens/LAW - Wiki.dc.html:653, screens/LAW - Wiki.dc.html:697 |
| 189 | We asked for twenty-four in the second mark-up and they refused. Worth another attempt, but it will cost something elsewhere — probably the retention amount. | We asked for twenty-four in the second mark-up and they refused. Worth another attempt, but it will cost something elsewhere, probably the retention amount. | screens/LAW - Chat.dc.html:757 |
| 190 | @channel discovery affidavit in the supplier dispute is due Thursday. Fourteen documents still to be reviewed for privilege — the list is on the wiki with who is reviewing what. | @channel discovery affidavit in the supplier dispute is due Thursday. Fourteen documents still to be reviewed for privilege. The list is on the wiki with who is reviewing what. | screens/LAW - Chat.dc.html:878 |
| 191 | Request #809 updated — warranty schedule, client mandate recorded | Request #809 updated: warranty schedule, client mandate recorded | screens/LAW - Chat.dc.html:882 |
| 192 | Signature meeting — Fri 11:00 | Signature meeting, Fri 11:00 | screens/LAW - Chat.dc.html:885 |
| 193 | Court deadline Thursday — “Discovery affidavit, supplier dispute” | Court deadline Thursday: “Discovery affidavit, supplier dispute” | screens/LAW - Chat.dc.html:997, screens/LAW - Dashboard.dc.html:759, screens/LAW - Events.dc.html:1465, screens/LAW - Mobile.dc.html:687, screens/LAW - Requests.dc.html:879, screens/LAW - Wiki.dc.html:977 |
| 194 | Discovery affidavit — court deadline Thursday | Discovery affidavit: court deadline Thursday | screens/LAW - Chat.dc.html:1197, screens/LAW - Dashboard.dc.html:867, screens/LAW - Events.dc.html:1013, screens/LAW - Mobile.dc.html:676, screens/LAW - Requests.dc.html:625, screens/LAW - Requests.dc.html:1035 |
| 195 | Warranty schedule — client review outstanding | Warranty schedule: client review outstanding | screens/LAW - Chat.dc.html:1198, screens/LAW - Dashboard.dc.html:868, screens/LAW - Events.dc.html:1015, screens/LAW - Mobile.dc.html:678, screens/LAW - Requests.dc.html:626, screens/LAW - Requests.dc.html:1036 |
| 196 | Restraint clause query — departing director | Restraint clause query: departing director | screens/LAW - Chat.dc.html:1200, screens/LAW - Dashboard.dc.html:870, screens/LAW - Events.dc.html:1014, screens/LAW - Mobile.dc.html:677, screens/LAW - Requests.dc.html:628, screens/LAW - Requests.dc.html:1038 |
| 197 | Due diligence — 14 items outstanding | Due diligence: 14 items outstanding | screens/LAW - Chat.dc.html:1201, screens/LAW - Dashboard.dc.html:871, screens/LAW - Events.dc.html:1017, screens/LAW - Requests.dc.html:629, screens/LAW - Requests.dc.html:1039 |
| 198 | Signature meeting — Kingsway | Signature meeting: Kingsway | screens/LAW - Events.dc.html:992 |
| 199 | Privilege review — 14 documents | Privilege review: 14 documents | screens/LAW - Requests.dc.html:632 |
| 200 | Conflict check — new counterparty | Conflict check: new counterparty | screens/LAW - Requests.dc.html:639 |
| 201 | From 1 September every instruction is confirmed in the matter channel before it is acted on. The steps below reflect that — a telephone mandate nobody wrote down is not a mandate. | From 1 September every instruction is confirmed in the matter channel before it is acted on. The steps below reflect that: a telephone mandate nobody wrote down is not a mandate. | screens/LAW - Wiki.dc.html:506 |
| 202 | Check the person giving the instruction is authorised to give it. If it comes from someone outside the mandate list, this is not the right page — use  | Check the person giving the instruction is authorised to give it. If it comes from someone outside the mandate list, this is not the right page. Use  | screens/LAW - Wiki.dc.html:512 |
| 203 | Post this in the matter channel before you act. It is short on purpose — a client who reads a paragraph will correct a misunderstanding; one who receives a memorandum will not read it at all. | Post this in the matter channel before you act. It is short on purpose: a client who reads a paragraph will correct a misunderstanding; one who receives a memorandum will not read it at all. | screens/LAW - Wiki.dc.html:552 |
| 204 | The mandate list — who at the client may instruct on this matter | The mandate list: who at the client may instruct on this matter | screens/LAW - Wiki.dc.html:842 |
| 205 | Reefer alarm on CH-4471 outside Colesberg — unit reading −12°C against a −18°C spec. Driver says it has been climbing for about forty minutes. | Reefer alarm on CH-4471 outside Colesberg: unit reading −12°C against a −18°C spec. Driver says it has been climbing for about forty minutes. | screens/LOG - Chat.dc.html:755, screens/LOG - Chat.dc.html:880 |
| 206 | Exception #4471 raised from a message — reefer temperature excursion | Exception #4471 raised from a message: reefer temperature excursion | screens/LOG - Chat.dc.html:882 |
| 207 | From receiving: CH-4468 was signed short by two pallets on Friday. Photographs of the seal and the tally sheet are attached — raising it now rather than at month-end reconciliation. | From receiving: CH-4468 was signed short by two pallets on Friday. Photographs of the seal and the tally sheet are attached, raising it now rather than at month-end reconciliation. | screens/LOG - Chat.dc.html:884 |
| 208 | Weekly planning call — Thu 15:00 | Weekly planning call, Thu 15:00 | screens/LOG - Chat.dc.html:885 |
| 209 | Will CH-4471 still make the 14:00 slot? If not, say so now — the depot books a replacement window at eleven and after that we are into tomorrow. | Will CH-4471 still make the 14:00 slot? If not, say so now. The depot books a replacement window at eleven and after that we are into tomorrow. | screens/LOG - Chat.dc.html:886 |
| 210 | Cold chain alert — “CH-4471 reefer at −12°C, spec −18°C” | Cold chain alert: “CH-4471 reefer at −12°C, spec −18°C” | screens/LOG - Chat.dc.html:997, screens/LOG - Dashboard.dc.html:759, screens/LOG - Events.dc.html:1465, screens/LOG - Mobile.dc.html:692, screens/LOG - Requests.dc.html:879, screens/LOG - Wiki.dc.html:977 |
| 211 | POD uploaded and matched — CH-4465 | POD uploaded and matched: CH-4465 | screens/LOG - Chat.dc.html:1000, screens/LOG - Dashboard.dc.html:762, screens/LOG - Events.dc.html:1468, screens/LOG - Mobile.dc.html:695, screens/LOG - Requests.dc.html:882, screens/LOG - Wiki.dc.html:980 |
| 212 | Short delivery — 2 pallets, CH-4468 | Short delivery: 2 pallets, CH-4468 | screens/LOG - Chat.dc.html:1198, screens/LOG - Dashboard.dc.html:868, screens/LOG - Events.dc.html:1015, screens/LOG - Mobile.dc.html:683, screens/LOG - Requests.dc.html:626, screens/LOG - Requests.dc.html:1036 |
| 213 | Missing POD — CH-4462, 6 days | Missing POD: CH-4462, 6 days | screens/LOG - Chat.dc.html:1199, screens/LOG - Dashboard.dc.html:869, screens/LOG - Events.dc.html:1016, screens/LOG - Requests.dc.html:627, screens/LOG - Requests.dc.html:1037 |
| 214 | POD chase — week 34 | POD chase: week 34 | screens/LOG - Events.dc.html:986 |
| 215 | Cold chain exception bridge — CH-4471 | Cold chain exception bridge: CH-4471 | screens/LOG - Events.dc.html:987 |
| 216 | Reefer on CH-4471 reading −12°C. Condenser fan — backup unit 40 min out. | Reefer on CH-4471 reading −12°C. Condenser fan, backup unit 40 min out. | screens/LOG - Mobile.dc.html:157 |
| 217 | Breakdown on the N1 — CH-4466 | Breakdown on the N1: CH-4466 | screens/LOG - Requests.dc.html:632 |
| 218 | Seal mismatch on arrival — CH-4459 | Seal mismatch on arrival: CH-4459 | screens/LOG - Requests.dc.html:636 |
| 219 | From 1 September every excursion above −15°C is reported in the client channel within fifteen minutes. The steps below reflect that — reporting it at the end of the shift is a claim, not a report. | From 1 September every excursion above −15°C is reported in the client channel within fifteen minutes. The steps below reflect that: reporting it at the end of the shift is a claim, not a report. | screens/LOG - Wiki.dc.html:506 |
| 220 | Confirm the alarm is real and not a probe fault — check the second probe before you escalate. If the load has already been delivered and rejected, this is not the right page — use  | Confirm the alarm is real and not a probe fault. Check the second probe before you escalate. If the load has already been delivered and rejected, this is not the right page. Use  | screens/LOG - Wiki.dc.html:512 |
| 221 | Post this in the client channel within fifteen minutes. Facts and a time, not reassurance — the client is deciding whether to hold a receiving slot, and needs a number not a sentiment. | Post this in the client channel within fifteen minutes. Facts and a time, not reassurance. The client is deciding whether to hold a receiving slot, and needs a number not a sentiment. | screens/LOG - Wiki.dc.html:552 |
| 222 | Cold chain exception on CH-4471, ref #4471. Reefer reading −12°C against −18°C spec since approximately 08:35, cause is a condenser fan. Backup unit and technician meeting the vehicle at Colesberg, ETA 40 minutes. Load is 22 pallets frozen veg; temperature log is attached. Expect a 90-minute delay against the 14:00 slot — confirm if you want us to rebook. | Cold chain exception on CH-4471, ref #4471. Reefer reading −12°C against −18°C spec since approximately 08:35, cause is a condenser fan. Backup unit and technician meeting the vehicle at Colesberg, ETA 40 minutes. Load is 22 pallets frozen veg; temperature log is attached. Expect a 90-minute delay against the 14:00 slot. Confirm if you want us to rebook. | screens/LOG - Wiki.dc.html:553 |
| 223 | The reefer download — both probes, not just the alarming one | The reefer download: both probes, not just the alarming one | screens/LOG - Wiki.dc.html:843 |
| 224 | Verify, then escalate — in that order | Verify, then escalate (in that order) | screens/LOG - Wiki.dc.html:847 |
| 225 | Backup unit, technician, nearest cold store. Do not wait for a decision to start moving — the clock on the product is running either way. | Backup unit, technician, nearest cold store. Do not wait for a decision to start moving. The clock on the product is running either way. | screens/LOG - Wiki.dc.html:848 |
| 226 | @channel ECN-091 lands Monday — customer drawing moves to revision C and the gasket face changes. Old stock is not interchangeable, so nothing on rev B ships after Friday. | @channel ECN-091 lands Monday: customer drawing moves to revision C and the gasket face changes. Old stock is not interchangeable, so nothing on rev B ships after Friday. | screens/MFG - Chat.dc.html:878 |
| 227 | NCR-312 raised from a message — bore diameter out of tolerance | NCR-312 raised from a message: bore diameter out of tolerance | screens/MFG - Chat.dc.html:882 |
| 228 | 8D review with the customer — Fri 10:00 | 8D review with the customer, Fri 10:00 | screens/MFG - Chat.dc.html:885 |
| 229 | Containment due 16:00 — “NCR-312, bore diameter out of tolerance” | Containment due 16:00: “NCR-312, bore diameter out of tolerance” | screens/MFG - Chat.dc.html:997, screens/MFG - Dashboard.dc.html:759, screens/MFG - Events.dc.html:1465, screens/MFG - Mobile.dc.html:692, screens/MFG - Requests.dc.html:879, screens/MFG - Wiki.dc.html:977 |
| 230 | ECN-088 implemented — revised gasket spec | ECN-088 implemented: revised gasket spec | screens/MFG - Chat.dc.html:1000, screens/MFG - Dashboard.dc.html:762, screens/MFG - Events.dc.html:1468, screens/MFG - Mobile.dc.html:695, screens/MFG - Requests.dc.html:882, screens/MFG - Wiki.dc.html:980 |
| 231 | NCR-312 — bore diameter out of tolerance | NCR-312: bore diameter out of tolerance | screens/MFG - Chat.dc.html:1197, screens/MFG - Dashboard.dc.html:867, screens/MFG - Events.dc.html:1013, screens/MFG - Mobile.dc.html:681, screens/MFG - Requests.dc.html:625, screens/MFG - Requests.dc.html:1035 |
| 232 | ECN-091 — customer drawing revision C | ECN-091: customer drawing revision C | screens/MFG - Chat.dc.html:1198, screens/MFG - Dashboard.dc.html:868, screens/MFG - Events.dc.html:1015, screens/MFG - Mobile.dc.html:683, screens/MFG - Requests.dc.html:626, screens/MFG - Requests.dc.html:1036 |
| 233 | Line 2 downtime — tool change overrun | Line 2 downtime: tool change overrun | screens/MFG - Chat.dc.html:1199, screens/MFG - Dashboard.dc.html:869, screens/MFG - Events.dc.html:1016, screens/MFG - Requests.dc.html:627, screens/MFG - Requests.dc.html:1037 |
| 234 | Short shipment risk — Friday delivery | Short shipment risk: Friday delivery | screens/MFG - Chat.dc.html:1200, screens/MFG - Dashboard.dc.html:870, screens/MFG - Events.dc.html:1014, screens/MFG - Mobile.dc.html:682, screens/MFG - Requests.dc.html:628, screens/MFG - Requests.dc.html:1038 |
| 235 | Supplier call — casting porosity | Supplier call: casting porosity | screens/MFG - Events.dc.html:981 |
| 236 | Containment plan by 16:00 please — I need to brief our production manager. | Containment plan by 16:00 please. I need to brief our production manager. | screens/MFG - Mobile.dc.html:185 |
| 237 | 8D root cause — NCR-312, due Friday | 8D root cause: NCR-312, due Friday | screens/MFG - Requests.dc.html:632 |
| 238 | Calibration overdue — CMM 2 | Calibration overdue: CMM 2 | screens/MFG - Requests.dc.html:633 |
| 239 | From 1 September the customer is notified of a non-conformance within four hours, not at the end of the investigation. The steps below reflect that — a late notification is a bigger finding than the defect. | From 1 September the customer is notified of a non-conformance within four hours, not at the end of the investigation. The steps below reflect that: a late notification is a bigger finding than the defect. | screens/MFG - Wiki.dc.html:506 |
| 240 | Confirm the measurement on a second gauge before you stop a line — a calibration drift reported as a defect costs a shift. If the parts have already been fitted by the customer, this is not the right page — escalate to the plant manager immediately. Nothing suspect ships on a concession without written customer approval. | Confirm the measurement on a second gauge before you stop a line. A calibration drift reported as a defect costs a shift. If the parts have already been fitted by the customer, this is not the right page. Escalate to the plant manager immediately. Nothing suspect ships on a concession without written customer approval. | screens/MFG - Wiki.dc.html:512 |
| 241 | Post this in the customer channel within four hours of the finding. Numbers and a plan, not an apology — their supplier quality engineer has to brief their own production manager off what you write. | Post this in the customer channel within four hours of the finding. Numbers and a plan, not an apology. Their supplier quality engineer has to brief their own production manager off what you write. | screens/MFG - Wiki.dc.html:552 |
| 242 | Approved — go to print. | Approved, go to print. | screens/Mkt - Chat.dc.html:712, screens/Mkt - Dashboard.dc.html:578, screens/Mkt - Events.dc.html:901, screens/Mkt - Requests.dc.html:585, screens/Mkt - Wiki.dc.html:642 |
| 243 | Campaign — Q4 launch | Campaign: Q4 launch | screens/Mkt - Chat.dc.html:723, screens/Mkt - Chat.dc.html:1200, screens/Mkt - Dashboard.dc.html:589, screens/Mkt - Dashboard.dc.html:870, screens/Mkt - Events.dc.html:668, screens/Mkt - Events.dc.html:912, screens/Mkt - Events.dc.html:955, screens/Mkt - Events.dc.html:978, screens/Mkt - Events.dc.html:980, screens/Mkt - Events.dc.html:990, screens/Mkt - Events.dc.html:994, screens/Mkt - Events.dc.html:995, screens/Mkt - Events.dc.html:1014, screens/Mkt - Mobile.dc.html:383, screens/Mkt - Mobile.dc.html:682, screens/Mkt - Requests.dc.html:596, screens/Mkt - Requests.dc.html:628, screens/Mkt - Requests.dc.html:633, screens/Mkt - Requests.dc.html:634, screens/Mkt - Requests.dc.html:644, screens/Mkt - Requests.dc.html:1038, screens/Mkt - Wiki.dc.html:653, screens/Mkt - Wiki.dc.html:696 |
| 244 | Scope: two rounds of revisions per asset. Round three is quoted separately — do not start it on a nod in a meeting. | Scope: two rounds of revisions per asset. Round three is quoted separately. Do not start it on a nod in a meeting. | screens/Mkt - Chat.dc.html:751 |
| 245 | We can write it, but that is a health claim — it needs to clear your legal team before it goes near print. | We can write it, but that is a health claim. It needs to clear your legal team before it goes near print. | screens/Mkt - Chat.dc.html:757 |
| 246 | Understood — send the estimate and I will approve it here so nobody has to chase a PO. | Understood. Send the estimate and I will approve it here so nobody has to chase a PO. | screens/Mkt - Chat.dc.html:760 |
| 247 | @channel v3 of the hero film goes up for review at 10:00 tomorrow. Feedback in this channel by 15:00 or it ships as is — we cannot hold the print slot again. | @channel v3 of the hero film goes up for review at 10:00 tomorrow. Feedback in this channel by 15:00 or it ships as is. We cannot hold the print slot again. | screens/Mkt - Chat.dc.html:878 |
| 248 | Request #412 created from a message — out-of-scope: third revision round | Request #412 created from a message (out-of-scope: third revision round) | screens/Mkt - Chat.dc.html:882 |
| 249 | Brand guidelines query while we are at it — the new logo clearspace conflicts with the banner crop. I have put the answer on the channel wiki so we stop relitigating it every campaign. | Brand guidelines query while we are at it: the new logo clearspace conflicts with the banner crop. I have put the answer on the channel wiki so we stop relitigating it every campaign. | screens/Mkt - Chat.dc.html:884 |
| 250 | v3 creative review with the client — Thu 10:00 | v3 creative review with the client, Thu 10:00 | screens/Mkt - Chat.dc.html:885 |
| 251 | Social pack for October is approved as is — all 14 assets. Releasing those now so the team is not blocked on the hero film. | Social pack for October is approved as is, all 14 assets. Releasing those now so the team is not blocked on the hero film. | screens/Mkt - Chat.dc.html:886 |
| 252 | Due today — “Hero film v3, client sign-off” | Due today: “Hero film v3, client sign-off” | screens/Mkt - Chat.dc.html:997, screens/Mkt - Dashboard.dc.html:759, screens/Mkt - Events.dc.html:1465, screens/Mkt - Mobile.dc.html:692, screens/Mkt - Requests.dc.html:879, screens/Mkt - Wiki.dc.html:977 |
| 253 | Social pack approved — 14 assets released | Social pack approved: 14 assets released | screens/Mkt - Chat.dc.html:1000, screens/Mkt - Dashboard.dc.html:762, screens/Mkt - Events.dc.html:1468, screens/Mkt - Mobile.dc.html:695, screens/Mkt - Requests.dc.html:882, screens/Mkt - Wiki.dc.html:980 |
| 254 | Hero film v3 — client sign-off outstanding | Hero film v3: client sign-off outstanding | screens/Mkt - Chat.dc.html:1197, screens/Mkt - Dashboard.dc.html:867, screens/Mkt - Events.dc.html:1013, screens/Mkt - Mobile.dc.html:681, screens/Mkt - Requests.dc.html:625, screens/Mkt - Requests.dc.html:1035 |
| 255 | Legal review — health claim in the headline | Legal review: health claim in the headline | screens/Mkt - Chat.dc.html:1199, screens/Mkt - Dashboard.dc.html:869, screens/Mkt - Events.dc.html:1016, screens/Mkt - Requests.dc.html:627, screens/Mkt - Requests.dc.html:1037 |
| 256 | Print deadline at risk — 16:00 today | Print deadline at risk, 16:00 today | screens/Mkt - Chat.dc.html:1200, screens/Mkt - Dashboard.dc.html:870, screens/Mkt - Events.dc.html:1014, screens/Mkt - Mobile.dc.html:682, screens/Mkt - Requests.dc.html:628, screens/Mkt - Requests.dc.html:1038 |
| 257 | Print deadline — hero artwork | Print deadline: hero artwork | screens/Mkt - Events.dc.html:990 |
| 258 | v3 is rendering now — I’ll post it for review before 15:00. | v3 is rendering now. I’ll post it for review before 15:00. | screens/Mkt - Mobile.dc.html:157 |
| 259 | Brand guidelines query — logo clearspace | Brand guidelines query: logo clearspace | screens/Mkt - Requests.dc.html:630 |
| 260 | Asset resize request — 6 new placements | Asset resize request: 6 new placements | screens/Mkt - Requests.dc.html:632 |
| 261 | Amend the retainer — extra motion hours | Amend the retainer: extra motion hours | screens/Mkt - Requests.dc.html:635 |
| 262 | Tone of voice query — clinical claims | Tone of voice query: clinical claims | screens/Mkt - Requests.dc.html:639 |
| 263 | From 1 September every round is logged in the channel before work starts. The steps below reflect that — a revision agreed verbally will not be billed, and that is nobody’s fault but ours. | From 1 September every round is logged in the channel before work starts. The steps below reflect that: a revision agreed verbally will not be billed, and that is nobody’s fault but ours. | screens/Mkt - Wiki.dc.html:506 |
| 264 | How a round of creative goes out, comes back and gets closed — and what happens the moment the client asks for a third one. Written for account handlers and producers; no commercial sign-off needed to follow it. | How a round of creative goes out, comes back and gets closed, and what happens the moment the client asks for a third one. Written for account handlers and producers; no commercial sign-off needed to follow it. | screens/Mkt - Wiki.dc.html:509 |
| 265 | Check the brief has been signed off and that the round has an owner. If the client is asking for something the brief never mentioned, this is not a revision — use  | Check the brief has been signed off and that the round has an owner. If the client is asking for something the brief never mentioned, this is not a revision. Use  | screens/Mkt - Wiki.dc.html:512 |
| 266 | Post this in the client channel when a request crosses the line. Keep it factual rather than defensive — it is the message that makes the invoice unsurprising. | Post this in the client channel when a request crosses the line. Keep it factual rather than defensive. It is the message that makes the invoice unsurprising. | screens/Mkt - Wiki.dc.html:552 |
| 267 | Happy to make the change. Flagging that this is round three on the hero, which sits outside the two rounds in the retainer — estimate is R18 400 and two extra days. Approve here and we start this afternoon; the print slot still holds if we lock by 15:00 Thursday. | Happy to make the change. Flagging that this is round three on the hero, which sits outside the two rounds in the retainer. Estimate is R18 400 and two extra days. Approve here and we start this afternoon; the print slot still holds if we lock by 15:00 Thursday. | screens/Mkt - Wiki.dc.html:553 |
| 268 | Consolidated feedback — one voice from the client, not five | Consolidated feedback: one voice from the client, not five | screens/Mkt - Wiki.dc.html:843 |
| 269 | Not a revision — quote as new work | Not a revision, quote as new work | screens/Mkt - Wiki.dc.html:856 |
| 270 | Q4 estimate — round three.xlsx | Q4 estimate (round three).xlsx | screens/Mkt - Wiki.dc.html:875 |
| 271 | Programme — Early learning | Programme: Early learning | screens/NPO - Chat.dc.html:434, screens/NPO - Chat.dc.html:722, screens/NPO - Dashboard.dc.html:588, screens/NPO - Events.dc.html:668, screens/NPO - Events.dc.html:911, screens/NPO - Events.dc.html:955, screens/NPO - Events.dc.html:979, screens/NPO - Events.dc.html:995, screens/NPO - Mobile.dc.html:383, screens/NPO - Requests.dc.html:595, screens/NPO - Requests.dc.html:635, screens/NPO - Requests.dc.html:639, screens/NPO - Requests.dc.html:644, screens/NPO - Wiki.dc.html:652, screens/NPO - Wiki.dc.html:696 |
| 272 | Lusikisiki attendance for week 6 is short. Two facilitators were off sick and the register was kept on paper — I have photographed it but the numbers will not match the app. | Lusikisiki attendance for week 6 is short. Two facilitators were off sick and the register was kept on paper. I have photographed it but the numbers will not match the app. | screens/NPO - Chat.dc.html:755, screens/NPO - Chat.dc.html:880 |
| 273 | Reading along — that is exactly right, and it is useful for us to see it as it happens rather than in the report. | Reading along. That is exactly right, and it is useful for us to see it as it happens rather than in the report. | screens/NPO - Chat.dc.html:759 |
| 274 | Request #508 created from a message — attendance data, Lusikisiki week 6 | Request #508 created from a message: attendance data, Lusikisiki week 6 | screens/NPO - Chat.dc.html:882 |
| 275 | A parent raised a safeguarding concern at Mthatha yesterday afternoon. Reported through the proper channel within the hour and logged — following the wiki procedure, not a WhatsApp to me. | A parent raised a safeguarding concern at Mthatha yesterday afternoon. Reported through the proper channel within the hour and logged, following the wiki procedure, not a WhatsApp to me. | screens/NPO - Chat.dc.html:884 |
| 276 | Quarterly funder review — Thu 10:00 | Quarterly funder review, Thu 10:00 | screens/NPO - Chat.dc.html:885 |
| 277 | From our side: the transport line variation is approved. Reallocate it in the Q3 report rather than submitting a separate request — one less form for both of us. | From our side: the transport line variation is approved. Reallocate it in the Q3 report rather than submitting a separate request, one less form for both of us. | screens/NPO - Chat.dc.html:886 |
| 278 | Due today — “Q3 narrative report to Meridian” | Due today: “Q3 narrative report to Meridian” | screens/NPO - Chat.dc.html:997, screens/NPO - Dashboard.dc.html:759, screens/NPO - Events.dc.html:1465, screens/NPO - Mobile.dc.html:692, screens/NPO - Requests.dc.html:879, screens/NPO - Wiki.dc.html:977 |
| 279 | Safeguarding refresher completed — 18 volunteers | Safeguarding refresher completed: 18 volunteers | screens/NPO - Chat.dc.html:1000, screens/NPO - Dashboard.dc.html:762, screens/NPO - Events.dc.html:1468, screens/NPO - Mobile.dc.html:695, screens/NPO - Requests.dc.html:882, screens/NPO - Wiki.dc.html:980 |
| 280 | Attendance data missing — Lusikisiki, week 6 | Attendance data missing: Lusikisiki, week 6 | screens/NPO - Chat.dc.html:1198, screens/NPO - Dashboard.dc.html:868, screens/NPO - Events.dc.html:1015, screens/NPO - Mobile.dc.html:683, screens/NPO - Requests.dc.html:626, screens/NPO - Requests.dc.html:1036 |
| 281 | Expense receipts outstanding — 3 sites | Expense receipts outstanding: 3 sites | screens/NPO - Chat.dc.html:1199, screens/NPO - Dashboard.dc.html:869, screens/NPO - Events.dc.html:1016, screens/NPO - Requests.dc.html:627, screens/NPO - Requests.dc.html:1037 |
| 282 | Volunteer intake — 14 to be screened | Volunteer intake: 14 to be screened | screens/NPO - Chat.dc.html:1201, screens/NPO - Dashboard.dc.html:871, screens/NPO - Events.dc.html:1017, screens/NPO - Requests.dc.html:629, screens/NPO - Requests.dc.html:1039 |
| 283 | Site check-in — all four sites | Site check-in: all four sites | screens/NPO - Events.dc.html:977, screens/NPO - Events.dc.html:985, screens/NPO - Events.dc.html:987 |
| 284 | Data quality review — week 5 | Data quality review: week 5 | screens/NPO - Events.dc.html:979 |
| 285 | No signal at the site all morning — photographing the paper register now. | No signal at the site all morning, photographing the paper register now. | screens/NPO - Mobile.dc.html:157 |
| 286 | Grant variation request — transport line | Grant variation request: transport line | screens/NPO - Requests.dc.html:630 |
| 287 | Stipend payment query — two facilitators | Stipend payment query: two facilitators | screens/NPO - Requests.dc.html:632 |
| 288 | Annual audit — supporting schedules | Annual audit: supporting schedules | screens/NPO - Requests.dc.html:638 |
| 289 | From 1 September attendance is captured the same day, at the site. The steps below reflect that — a register written up from memory on Friday is not evidence, and funders can tell. | From 1 September attendance is captured the same day, at the site. The steps below reflect that: a register written up from memory on Friday is not evidence, and funders can tell. | screens/NPO - Wiki.dc.html:506 |
| 290 | Check you are recording against the right session and the right week. If a child attended but is not on the enrolment list, this is not the right page — use  | Check you are recording against the right session and the right week. If a child attended but is not on the enrolment list, this is not the right page. Use  | screens/NPO - Wiki.dc.html:512 |
| 291 | No signal is normal. Take the paper register, photograph it, and post it in the channel — the photo is the evidence until the data is captured. | No signal is normal. Take the paper register, photograph it, and post it in the channel. The photo is the evidence until the data is captured. | screens/NPO - Wiki.dc.html:848 |
| 292 | Logged as an emergency. Geyser is the owner’s, ceiling damage is the body corporate’s insurance — both parts recorded against the same request. | Logged as an emergency. Geyser is the owner’s, ceiling damage is the body corporate’s insurance. Both parts recorded against the same request. | screens/PM - Chat.dc.html:758 |
| 293 | @channel three quotes for the roof repair are in — R186k, R204k and R168k. All on the wiki with scope comparisons, because the cheapest one excludes the flashing. | @channel three quotes for the roof repair are in: R186k, R204k and R168k. All on the wiki with scope comparisons, because the cheapest one excludes the flashing. | screens/PM - Chat.dc.html:878 |
| 294 | On site. Geyser is a 2009 unit, well past life. Replacement quoted at R11 400 — inside the emergency mandate, so proceeding. Photographs of both units attached to #914. | On site. Geyser is a 2009 unit, well past life. Replacement quoted at R11 400, inside the emergency mandate, so proceeding. Photographs of both units attached to #914. | screens/PM - Chat.dc.html:881 |
| 295 | Request #914 raised from a message — emergency: geyser burst, unit 14 | Request #914 raised from a message (emergency: geyser burst, unit 14) | screens/PM - Chat.dc.html:882 |
| 296 | For the residents asking privately: please put maintenance in the channel and not on my mobile. It is not rudeness — a request in here has a number, an owner and a record for the insurer. | For the residents asking privately: please put maintenance in the channel and not on my mobile. It is not rudeness: a request in here has a number, an owner and a record for the insurer. | screens/PM - Chat.dc.html:883 |
| 297 | Trustee meeting — Thu 18:00 | Trustee meeting, Thu 18:00 | screens/PM - Chat.dc.html:885 |
| 298 | Emergency — “Geyser burst, unit 14, water to units below” | Emergency: “Geyser burst, unit 14, water to units below” | screens/PM - Chat.dc.html:997, screens/PM - Dashboard.dc.html:759, screens/PM - Events.dc.html:1465, screens/PM - Mobile.dc.html:688, screens/PM - Requests.dc.html:879, screens/PM - Wiki.dc.html:977 |
| 299 | Lift service completed — certificate filed | Lift service completed: certificate filed | screens/PM - Chat.dc.html:1000, screens/PM - Dashboard.dc.html:762, screens/PM - Events.dc.html:1468, screens/PM - Mobile.dc.html:691, screens/PM - Requests.dc.html:882, screens/PM - Wiki.dc.html:980 |
| 300 | Geyser burst, unit 14 — water damage below | Geyser burst, unit 14: water damage below | screens/PM - Chat.dc.html:1197, screens/PM - Dashboard.dc.html:867, screens/PM - Events.dc.html:1013, screens/PM - Mobile.dc.html:677, screens/PM - Requests.dc.html:625, screens/PM - Requests.dc.html:1035 |
| 301 | Roof repair — three quotes for trustees | Roof repair: three quotes for trustees | screens/PM - Chat.dc.html:1198, screens/PM - Dashboard.dc.html:868, screens/PM - Events.dc.html:1015, screens/PM - Mobile.dc.html:679, screens/PM - Requests.dc.html:626, screens/PM - Requests.dc.html:1036 |
| 302 | Levy arrears — unit 22, 90 days | Levy arrears: unit 22, 90 days | screens/PM - Chat.dc.html:1200, screens/PM - Dashboard.dc.html:870, screens/PM - Events.dc.html:1014, screens/PM - Mobile.dc.html:678, screens/PM - Requests.dc.html:628, screens/PM - Requests.dc.html:1038 |
| 303 | Contractor site visit — roof | Contractor site visit: roof | screens/PM - Events.dc.html:978 |
| 304 | Insurance assessor — unit 10 | Insurance assessor: unit 10 | screens/PM - Events.dc.html:981 |
| 305 | Lift service — Harbour Point | Lift service: Harbour Point | screens/PM - Events.dc.html:986 |
| 306 | Emergency plumber — unit 14 | Emergency plumber: unit 14 | screens/PM - Events.dc.html:987 |
| 307 | Plumber is on site. Geyser is a 2009 unit — replacement quoted R11 400. | Plumber is on site. Geyser is a 2009 unit, replacement quoted R11 400. | screens/PM - Mobile.dc.html:155 |
| 308 | Log the ceiling repair separately — that one is the body corporate’s insurance. | Log the ceiling repair separately. That one is the body corporate’s insurance. | screens/PM - Mobile.dc.html:175 |
| 309 | Lift breakdown — third call this month | Lift breakdown: third call this month | screens/PM - Requests.dc.html:631 |
| 310 | Insurance claim — water damage unit 10 | Insurance claim: water damage unit 10 | screens/PM - Requests.dc.html:635 |
| 311 | From 1 September the emergency mandate is R15 000 per incident, agreed by resolution. The steps below reflect that — above it, you wake a trustee rather than guess. | From 1 September the emergency mandate is R15 000 per incident, agreed by resolution. The steps below reflect that: above it, you wake a trustee rather than guess. | screens/PM - Wiki.dc.html:506 |
| 312 | Confirm it is genuinely an emergency: water, power, lift entrapment or security. If it is a dripping tap at 21:00, this is not the right page — log it as a normal request and schedule it. Anything above the mandate needs a trustee on the phone, not an assumption. | Confirm it is genuinely an emergency: water, power, lift entrapment or security. If it is a dripping tap at 21:00, this is not the right page. Log it as a normal request and schedule it. Anything above the mandate needs a trustee on the phone, not an assumption. | screens/PM - Wiki.dc.html:512 |
| 313 | Water to block A was shut off at 09:05 after a geyser burst in unit 14. A plumber is on site and we expect water back by 11:00. Unit 10 has ceiling damage and an insurance claim is open. Reference #914 — updates will be posted here, no need to phone the office. | Water to block A was shut off at 09:05 after a geyser burst in unit 14. A plumber is on site and we expect water back by 11:00. Unit 10 has ceiling damage and an insurance claim is open. Reference #914. Updates will be posted here, no need to phone the office. | screens/PM - Wiki.dc.html:553 |
| 314 | Your phone — photographs before anything is moved or repaired | Your phone: photographs before anything is moved or repaired | screens/PM - Wiki.dc.html:843 |

Edits per file:

| File | Edits |
|---|---|
| design/Screen - Channel Chat.dc.html | 10 |
| design/Screen - Dashboard.dc.html | 6 |
| design/Screen - Events.dc.html | 14 |
| design/Screen - Mobile Chat.dc.html | 6 |
| design/Screen - Requests.dc.html | 11 |
| design/Screen - School Channel Chat.dc.html | 15 |
| design/Screen - Wiki.dc.html | 9 |
| design/bases/base-chat.txt | 10 |
| design/bases/base-dashboard.txt | 2 |
| design/bases/base-events.txt | 4 |
| design/bases/base-mobile.txt | 3 |
| design/bases/base-requests.txt | 3 |
| design/bases/base-wiki.txt | 8 |
| design/screens/ACC - Chat.dc.html | 12 |
| design/screens/ACC - Dashboard.dc.html | 4 |
| design/screens/ACC - Events.dc.html | 5 |
| design/screens/ACC - Mobile.dc.html | 5 |
| design/screens/ACC - Requests.dc.html | 10 |
| design/screens/ACC - Wiki.dc.html | 5 |
| design/screens/Arch - Chat.dc.html | 15 |
| design/screens/Arch - Dashboard.dc.html | 8 |
| design/screens/Arch - Events.dc.html | 9 |
| design/screens/Arch - Mobile.dc.html | 7 |
| design/screens/Arch - Requests.dc.html | 15 |
| design/screens/Arch - Wiki.dc.html | 8 |
| design/screens/CLN - Chat.dc.html | 14 |
| design/screens/CLN - Dashboard.dc.html | 6 |
| design/screens/CLN - Events.dc.html | 7 |
| design/screens/CLN - Mobile.dc.html | 7 |
| design/screens/CLN - Requests.dc.html | 13 |
| design/screens/CLN - Wiki.dc.html | 8 |
| design/screens/Con - Chat.dc.html | 11 |
| design/screens/Con - Dashboard.dc.html | 7 |
| design/screens/Con - Events.dc.html | 11 |
| design/screens/Con - Mobile.dc.html | 6 |
| design/screens/Con - Requests.dc.html | 13 |
| design/screens/Con - Wiki.dc.html | 9 |
| design/screens/ENG - Chat.dc.html | 12 |
| design/screens/ENG - Dashboard.dc.html | 5 |
| design/screens/ENG - Events.dc.html | 9 |
| design/screens/ENG - Mobile.dc.html | 5 |
| design/screens/ENG - Requests.dc.html | 9 |
| design/screens/ENG - Wiki.dc.html | 7 |
| design/screens/ITSP - Chat.dc.html | 16 |
| design/screens/ITSP - Dashboard.dc.html | 9 |
| design/screens/ITSP - Events.dc.html | 19 |
| design/screens/ITSP - Mobile.dc.html | 6 |
| design/screens/ITSP - Requests.dc.html | 18 |
| design/screens/ITSP - Wiki.dc.html | 12 |
| design/screens/LAW - Chat.dc.html | 17 |
| design/screens/LAW - Dashboard.dc.html | 11 |
| design/screens/LAW - Events.dc.html | 29 |
| design/screens/LAW - Mobile.dc.html | 8 |
| design/screens/LAW - Requests.dc.html | 28 |
| design/screens/LAW - Wiki.dc.html | 10 |
| design/screens/LOG - Chat.dc.html | 11 |
| design/screens/LOG - Dashboard.dc.html | 4 |
| design/screens/LOG - Events.dc.html | 6 |
| design/screens/LOG - Mobile.dc.html | 5 |
| design/screens/LOG - Requests.dc.html | 8 |
| design/screens/LOG - Wiki.dc.html | 10 |
| design/screens/MFG - Chat.dc.html | 10 |
| design/screens/MFG - Dashboard.dc.html | 6 |
| design/screens/MFG - Events.dc.html | 7 |
| design/screens/MFG - Mobile.dc.html | 7 |
| design/screens/MFG - Requests.dc.html | 12 |
| design/screens/MFG - Wiki.dc.html | 6 |
| design/screens/Mkt - Chat.dc.html | 17 |
| design/screens/Mkt - Dashboard.dc.html | 8 |
| design/screens/Mkt - Events.dc.html | 16 |
| design/screens/Mkt - Mobile.dc.html | 7 |
| design/screens/Mkt - Requests.dc.html | 19 |
| design/screens/Mkt - Wiki.dc.html | 14 |
| design/screens/NPO - Chat.dc.html | 15 |
| design/screens/NPO - Dashboard.dc.html | 6 |
| design/screens/NPO - Events.dc.html | 14 |
| design/screens/NPO - Mobile.dc.html | 5 |
| design/screens/NPO - Requests.dc.html | 15 |
| design/screens/NPO - Wiki.dc.html | 8 |
| design/screens/PM - Chat.dc.html | 12 |
| design/screens/PM - Dashboard.dc.html | 5 |
| design/screens/PM - Events.dc.html | 9 |
| design/screens/PM - Mobile.dc.html | 7 |
| design/screens/PM - Requests.dc.html | 10 |
| design/screens/PM - Wiki.dc.html | 7 |

## Not changed

- **Empty-cell placeholder (126 occurrences, 42 files).** A lone em dash character is used as data for "no value": `ASSIGNEES` and SLA arrays in every Requests mockup and `bases/base-requests.txt` (it renders in the Assigned to and SLA columns), the table filter logic that compares against it (`cell === '—'`, `r.assigned === '—'`, `r.sla === '—'`), and the `email: '—'` fallback for the hover person card in every Events and Wiki mockup. None of comma, full stop, colon or parentheses can stand in for a placeholder, and changing it means changing code, so it was left for Dom to decide (options: an en dash, "Unassigned" / "None", or leaving the cell blank). It still shows in all 13 regenerated Requests screenshots (a5, ac2, c4, c5, e2, i2, l3, g2, f2, m2, n2, p2, shot).
- **`design/uploads/Kolabr Interface/*.html`** (6 bundled app mockups, 147 em dashes). They feed no used screenshot, they are uploaded reference bundles (JSON-escaped templates), and several of their em dashes are the same code-level placeholder. Left untouched.
- Marketing pages in `design/` (Home, Product, Use Case, Compare pages) are not screenshot sources and were out of scope for this task.

## Regenerated PNGs (70, all in design/assets/screens/)

`a5-chat.png`, `a5-requests.png`, `a7-wiki-crop.png`, `a3-mobile.png`, `a5-dashboard.png`, `ac2-chat.png`, `ac2-requests.png`, `ac2-wiki.png`, `ac3-mobile.png`, `ac2-dashboard.png`, `c3-chat.png`, `c5-requests.png`, `c6-wiki.png`, `c8-mobile.png`, `c5-dashboard.png`, `c4-requests.png`, `c6-mobile.png`, `e2-chat.png`, `e2-requests.png`, `e2-wiki.png`, `e4-mobile.png`, `e2-events.png`, `e2-dashboard.png`, `i2-chat.png`, `i2-requests.png`, `i2-wiki.png`, `i2-mobile.png`, `i2-events.png`, `i2-dashboard.png`, `l3-chat.png`, `l3-requests.png`, `l3-wiki.png`, `l4-mobile.png`, `l3-events.png`, `l3-dashboard.png`, `g2-chat.png`, `g2-requests.png`, `g2-wiki.png`, `g3-mobile.png`, `g2-events.png`, `g2-dashboard.png`, `f2-chat.png`, `f2-requests.png`, `f2-wiki.png`, `f3-mobile.png`, `f2-dashboard.png`, `m2-chat.png`, `m2-requests.png`, `m2-wiki.png`, `m3-mobile.png`, `m2-events.png`, `m2-dashboard.png`, `n2-chat.png`, `n2-requests.png`, `n2-wiki.png`, `n4-mobile.png`, `n2-events.png`, `n2-dashboard.png`, `p2-chat.png`, `p2-requests.png`, `p2-wiki.png`, `p3-mobile.png`, `p2-events.png`, `p2-dashboard.png`, `shot-chat.png`, `shot-mobile.png`, `shot-requests.png`, `shot-events.png`, `shot-wiki.png`, `shot-dashboard-final.png`

Verification: every file checked with `sips -g pixelWidth -g pixelHeight` against the backup (all identical); wiki crops keep transparent corners; no broken images during capture. Each regenerated image was pixel-diffed against its backup and the diff maps reviewed: differences are confined to the edited strings and the text reflow they cause (for example Requests table rows get shorter when a title stops wrapping, and wiki paragraphs rewrap). Pre-edit renders of the same sources matched the originals, so no differences come from fonts, avatars, state or layout.

## Left alone

- `a5-events.png`, `ac2-events.png`, `c5-events.png`, `c6-events.png`, `f2-events.png`: no em dash in the captured area (render after edits is pixel-identical to the render before edits). Backups exist but the files were not rewritten.
- `c2-chat.png` (used on Use Case - Construction): it is a Northfield Health (clinic) chat captured from an older version of `screens/CLN - Chat.dc.html` (member "Dr Riaan Steyn" and an "In channel" chip "Dr", Requests count 24; the current source has "Riaan Steyn" and 23). Regenerating from the current source would change more than the em dashes, so it was not overwritten. It still shows 2 em dashes: pinned "Use the file number only — clinical detail belongs in the record, not in chat." and "a channel task now — if it is not ticked here, it did not happen...".
- All 32 `design/assets/ui-*.png` and `app-*.png`: no source in `design/` (see mapping).

## Used screenshots that still visibly contain an em dash

- Requests placeholder cells: a5-requests, ac2-requests, c4-requests, c5-requests, e2-requests, i2-requests, l3-requests, g2-requests, f2-requests, m2-requests, n2-requests, p2-requests, shot-requests (4 or 5 cells each, Assigned to and SLA columns).
- `design/assets/screens/c2-chat.png`: 2 prose em dashes (see above).
- `design/assets/`: ui-events, ui-chat, ui-channel-chat, ui-thread-crop, ui-pop-notifications, ui-pop-chats, ui-events-page, ui-requests-list, ui-request-detail, ui-wiki-article, ui-wiki-new, app-requests, app-m-dash, app-m-chat, app-m-events, app-m-chats, app-m-wiki (prose or placeholder em dashes), plus ui-admin-audit (placeholder dash, possibly an em dash).

## Other findings in design/ (not changed, for Dom)

- **Use Case - Construction shows clinic screenshots.** Of its six screenshots only `c6-mobile.png` is construction content (`screens/Con - Mobile.dc.html`). `c2-chat`, `c4-requests`, `c5-dashboard`, `c5-events` and `c6-wiki` are all Northfield Health (clinic) screens, and `c5-dashboard` and `c6-wiki` are the same files Use Case - Clinics uses. The construction mockups (`screens/Con - Chat/Dashboard/Events/Requests/Wiki.dc.html`) exist but no used PNG was captured from them.
- `c4-requests.png` and `c5-requests.png` are the same capture (both from `CLN - Requests`), as are `c5-events.png` and `c6-events.png` (both from `CLN - Events`).
- `shot-wiki.png` was captured from a slightly different layout of `Screen - Wiki.dc.html` (right rail offset by 10 px); emulated at capture time, see settings.
- Some edited mockup copy contains flag-list terms (for example "ticket" in the ITSP wiki, "Service desk" channel names, "agent" roles). Out of scope here, not changed.


## Second pass, 23 September 2026

Dom asked for the remaining em dashes to be removed.

**1. The placeholder dash (126 occurrences, 42 files).** The mockups used a lone em dash as the
"no value" marker in the Assigned to and SLA columns, and their filter code compared against the
same character. Every remaining em dash in `design/screens/`, `design/bases/` and
`design/Screen - *.dc.html` became a hyphen, which keeps data and comparisons in step. The 13
Requests screenshots were recaptured with the existing script. Originals of the edited sources are
in `.design-backup/placeholder-pass/`.

**2. The hand-taken screenshots (28 dashes, 16 files).** These have no source to re-render, so the
pixels were edited: each dash glyph was repainted with the background it sits on and a hyphen of
the same colour and thickness drawn in its place. Every one was reviewed as a before and after crop
first. Detection and editing: `retouch-dashes.mjs` (kept with the session notes, not in the
project). Originals are in `.design-backup/dash-retouch/`.

Files edited: app-m-chats, app-m-dash, app-m-events, app-mobile, app-requests, ui-channel-chat,
ui-chat, ui-pop-chats, ui-pop-notifications, ui-request-detail, ui-requests-list, ui-thread,
ui-thread-crop, ui-wiki-article, ui-wiki-new (15 used screenshots, plus ui-thread which is unused).

A re-scan afterwards finds no em dash left in any screenshot.

**3. Construction screenshots.** The Construction use case showed Northfield Health (clinic)
screens. Its own mockups existed but had never been captured, so `Con - Chat`, `Requests`,
`Dashboard`, `Events` and `Wiki` were captured as `con-*.png` and the page now points at them.
The clinic pages keep the images they always used. The existing alt text already described
construction content, so it now matches what the images show. `scripts/sync-assets.mjs` carries an
`EXTRA_IMAGES` list, because no design page references these five.
