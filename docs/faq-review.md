# Use case FAQs: for review

**Approved 23 September 2026 and live.** Each use case page now shows these questions in a
"Frequently asked questions" section, and its FAQPage JSON-LD is generated from the same text
(`lib/use-case-faqs.ts`). Edit that file and this document together: the schema must always match
the words on the page.

**How they were written**

- 4 to 5 questions per page (65 in total), answered only from what that page already says. The source line under each answer names the page section it comes from, so you can check it. The source lines are for review only and will not be published.
- No em dashes. Kolabr is never called a helpdesk. Kolabr's items are called "requests", including on the IT Service Providers page, where the page's own copy says "tickets".
- "Agent" appears only as a job title that the page itself uses ("site agent", "managing agent").
- "Seat count" appears where the page uses it. It quotes the current plan limits (30 on Starter, 100 on Pro, unlimited on Max). **You said pricing is not final**, so these answers will need updating if the limits change. Say the word and I will cut the plan numbers from the FAQs.

**Worth a look**

- **Construction:** the page heading "Built for a man in a hard hat, not a desk" and its body text assume a male foreman. The FAQ is gender-neutral. The page copy is unchanged, since copy is final.
- **Construction:** the page also says "When an agent moves to the next job" (bare "agent", meaning site agent). The FAQ says "site agent".
- **Clinics:** answers repeat the page's own claims (for example "Kolabr is not a patient record") and add no clinical or regulatory claims.

---

## Schools (`/use-cases/schools`)

**Q: Do we have to pay for parents to use Kolabr?**
A: No. Parents, coaches and suppliers join as guests, free, on every plan, and are never billed. The plan covers your own team. Each channel does have a seat count (30 on Starter, 100 on Pro, unlimited on Max) that staff and guests share, so a class of 27 parents and two teachers fits a Starter channel.
_Source: Where a school puts its channels; You pay for staff only_

**Q: Can parents see other families or the staff room?**
A: No. A parent invited to a class channel sees that channel and nothing else: no staff room, no directory of other families, no teacher's personal number. Concerns about a single child go in a private thread between that parent and the teachers, inside the same channel, invisible to the rest of the class.
_Source: Parent communication that is not a group chat; Guests see one channel; One child, one thread_

**Q: How do we stop parents messaging teachers at night?**
A: Parents raise things as requests instead of messages. Each request has an owner and a due date, and the answer arrives inside school hours. You set your own categories (absence, transport, maintenance, IT and so on) with an SLA per category, so everyone can see whether the promised reply happened.
_Source: When the teacher's day ends, it ends; Your own categories; A promise with a clock_

**Q: What happens to our channels at the end of the school year?**
A: You build next year's classes from a channel template, with categories, SLAs and the wiki already in place, and archive last year's channels so they stay readable. Every message, request and file stays with the channel, so a conversation with a family can still be reviewed later, with who said it and when.
_Source: Roll over in one step; A record, not a rumour_

**Q: What is the best way to trial Kolabr at our school?**
A: Start with one class. Pick the teacher who is drowning in messages, create one channel, invite the parents and run it for two weeks. The trial is fourteen days free on Max, with every option included and no card required. It either helps by half-term or it does not.
_Source: Start with one class; Try it on one classroom_

## Nonprofits (`/use-cases/nonprofits`)

**Q: Will we be billed for our volunteers?**
A: No. Volunteers, trustees and funders join as guests and are never billed; the plan covers the people on your payroll. Each channel has a seat count (30 on Starter, 100 on Pro, unlimited on Max) shared between staff and guests, but a small team supporting forty volunteers is not a forty-person bill.
_Source: Where an organisation puts its channels; You pay for staff, not volunteers_

**Q: Can funders see our internal conversations or other funders' grants?**
A: No. Each funder gets their own channel and sees only the programme they fund, not another funder's grant and not your internal conversation about cash flow. They can watch the work as it happens instead of waiting for a quarterly PDF. Trustees likewise see governance without seeing every field message.
_Source: Funders; Funders see their programme; Board & governance_

**Q: Our facilitators work at sites with almost no signal. Will it work?**
A: The app is built for that. Facilitators use the phones they already carry, so there are no tablets to buy. It is light on data for expensive, unreliable mobile connections. When there is no signal, they photograph the paper register, which serves as the evidence until the numbers are captured.
_Source: Built for a site with one bar of signal_

