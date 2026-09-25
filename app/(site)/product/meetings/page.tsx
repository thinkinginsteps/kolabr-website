import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { BadgeList, Chips, TintRows } from "@/components/product/Illustrations";
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
  ShotSection,
  SplitFeature,
  SplitFigure,
  WideCard,
} from "@/components/product/ProductSections";
import { breadcrumbJsonLd, graph, pageMetadata } from "@/lib/seo";
import { SIGNUP_PATH } from "@/lib/site";

import uiEventsDay from "@/assets/images/ui-events-day.webp";
import uiEventsPage from "@/assets/images/ui-events-page.webp";
import uiMeetingCall from "@/assets/images/ui-meeting-call.webp";
import uiScheduleModal from "@/assets/images/ui-schedule-modal.webp";

export const metadata = pageMetadata("/product/meetings/");

export default function MeetingsPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd("/product/meetings/"))} />

      <ProductHero
        title="The meetings this work needs, on one calendar"
        lede="Every channel keeps its own calendar: the day in front of you on the left, the weeks ahead on the right, synced both ways with Google and Outlook. Book a meeting, and the call, with the request it is about, starts from the same place."
      >
        <Screenshot
          preload
          className="mt-16"
          image={uiEventsPage}
          alt="Scheduled events: the selected day’s four meetings with Join buttons beside a month calendar of the channel’s events"
        />
      </ProductHero>

      <SplitFeature
        id="schedule"
        title="Scheduling is one dialog"
        lede="Title, time, duration, who is coming. Everything else, the call link, the channel notice, the reminder, is a toggle, not a second tool."
        points={[
          { title: "Attendees from the channel", body: "Pick from the people already in it, guests included. Kolabr tells you before you send whether they are all free at that time." },
          { title: "Linked to a request", body: "Attach the request the meeting is about and the call, the notes and the status change all hang off the same record." },
          { title: "Announced where it matters", body: "The channel is notified when it is booked, reminders fire before it starts, and repeats handle the standing ones." },
        ]}
        figure={
          <SplitFigure>
            <FramedImage
              width="min(470px,92%)"
              image={uiScheduleModal}
              alt="The Schedule event dialog: title, date, start, duration, type, channel, attendees, linked request, toggles for a video call and a channel notice, repeats and reminder"
            />
          </SplitFigure>
        }
      />

      <ShotSection
        id="calendar"
        title="Then you are in the room"
        lede="Join in the browser, share a screen, draw on it, raise a hand. The request the meeting was booked against sits in the header, and the recording goes back to the channel for whoever could not make it."
        image={uiMeetingCall}
        alt="A Kolabr video call in grid view: four participants, a recording indicator, the linked request in the header, and controls for mic, camera, screen share and raise hand"
      />

      <BentoSection
        id="inside-meetings"
        title="The rest of it"
        lede={
          <>
            The details that decide whether a meeting is useful a week later.
            <LedeLink href="/product/requests">See how requests carry the outcome</LedeLink>
          </>
        }
      >
        <WideCard
          title="Today’s meetings sit where the work does"
          body="The day’s list shows length, channel, who is coming and a Join button, so nobody digs through an inbox for a link two minutes before it starts."
          link={{ label: "How a channel fits together", href: "/product/channels" }}
          aside={
            <CardImage
              maxHeight={300}
              image={uiEventsDay}
              alt="The selected day's events: a standup, a client walkthrough, a document review and an escalation review, each with duration, channel, attendees and a Join button"
            />
          }
        />
        <DeepCard
          alignStart
          title="Guests join without an account"
          body="Clients, partners and suppliers open the call in a browser from the channel they are already in: the same room as your team, with the same video, screen share and whiteboard."
        >
          <DeepRows
            rows={[
              { label: "No download", value: "browser only" },
              { label: "No licence", value: "guests are free", highlight: true },
              { label: "No per-guest charge", value: "on any plan" },
              { label: "Invited by email", value: "link, then in" },
            ]}
          />
        </DeepCard>
        <PlainCard
          title="Standing meetings run themselves"
          body="Set a repeat for the weekly sync and a reminder before it starts. The channel is notified when anything is booked or moved."
        >
          <TintRows
            rows={[
              { label: "Daily support standup", value: "Weekdays 09:30" },
              { label: "Northwind weekly sync", value: "Tuesdays 14:00" },
            ]}
          />
        </PlainCard>
        <PlainCard
          title="Synced with the calendar you use"
          body="Two-way sync with Google and Outlook. Kolabr knows when people are busy elsewhere, and their other calendar shows the channel’s meetings."
        >
          <Chips items={["Google Calendar", "Outlook"]} />
        </PlainCard>
        <PlainCard
          title="The outcome does not evaporate"
          body="Raise a request before you leave the call, or write the decision into the channel’s wiki. Either way the next person finds it without asking."
        >
          <BadgeList
            items={[
              { badge: "W", text: "Payout incident: what we changed" },
              { badge: "W", text: "Replay steps for the MUR 50 floor" },
              { badge: "#", text: "TK-025430 raised from the call", accent: true },
            ]}
          />
        </PlainCard>
      </BentoSection>

      <QuestionSection
        title="Do we still need Zoom or Teams?"
        lede="Not for the calls that come out of this work. Meetings are part of the channel, so the people, the request and the record are already there."
        items={[
          { title: "Nothing for guests to install", body: "Clients and suppliers join in the browser from the channel. No account, no licence, no download before a 15-minute call." },
          { title: "Keep your all-hands elsewhere", body: "Kolabr calls are sized for working sessions: a standup, a walkthrough, an escalation review. Large webinars are not what this is for." },
          { title: "Included in the plan", body: "Calls and the channel calendar come with your team’s seats. No separate video bill, and no per-guest charge." },
        ]}
      />

      <CtaBand
        title="Have the next call in the channel."
        body="Book it against the request it is about, and see what the conversation looks like when the context is already in the room."
        primary={{ label: "Get started", href: SIGNUP_PATH }}
      />
    </>
  );
}
