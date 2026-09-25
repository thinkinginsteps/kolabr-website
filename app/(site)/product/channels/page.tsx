import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { ChatBubbles, SkeletonLines, VideoTiles } from "@/components/product/Illustrations";
import {
  BentoSection,
  CardImage,
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
import { breadcrumbJsonLd, graph, pageMetadata, softwareApplicationJsonLd } from "@/lib/seo";
import { SIGNUP_PATH } from "@/lib/site";

import appRequests from "@/assets/images/app-requests.webp";
import uiChannelDashboard from "@/assets/images/ui-channel-dashboard.webp";
import uiChannelSwitcher from "@/assets/images/ui-channel-switcher.webp";

export const metadata = pageMetadata("/product/channels/");

export default function ChannelsPage() {
  return (
    <>
      {/* Channels stands in for the product overview until a /product page exists. */}
      <JsonLd data={graph(softwareApplicationJsonLd, breadcrumbJsonLd("/product/channels/"))} />

      <ProductHero
        title="Everything a channel is, and everything it holds"
        lede="A shared workspace for a project, or any slice of it, with the chat, the requests, the meetings and the wiki in one place, open to your team and the guests you invite."
      >
        <Screenshot
          preload
          className="mt-16"
          image={uiChannelDashboard}
          alt="A channel dashboard: request counts, request volume chart, CSAT average and the assigned request list, with the channel's modules and members in the sidebar"
        />
      </ProductHero>

      <SplitFeature
        id="channels"
        title="What is a channel?"
        lede="A shared workspace for a project, or any slice of it, and everyone involved. Your team is in it. So are the clients, partners, suppliers or other departments the work is for."
        points={[
          { title: "You decide what a channel covers", body: "A client account, a project, a workstream inside it, a department's intake, a supplier relationship. Create as many as the work needs." },
          { title: "Everyone involved is a member", body: "Your team holds Kolabr accounts. Anyone else joins by email link, free, and sees only the channels they belong to." },
          { title: "The whole job stays in it", body: "A message becomes a request. The request gets a meeting. The meeting leaves notes in the Wiki." },
        ]}
        figure={
          <SplitFigure align="start">
            <FramedImage
              float
              centered
              width="min(480px,92%)"
              image={uiChannelSwitcher}
              alt="The channel switcher open, listing every channel a member belongs to"
            />
          </SplitFigure>
        }
      />

      <BentoSection
        id="product"
        title="What does each channel hold?"
        lede={
          <>
            Four modules that talk to each other, plus a channel calendar.
            <LedeLink href="/product/channels#product">See the product overview</LedeLink>
          </>
        }
      >
        <WideCard
          cardHref="/product/requests"
          title="Requests"
          body="Structured work items with an owner, a category, an SLA and a status. Any message in the channel can be turned into one, and everyone in the channel can see where it stands."
          link={{ label: "Requests in a channel", href: "/product/requests" }}
          // Design alt said "ticket number"; Kolabr's items are requests (Dom's copy rule).
          aside={<CardImage image={appRequests} alt="A list of requests with request number, title and status columns" />}
        />
        <DeepCard title="Scheduled Events" body="A channel calendar, synced with Google and Outlook, with requests linked to their dates.">
          <DeepRows
            stacked
            rows={[
              { label: "Northwind weekly sync", value: "Today 14:00 · 4 attending" },
              { label: "Escalation review", value: "Tomorrow 15:30 · linked to #4804", highlight: true },
              { label: "Site walkthrough", value: "Friday 09:00 · Acme Logistics" },
              { label: "Quarterly review", value: "2 October · 6 attending" },
            ]}
          />
        </DeepCard>
        <PlainCard
          href="/product/chat"
          linkLabel="Chat in a channel"
          title="Channel chat"
          body="One main conversation with everyone in the channel, plus direct messages and custom group chats inside it."
        >
          <ChatBubbles incoming="Can you send the revised quote?" outgoing="Sent. It's in the Wiki too." />
        </PlainCard>
        <PlainCard
          href="/product/meetings"
          linkLabel="Meetings in a channel"
          title="Meetings"
          body="Video calls started from the channel, with screen share and a whiteboard overlay. Link a meeting to the request it is about."
        >
          <VideoTiles />
        </PlainCard>
        <PlainCard
          href="/product/wiki"
          linkLabel="Wiki in a channel"
          title="Wiki"
          body="A knowledge base inside the channel, for that channel. Decisions, specs and how-tos sit next to the work they describe."
        >
          <SkeletonLines title="Design decisions" widths={["92%", "74%", "84%"]} />
        </PlainCard>
      </BentoSection>

      <QuestionSection
        title="Does it work inside one company too?"
        lede="Yes. A channel works the same way whether everyone in it shares your email domain or not."
        items={[
          { title: "Within your team", body: "Internal IT, HR, facilities, procurement. One department runs the channel and the rest of the company is invited in. Requests get owners and SLAs, the Wiki holds the how-tos." },
          { title: "Across companies", body: "A firm and its clients, a school and its families, a manufacturer and its suppliers. Each relationship gets a channel, and the people in it work with you without paying." },
          { title: "Both at once", body: "Most teams do both. Kolabr scales from a small school to a large enterprise, and the channel model does not change on the way up." },
        ]}
      />

      <CtaBand
        title="Start with one channel."
        body="Pick one project, invite the people involved, and see how it feels when everything is in one place."
        primary={{ label: "Get started", href: SIGNUP_PATH }}
      />
    </>
  );
}