**Q: How does Kolabr make quarterly funder reports and audits easier?**
A: Data requests, receipts, safeguarding items, volunteer screening and funder deadlines are recorded as numbered items with an owner and a date, the day they happen. When the quarter closes, the evidence is already in one place. The audit log shows who recorded what, when and with which document, for auditors, funders and the board.
_Source: Reporting stops being a fortnight of archaeology; Ready for the audit, and the next grant_

**Q: What happens to the history when a coordinator leaves?**
A: It stays with the programme. Messages, items and procedures belong to the channel, not the person, so staff turnover does not take the record with it. When a grant closes, you archive the channel and keep it readable for the audit, then build the next programme from a channel template.
_Source: The programme, not the person; Next programme in one step_

## Architecture Firms (`/use-cases/architecture-firms`)

**Q: Do clients, contractors and consultants need to pay for a seat?**
A: No. Clients, contractors, engineers and QSs join as guests, free, on every plan, and are never billed. The plan covers your own people. Each channel has a seat count (30 on Starter, 100 on Pro, unlimited on Max) shared with guests, and a project with a client, a contractor and four consultants sits comfortably inside a Starter channel.
_Source: Where a practice puts its channels; You pay for the studio only_

**Q: How are RFIs tracked in Kolabr?**
A: A question from site becomes a numbered request in the project channel, categorised as an RFI, variation, site instruction or submission, and routed to the person who answers it. Each category carries an SLA the contractor and client can see. Anyone in the studio can turn a site message into a numbered RFI in one step, photographs attached.
_Source: Every RFI has an owner and a due date; Your own categories; A clock the contractor can see; A message becomes an RFI_

**Q: How do we stop contractors pricing off a superseded drawing?**
A: Issue the revision in the channel and the contractor, QS and engineer all see the same transmittal at the same moment, with the superseded list published alongside. The transmittal, drawing register and revision notes live on the channel wiki, which guests can read, and each revision can be linked to the RFI or instruction that caused it.
_Source: Nobody prices off a superseded sheet again; The revision knows why it exists; One issue, one list, one place_

**Q: Will a contractor see our fees or other clients' projects?**
A: No. Guests see one project. The contractor on one scheme sees that scheme, not your fee conversation and not another client's project they may be bidding on. Resourcing, fee queries and internal critique stay in a studio channel for your own team only. Roles control who can issue a set, close an RFI or approve a variation.
_Source: Guests see one project; Studio; Roles for the studio_

**Q: Does it help if a contractor claims our information was late?**
A: Yes. The channel keeps a record of who asked, when it was answered, which revision went out and who acknowledged it. The audit log shows who did what, retention is set by policy, and at practical completion you archive the channel and keep it readable for the defects period.
_Source: A record that survives the claim; Next project in one step_

## Engineering Firms (`/use-cases/engineering-firms`)

**Q: Can a candidate engineer sign off an inspection certificate?**
A: A candidate engineer can run an inspection, but only a professional closes the certificate, and this is enforced by role rather than by memory. The inspection procedure sits on the channel wiki beside the project, covering what a hold point is, what to photograph and exactly how a decision is recorded.
_Source: Who may sign; Candidate engineers inspect the way you would_

**Q: How is an inspection decision recorded?**
A: In writing, in the channel: approved, approved with conditions, or not approved, with the measurement and the reason. Inspect against the current revision and photograph what you measured, such as the tape against the bar. Sign-off can be recorded at the element from the field, not typed up from notes that evening.
_Source: Decide in writing, in the channel; Photograph what you measured; Sign-off from the field_

**Q: Can the site agent raise a query from site before a pour?**
A: Yes. The site agent photographs the issue and turns it into a numbered query in one step, with the image attached and a name against the answer. A query holding a pour has a due time both sides can see. The app works on a bad line, and engineers can often measure off the photograph without driving to site.
_Source: A photograph becomes a query; A clock the contractor can see; The hold reaches site before the concrete does_

**Q: How long are inspection records kept?**
A: Professional liability outlives the project, so the record of what you inspected, measured and refused, and when, is kept for as long as the exposure lasts. The audit log shows who signed what, retention runs beyond completion, and archived channels are read-only and searchable for the liability period. The record stays with the project when an engineer leaves.
_Source: The file your insurer wants; Next commission in one step; The project, not the engineer_

