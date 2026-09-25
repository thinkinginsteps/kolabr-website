import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { FloatingChip, GroupChatCard, MemberList, SkeletonLines, VideoTiles } from "@/components/product/Illustrations";
import {
  BentoSection,
  BleedImage,
  CardImage,
  DeepCard,
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

import appRequests from "@/assets/images/app-requests.webp";
import uiChannelChat from "@/assets/images/ui-channel-chat.webp";
import uiThreadCrop from "@/assets/images/ui-thread-crop.webp";

export const metadata = pageMetadata("/product/chat/");

export default function ChannelChatPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd("/product/chat/"))} />

      <ProductHero
        title="Every conversation about the work, where the work is"
        lede="One main thread with everyone in the channel, plus group chats and direct messages inside it. Clients and guests take part without paying, and any message can become a tracked request."
      >
        <Screenshot
          preload
          className="mt-16"
          image={uiChannelChat}
          alt="The Payments channel conversation: a pinned notice, messages from team members and client guests, a request created from a message, a threaded reply and a scheduled deploy review"
        />
      </ProductHero>

      <SplitFeature
        id="conversations"
        title="Three kinds of conversation, one channel"
        lede="Not everything belongs in front of the client, and not everything needs a separate tool. Channel chat gives you the room for each conversation without leaving the channel."
        points={[
          { title: "The channel conversation", body: "One thread everyone in the channel can read, team and guests alike. It is the record of the relationship, not a scroll you have to keep up with." },
          { title: "Group chats inside it", body: "Pull in the people a particular thing concerns: two of your team and the client's finance lead, say. Members are named on the chat, so nobody wonders who is reading." },
          { title: "Direct messages", body: "A quiet word with one person, still in the channel's context. No parallel inbox, no second app to check." },
        ]}
        figure={
          <SplitFigure>
            <GroupChatCard />
            <FloatingChip title="Guests included" body="Client members are marked, and see only the channels they are in." />
          </SplitFigure>
        }
      />

      <BentoSection
        id="inside-chat"
        title="What the thread can do"
        lede={
          <>
            Chat that is wired into the rest of the channel.
            <LedeLink href="/product/channels">See what a channel holds</LedeLink>
          </>
        }
      >
        <WideCard
          cardHref="/product/requests"
          title="Any message becomes a request"
          body="A client asks for something in the thread. Turn that message into a request and it gets an owner, a category, an SLA and a status, with the original conversation still attached to it. Status changes come back into the chat as they happen."
          link={{ label: "How requests work", href: "/product/requests" }}
          // Design alt said "ticket number"; Kolabr's items are requests (Dom's copy rule).
          aside={<CardImage image={appRequests} alt="A list of requests with request number, title and status columns" />}
        />
        <DeepCard
          bleed
          title="Threads for the back-and-forth"
          body="Reply on a message and the detail collapses into a thread, followed by the people who care. Send the conclusion back to the channel when it is settled."
        >
          <BleedImage
            className="mt-7 min-h-0 flex-1"
            image={uiThreadCrop}
            alt="A thread on a message: replies from team members collapsed under the original message"
          />
        </DeepCard>
        <PlainCard
          title="Start a call from the thread"
          body="Voice or video from the chat header when typing stops being enough, with screen share and a whiteboard."
        >
          <VideoTiles />
        </PlainCard>
        <PlainCard
          title="Who is here, always visible"
          body="Members are listed on the chat and in the channel, with client members marked as guests and presence shown next to each name."
        >
          <MemberList
            members={[
              { name: "Dylan Sorensen", guest: false },
              { name: "Lena Pienaar", guest: true },
            ]}
          />
        </PlainCard>
        <PlainCard
          title="Searchable history"
          body="Every thread stays with its channel, so a question from six months ago is one search away, and a new member reads the whole story from the start."
        >
          <SkeletonLines widths={["88%", "66%", "78%"]} />
        </PlainCard>
      </BentoSection>

      <QuestionSection
        title="Is this another chat app to keep open?"
        lede="No. It is the conversation layer of the work itself: the requests, meetings and wiki it talks about are in the same channel."
        items={[
          { title: "No more chasing across inboxes", body: "The decision, the file and the request it produced are in one thread, instead of split across email, WhatsApp and a task tool nobody outside your team can open." },
          { title: "Guests do not pay to talk to you", body: "Clients, partners and suppliers join by email link, free, and take part in the conversation as full members of the channels they belong to." },
          { title: "Quiet by design", body: "Conversations are scoped to a channel, not a company-wide firehose. People see the threads they are in, and nothing else." },
        ]}
      />

      <CtaBand
        title="Move one conversation in."
        body="Pick the client thread that lives in your inbox today, and see how it reads when it sits next to the work."
        primary={{ label: "Get started", href: SIGNUP_PATH }}
      />
    </>
  );
}
