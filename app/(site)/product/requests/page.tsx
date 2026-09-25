import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { Bars, PlaybookSteps, QueueList, StatusPills } from "@/components/product/Illustrations";
import {
  BentoSection,
  CardPanel,
  DeepCard,
  DeepRows,
  FramedImage,
  LedeLink,
  PlainCard,
  ProductHero,
  QuestionSection,
  Screenshot,
  SplitFeature,
  SplitFigure,
  WideCard,
} from "@/components/product/ProductSections";
import { breadcrumbJsonLd, graph, pageMetadata } from "@/lib/seo";
import { SIGNUP_PATH } from "@/lib/site";

import uiRequestDetail from "@/assets/images/ui-request-detail.webp";
import uiRequestsList from "@/assets/images/ui-requests-list.webp";

export const metadata = pageMetadata("/product/requests/");

export default function RequestsPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd("/product/requests/"))} />

      <ProductHero
        title="Every ask becomes a request with an owner and a clock"
        lede="A request is the unit of work in a channel: a title, an owner, a category, a priority and an SLA. It starts as a message and ends with a status everyone in the channel can see, including the client who asked."
      >
        <Screenshot
          preload
          className="mt-16"
          image={uiRequestsList}
          // Design alt said "ticket number"; Kolabr's items are requests (Dom's copy rule).
          alt="The Requests list: request number, title, status, priority, owner, assigned team, channel, category, SLA state and created date for ten requests"
        />
      </ProductHero>

      <SplitFeature
        id="anatomy"
        title="What a request carries"
        lede="Enough structure to run the work, and not so much that nobody fills it in. Every request opens with the conversation on the left and the facts on the right."
        points={[
          { title: "An owner and a team", body: "One person accountable, plus the team it is assigned to. Participants are listed with their role, so the client can see who is on it." },
          { title: "A category and a priority", body: "Set on the request and used everywhere else: routing, reporting and the SLA that applies. Change either one and the record keeps the history." },
          { title: "A first-response and resolution clock", body: "On track, at risk or breached, with the time left shown on the request and in the channel's dashboard. Auto-close rules end the ones that go quiet." },
        ]}
        figure={
          <SplitFigure align="start" wide>
            <FramedImage
              plainShadow
              width="min(1040px,138%)"
              sizes="(max-width: 1080px) 100vw, 1040px"
              image={uiRequestDetail}
              alt="An open request: the thread of replies on the left, and details on the right showing status, priority, category, owner, assignee, SLA timings, playbook and participants"
            />
          </SplitFigure>
        }
      />

      <BentoSection
        id="inside-requests"
        title="How a request moves"
        lede={
          <>
            From a line in the chat to a closed record, without anyone re-typing it.
            <LedeLink href="/product/chat">See where they start</LedeLink>
          </>
        }
      >
        <WideCard
          title="One list for everything open"
          body="Filter by status, search every column, sort by SLA and export what you need. Tabs for New, Waiting, Resolved and Closed mean the queue answers the only question that matters: what needs me next?"
          link={{ label: "Requests live in a channel", href: "/product/channels" }}
          aside={
            <CardPanel className="px-5 py-[18px]">
              <QueueList
                rows={[
                  { id: "TK-025411", title: "Payment issue in prod", status: "New", sla: "Breached" },
                  { id: "TK-025418", title: "Refund stuck 3 days", status: "New", sla: "At risk" },
                  { id: "TK-025416", title: "Settlement report short", status: "Waiting", sla: "Breached" },
                  { id: "TK-025413", title: "Webhook retries firing twice", status: "Waiting", sla: "At risk" },
                  { id: "TK-025412", title: "Card tokenisation on Safari", status: "New", sla: "On track" },
                ]}
              />
            </CardPanel>
          }
        />
        <DeepCard
          title="SLAs, per category"
          body="Set the first-response and resolution targets each category deserves. The clock starts when the request is raised and shows on every view."
        >
          <DeepRows
            atBottom
            rows={[
              { label: "Payment gateway", value: "1h / 4h" },
              { label: "Reconciliation", value: "4h / 2d", highlight: true },
              { label: "Onboarding", value: "1d / 5d" },
            ]}
          />
        </DeepCard>
        <PlainCard
          title="Playbooks on repeat work"
          body="Onboarding, an access request, a monthly reconciliation: deploy a playbook and the steps, owners and due dates are filled in for you."
        >
          <PlaybookSteps
            steps={[
              { text: "Collect merchant details", done: true },
              { text: "Provision test keys", done: true },
              { text: "Go-live sign-off", done: false },
            ]}
          />
        </PlainCard>
        <PlainCard
          title="The client sees the status"
          body="No “any update?” emails. Guests in the channel read the same status, owner and SLA as your team, on the requests they are part of."
        >
          <StatusPills items={["New", "Waiting", "In progress", "Resolved", "Closed"]} />
        </PlainCard>
        <PlainCard
          title="Numbers you can hold someone to"
          body="SLA attainment, volume by category, median age and CSAT after resolution, per channel, per team, per client."
        >
          <Bars
            bars={[
              { height: 38, strong: false },
              { height: 52, strong: true },
              { height: 30, strong: false },
              { height: 64, strong: true },
              { height: 46, strong: false },
              { height: 58, strong: true },
              { height: 72, strong: true },
            ]}
          />
        </PlainCard>
      </BentoSection>

      <QuestionSection
        title="Is this a helpdesk, or a task manager?"
        lede="Neither. There is no ticket portal and no separate agent tool: requests sit in the channel next to the chat, the meetings and the wiki they belong to. And there are no free-standing task lists, because every task belongs to a request."
        items={[
          { title: "No portal to log into", body: "Clients raise and follow requests in the channel they already talk to you in. Nothing to teach them, nothing for them to forget the password to." },
          { title: "Works for internal queues too", body: "IT, HR, facilities and procurement run the same way: a channel for the department, requests with owners and SLAs, the rest of the company invited in." },
          { title: "Tasks, without a task manager", body: "A request carries its own checklist, assigned and ticked off as the work moves, and those tasks close when the request closes. Nothing floats free, nothing needs grooming, and what is outstanding for a client is simply the list of open requests." },
          { title: "One price, not a per-agent bill", body: "You pay for your team. The people raising requests, clients, suppliers, colleagues from other departments, join free." },
        ]}
      />

      <CtaBand
        title="Put one queue in a channel."
        body="Take the requests that arrive by email today and give them an owner, a category and a clock."
        primary={{ label: "Get started", href: SIGNUP_PATH }}
      />
    </>
  );
}