**Q: Do we pay for clients and contractors, and how do we start?**
A: Clients, contractors and other consultants are guests and are never billed; the plan covers your own people. To start, pick the project with the most site queries and the least written record, invite the contractor and run it for two weeks. The trial is fourteen days free on Max, every option included, no card.
_Source: You pay for your engineers; Start where you are exposed; Try it on one project_

## Marketing Agencies (`/use-cases/marketing-agencies`)

**Q: Do our clients have to pay to use Kolabr?**
A: No. Clients join as guests, free, on every plan, and that includes their legal reviewers and freelance collaborators. You pay for the agency only. Each channel has a seat count (30 on Starter, 100 on Pro, unlimited on Max), shared between your team and your guests.
_Source: You pay for the agency only; Where an agency puts its channels_

**Q: How should an agency set up its channels?**
A: Most agencies run one channel per client, then split by workstream: campaign, creative review, always-on social, and scope and billing. A studio channel is for your own team only, for resourcing, fee conversations and honest critique. Each client sees only their own work, never another client's.
_Source: Where an agency puts its channels_

**Q: How does Kolabr stop us doing out-of-scope work for free?**
A: Approvals, scope requests, brand queries and delivery deadlines become numbered items with an owner and a clock. When a client asks for one more thing in the channel, one step turns that message into a scope request with an estimate attached. At month-end, over-servicing is a number you can point at, not a feeling.
_Source: The work you did for free, made visible; A message becomes an estimate_

**Q: Can clients approve work from their phone?**
A: Yes. A sign-off that unblocks a print slot takes ten seconds on a phone, and the approval is still logged against the version, in the channel. Notifications are set per channel, so a launch week does not train people to mute everything, and client conversations stop living on personal phones.
_Source: Approvals do not wait for someone to reach a laptop_

**Q: What happens to the client history when an account director leaves?**
A: It stays with the client instead of walking out in a mailbox. The channel keeps what was approved, by whom, on which version, and what was asked for afterwards, with an audit log of who approved what. Retention is set by policy, and when an account ends it can be archived and kept readable.
_Source: The pitch you can prove; The account, not the handler; Next client in one step_

## Accounting Firms (`/use-cases/accounting-firms`)

**Q: Do our clients' finance staff need paid accounts?**
A: No. Client finance teams join as guests and are never billed, however many of them send you documents. You pay for your staff. Each channel has a seat count (30 on Starter, 100 on Pro, unlimited on Max), shared between your staff and your client's. A client with three finance people and your team of five sits comfortably inside Starter.
_Source: You pay for your staff; Where a practice puts its channels_

**Q: How do we organise channels for each client?**
A: Most firms run one channel per client, split by service line: monthly bookkeeping, year-end and audit, payroll, and tax and SARS. Payroll sits separately because its questions are urgent and personal. A practice channel is for your own people. Clients see only their own affairs, never another client or your internal notes.
_Source: Where a practice puts its channels; Clients see their own affairs_

**Q: Can Kolabr track SARS and other statutory deadlines?**
A: Yes. Filings, queries, audit items and bookkeeping tasks are numbered items with an owner and a due date. Statutory dates such as VAT201, EMP201, provisional tax and CIPC carry a clock on the item, and "waiting on client" is visible to the client. Each client's compliance calendar syncs to Outlook and Google.
_Source: Nothing waits on a document nobody asked for twice; Statutory dates with a clock; The compliance calendar, per client, in one place_

**Q: Can we stop a junior submitting without partner review?**
A: Yes. A junior prepares, a partner reviews and submits, and that is enforced by role rather than by a reminder in a team meeting. The SARS procedure can also sit on the channel wiki beside the client, setting out what to ask for and who reviews before anything is submitted.
_Source: Who may submit; Every junior handles a SARS letter the way you would_

**Q: What's the best way to try Kolabr in our practice?**
A: Start with the client who never sends anything. Set up one channel, invite their finance people and run one month-end through it. The trial is fourteen days free on Max, with every option included and no card. After that, each new client can be built from a channel template in one step.
_Source: Start with the client who never sends anything; Try it on one client; Next client in one step_

## Law Firms (`/use-cases/law-firms`)

**Q: Can we keep a conflicted matter away from certain staff?**
A: Yes. A channel is a wall: where a conflict requires separation, the people who must not see a matter simply cannot. Sensitive work such as employment matters is visible only to the people who should see it, and clients see only their own matter, not another client or the firm's internal view of their position.
_Source: Information barriers; Employment; Clients see their matter_

**Q: How does Kolabr help us record client instructions?**
A: When a client gives an instruction in the channel, one step makes it a recorded instruction with the mandate attached, before anyone acts on it. The procedure sits on the matter's wiki: who may instruct, how to confirm it, and what to do when there was no time to confirm before acting.
_Source: An instruction becomes a task; Every associate records a mandate the same way_

**Q: What stops a court deadline being missed?**
A: A court date carries a clock and escalates before it is missed, so it does not depend on one person remembering a diary entry. Filings, instructions, drafting, due diligence and advice are numbered tasks, each routed to the fee earner who owns it. A supervising partner sees approaching deadlines across every matter on one screen.
_Source: Deadlines that are not negotiable; Categories that match practice; Every matter on one screen_

**Q: Do clients and counsel have to pay?**
A: No. Clients, counsel and other advisers are guests and are never billed. The plan covers your fee earners. Each channel has a seat count (30 on Starter, 100 on Pro, unlimited on Max), shared between your fee earners and your guests. A matter with three client contacts and your team of five sits inside Starter.
_Source: You pay for fee earners; Where a firm puts its channels_

**Q: How long is the matter record kept?**
A: The audit log records who said what, and when. Retention runs for the prescription period, and the channel is archived on matter closure. If an associate leaves mid-transaction, the instructions and history stay with the matter, ready for a fee dispute, a negligence allegation or a client who remembers it differently.
_Source: A file that defends itself; The matter, not the attorney_

## IT Service Providers (`/use-cases/it-service-providers`)

**Q: Do our clients need a portal login to raise requests?**
A: No. Client staff raise requests by typing in their channel, with no portal login. When a user describes a problem, one step turns the message into a request with the whole thread attached, so nobody retypes anything. Client staff join as guests and are never billed, however many requests they raise.
_Source: the request section and its "from conversation" card (page headings use "ticket" and "service desk"); You pay for your engineers_

**Q: Can our clients see how we're performing against the SLA?**
A: Yes, that is the point. SLAs are set per category and per client, for example fifteen minutes for a P1 response and four hours for a printer. They are visible to the client and measured whether or not anyone is watching. Volume, response times and what was resolved become evidence for the QBR.
_Source: Your SLAs, per category; Evidence for the QBR_

**Q: How should we structure channels for each managed client?**
A: Most providers run one channel per client, split by the kind of work: the everyday queue, incidents and outages (P1 and P2 only, so clients can mute the noise but never this), security and compliance, and projects. An internal channel is for your engineers only. Each client sees only their own estate.
_Source: Where a provider puts its channels; Clients see one estate_

**Q: How does on-call work from a phone?**
A: The wiki travels with the channel, so the runbook is one tap from the alert. The engineer can read it, post the update and hand over at shift change from the channel the client is already watching. The next engineer reads the thread, and notifications are per channel, so incidents wake you and the printer channel does not.
_Source: On-call, on a phone, at twenty past one in the morning_

**Q: Which plan do we need for a forty-person client?**
A: Each channel has a seat count shared between your engineers and your client's staff: 30 on Starter, 100 on Pro, unlimited on Max. A forty-person client with your team of six needs Pro, while a boutique practice sits inside Starter. Client staff are guests and never billed, and the plan covers your own people.
_Source: Where a provider puts its channels; You pay for your engineers_

## Construction (`/use-cases/construction`)

**Q: Do subcontractors cost us anything?**
A: No. Clients, QSs and subcontractors join as guests and are never billed. The plan covers the people on your payroll. Each channel has a seat count (30 on Starter, 100 on Pro, unlimited on Max) shared between your staff and your guests, and a site with a client PM, a QS and six subcontractor foremen sits inside a Starter channel.
_Source: You pay for your own staff; Where a contractor puts its channels_

**Q: Will our foremen actually use this on site?**
A: It is built for a foreman with one bar of signal and gloves on, not a desk. They can photograph the clash, raise the variation and be done before the concrete arrives, without learning a system. Toolbox talks are recorded and signed off on a phone, and the procedure sits on the channel wiki, readable at the excavation.
_Source: Built for a man in a hard hat, not a desk; The procedure lives on site, not in a folder nobody opens_

**Q: How do variations and delay notices get recorded?**
A: The foreman reports it in the channel, and one step turns that message into a numbered variation with the photographs already attached. Variations, delay notices, RFIs, quality items, safety incidents and snags each route to the person who owns them. If a change moves the critical path, the notice of delay goes in the same day and links to the variation.
_Source: A message becomes a variation; Categories that match the contract; Cost and time are two claims_

**Q: Can subcontractors see our margins?**
A: No. Each subcontractor sees their own trade channel and nothing else. The electrical contractor on Harbour Yard sees Harbour Yard, not your margins and not the job they are about to bid against you on. Roles set who can approve a variation, close a safety item or sign off a pour.
_Source: Per trade; Subbies see one site; Roles that match the site_

**Q: How long is the site record kept after completion?**
A: Retention runs through the defects period, and the channel is archived at final account and kept readable. The audit log shows who was told, when, and with which photograph attached, which is the file you want in adjudication. When a site agent moves to the next job, the claim history stays with the project.
_Source: The file you want in adjudication; The site, not the site agent; Next site in one step_

## Property Management (`/use-cases/property-management`)

**Q: Do trustees and residents have to pay to use Kolabr?**
A: No. Trustees, owners and residents join as guests, free, on every plan, and are never billed however many of them report a leak. You pay for your staff. Guests do share each channel's seat count with your staff: 30 on Starter, 100 on Pro and unlimited on Max.
_Source: Take the building off your personal phone; Where a managing agent puts its channels; You pay for your staff_

**Q: How should a managing agent set up channels for each building?**
A: Most managing agents run one channel per building, split by who is allowed to see what. Typical channels are Maintenance, Trustees, Residents, Levies & arrears, and your own Agency channel. Owners and trustees see only their own building, and sensitive matters like arrears stay out of the residents channel.
_Source: Where a managing agent puts its channels; Trustees see more than residents_

**Q: How do response times work for emergencies versus everyday queries?**
A: Every job has a number, an owner and a clock. Categories such as emergency, resident query, quote approval, compliance and arrears are each routed to the person who handles them, with their own response time: an emergency has minutes, a parking dispute has days. Trustees see the same clock you do.
_Source: Every job has a number, an owner and a clock; Categories that match the portfolio; Response times per category_

**Q: Can our site supervisors use it from their phones on site?**
A: Yes. What site staff photograph, quote and confirm from a phone lands on the building's record. Photographs attach to the request with a timestamp, spend approvals are recorded against the job, and notifications are set per building, so an emergency at one scheme wakes you and a parking query does not.
_Source: Your supervisor is on a roof, not at a desk_

**Q: What happens to a building's history if a portfolio manager leaves or the mandate moves?**
A: The history stays with the building instead of on a personal phone. The audit log shows who approved what, retention is set by policy, and handover is covered if the mandate moves. The same record answers the AGM: what was reported, when it was attended, what it cost and who approved it.
_Source: The building, not the manager; The answer at the AGM_

## Clinics (`/use-cases/clinics`)

**Q: Does Kolabr hold patient records?**
A: No. Kolabr is not a patient record; it coordinates the practice around one. The wiki rule on every clinical channel is that identifiers and clinical detail stay in the record, not in chat. The channel carries a file number, a priority and a name, and the fact that an item was seen and closed.
_Source: An urgent result should never wait in a shared inbox; The admin that surrounds care; Close it in the record, not in the chat_

**Q: Do our lab and radiology partners need to pay?**
A: No. Labs, radiology practices and referral partners join as guests and are never billed; the plan covers your own people. Each partner sees only its own channel, not billing or the roster. Guests share the channel seat count with staff, and a single-site practice with a lab and a radiology partner sits comfortably inside Starter.
_Source: Where a practice puts its channels; Partners see one channel; You pay for your staff_

**Q: What happens if nobody acknowledges an urgent result?**
A: An urgent result is flagged by file number and assigned to the named clinician on that patient today, so the task has an owner rather than an audience. If it is unacknowledged after an hour, it escalates to the practice manager, not because someone remembered to check. Acknowledging it on a phone takes seconds.
_Source: Escalation that does not rely on memory; Name who must act; Between patients, not between emails_

**Q: How do we give locums access and then remove it?**
A: Locum onboarding is a task with a deadline, so access can start on Tuesday morning and be gone on Thursday evening. The results procedure sits on the channel wiki, so a locum follows the same procedure as the partner. The audit log records who saw and acted, and access is revoked the day staff leave.
_Source: Locums, in and out; The locum follows the same procedure as the partner; Built for what you may write down_

**Q: Can we track fridge logs and other routine checks?**
A: Yes. Fridge logs, emergency trolley checks and sharps collections run as recurring tasks with a name against each one, in the Practice operations channel. If it is not ticked in the channel, it did not happen as far as an inspection is concerned. The dashboard shows compliance due alongside overdue results and outstanding referrals.
_Source: Practice operations; Recurring compliance as tasks; The practice on one screen_

## Logistics (`/use-cases/logistics`)

**Q: Do our clients pay for access to their account channel?**
A: No. Client depots, receiving clerks and planners join as guests and are never billed; the plan covers your controllers. They do share each channel's seat count with your staff: 30 on Starter, 100 on Pro, unlimited on Max. A national account with six receiving sites needs Pro, while a single-lane customer fits in Starter.
_Source: Where a carrier puts its channels; You pay for your own staff_

**Q: Can one client see another shipper's loads or rates?**
A: No. Most carriers run one channel per account, and each client sees only its own freight, not another shipper's rates and not a competitor sharing your backhaul. Your Control room channel is for your own staff: shift handover, fleet and the frank assessment of a trailer before a client hears about it.
_Source: One channel per account; Clients see their freight; Control room_

**Q: How quickly should we tell a client about a cold chain excursion?**
A: The procedure on the account's wiki says within fifteen minutes, before their depot notices: what happened, what is on the trailer, what you are doing and when it will arrive, with the log attached. The exception carries a clock both sides can see, so the client watches the same timer you do.
_Source: Tell the client within fifteen minutes; A clock both sides can see_

**Q: Does it work for supervisors and controllers on the road at night?**
A: Yes. It is built for a truck stop, not an office connection, and works on one bar. Seal photographs and tally sheets attach where the claim will be argued, the next controller reads the channel at shift handover, and notifications are per account, so cold chain wakes you and a booking query does not.
_Source: Nights, depots and the side of the N1_

**Q: Will it help us when a client lodges a claim?**
A: Yes. Temperature logs, seal photographs, signed PODs and the time you told the client sit on the record, and a claim is decided on the record. The audit log shows who reported and when, retention runs through the claim window, and roles set who can accept a claim, rebook a slot or close an exception.
_Source: The evidence when a claim lands; Roles for the control room_

## Manufacturing (`/use-cases/manufacturing`)

**Q: Do our customers have to pay to join their channel?**
A: No. Customer engineers, buyers and auditors join as guests and are never billed; the plan covers your own people. Guests share each channel's seat count with your plant: 30 on Starter, 100 on Pro, unlimited on Max. A customer quality channel fits inside Starter, while a production channel with three shifts of leads needs Pro.
_Source: Where a plant puts its channels; You pay for the plant_

**Q: Will a customer see our supplier problems or other customers' NCRs?**
A: No. Most plants run one channel per customer plus the internal ones. Each customer sees only their own parts, not another customer's NCR rate and not the competitor you build for on the next line. Your inbound quality problems with steel, castings and tooling sit in channels your customer is not in.
_Source: Where a plant puts its channels; Customers see their parts; Suppliers_

**Q: How are NCR containment deadlines tracked?**
A: Non-conformances are tracked items with an owner and a due time. The containment clocks are four hours to notify, same day to contain and a week to root cause, and the customer sees the same deadlines your quality manager does. An inspector posts the CMM result in the channel and one step raises the NCR, with the report attached and the batch quarantined.
_Source: NCRs, changes and downtime with a number on them; Containment clocks; A measurement becomes an NCR_

**Q: Can we control who is allowed to disposition a part?**
A: Yes, by role. An inspector raises, a quality manager dispositions, and nobody ships use-as-is without written approval. The audit log records who dispositioned what, retention follows your IATF requirement, and when a customer auditor asks how a non-conformance was handled, the channel has the measurement, the disposition, the approval and the dates.
_Source: Who may disposition; Ready for the audit_

**Q: What is the best way to start rolling it out?**
A: Start with the account that has the tightest supplier quality requirements: one channel, their SQE invited, one NCR. The next programme is built from a channel template with categories, containment times, the NCR procedure and the change-control process already there. The trial is fourteen days free on Max, every option included, no card.
_Source: Start with the demanding customer; Next programme in one step; Try it on one customer_
