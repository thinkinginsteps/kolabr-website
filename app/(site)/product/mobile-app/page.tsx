import { ButtonLink } from "@/components/ButtonLink";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { BadgeList, Chips, TintRows } from "@/components/product/Illustrations";
import { NotificationList, PhoneShot, StoreButtons } from "@/components/product/Mobile";
import {
  BentoSection,
  DeepCard,
  DeepRows,
  LedeLink,
  PlainCard,
  ProductHero,
  QuestionSection,
  ShotSection,
  SplitFeature,
  SplitFigure,
  WideCard,
} from "@/components/product/ProductSections";
import { breadcrumbJsonLd, graph, pageMetadata } from "@/lib/seo";
import { SIGNUP_PATH } from "@/lib/site";

import appMChat from "@/assets/images/app-m-chat.webp";
import appMChats from "@/assets/images/app-m-chats.webp";
import appMDash from "@/assets/images/app-m-dash.webp";
import appMEvents from "@/assets/images/app-m-events.webp";
import appMRequests from "@/assets/images/app-m-requests.webp";
import appMWiki from "@/assets/images/app-m-wiki.webp";

export const metadata = pageMetadata("/product/mobile-app/");

export default function MobileAppPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd("/product/mobile-app/"))} />

      <ProductHero
        title="The whole of Kolabr, in your pocket"
        lede="A free companion app for iOS and Android, included with every seat. The same channels, requests, chats, events and wiki: built for the times you are not at a desk."
      >
        <StoreButtons className="mt-[34px]" />
        <figure data-rise="" className="m-0 mt-16 flex flex-wrap items-end justify-center gap-[26px]">
          <PhoneShot
            preload
            image={appMDash}
            alt="The mobile channel dashboard: open requests, SLA at risk, unassigned and resolved counts, the requests assigned to you and today’s events"
          />
          <PhoneShot raised image={appMChat} alt="A channel conversation on the phone, with messages from the team and the message composer" />
          <PhoneShot image={appMEvents} alt="Events on the phone: a month calendar and the day’s three events, one live with a Join call button" />
        </figure>
      </ProductHero>

      <SplitFeature
        id="app-tour"
        title="The whole channel, not a cut-down version"
        lede="Switch channels, work the queue, answer the client, join the call. The app carries the same modules as the browser: sized for a thumb, not squeezed into a table."
        points={[
          { title: "Work the queue anywhere", body: "Filter to mine, unassigned or SLA risk, raise a request, reassign it or resolve it, from the taxi, the site visit or the queue at the airport." },
          { title: "Answer while it still matters", body: "Channel chat, group chats and direct messages, with a push notification when something is breaching or someone needs you." },
          { title: "The runbook in the field", body: "Open the channel’s wiki on the phone and follow the steps where the work is, instead of remembering them on the way back." },
        ]}
        figure={
          <SplitFigure>
            <div className="relative flex w-full justify-center">
              <PhoneShot image={appMRequests} alt="The requests list on the phone with filter chips for mine, unassigned, SLA risk and resolved" />
            </div>
          </SplitFigure>
        }
      />

      <ShotSection
        id="on-the-move"
        title="Made for the moments between desks"
        lede="On site, between meetings, on the way home. Chats with the unread counts that matter and the runbook you need, in the same app as the queue."
        figure={
          <figure data-rise="" className="m-0 flex flex-wrap justify-center gap-[26px]">
            <PhoneShot image={appMChats} alt="Chats on the phone: the channel conversation, then direct and group chats with unread badges" />
            <PhoneShot image={appMWiki} alt="A wiki runbook on the phone: a warning notice, when to use it, and numbered steps" />
          </figure>
        }
      />

      <BentoSection
        id="app-details"
        title="The details"
        lede={
          <>
            Free with your plan, and the same account you already use.
            <LedeLink href="/pricing">See what a seat costs</LedeLink>
          </>
        }
      >
        <WideCard
          title="Notifications you can trust"
          body="Push for a mention, a new request in your channel, an SLA about to breach and a call starting. Per channel, so the quiet ones stay quiet."
          link={{ label: "How a channel fits together", href: "/product/channels" }}
          aside={
            <NotificationList
              items={[
                { icon: "!", tone: "alert", title: "#4821 breaches in 42m", body: "Northwind Trading · assigned to you", smallBody: true },
                { icon: "@", tone: "accent", title: "Simone mentioned you", body: "“Any update on the export bug?”" },
                { icon: "▶", tone: "ink", title: "Northwind weekly sync is live", body: "4 attending · tap to join", smallBody: true },
              ]}
            />
          }
        />
        <DeepCard
          alignStart
          title="Free, on both stores"
          body="The app is included with every Kolabr seat: nothing to buy, nothing to add on. Sign in with the account you already have and your channels are there."
        >
          <DeepRows
            rows={[
              { label: "iOS", value: "iPhone · iOS 16+" },
              { label: "Android", value: "Android 10+", highlight: true },
              { label: "Included", value: "with every seat" },
              { label: "Guests too", value: "free, as always" },
            ]}
          />
        </DeepCard>
        <PlainCard
          title="Switch channels in a tap"
          body="The channel switcher sits at the top of every screen, so moving from one client to the next takes a tap and nothing is mixed up between them."
        >
          <TintRows
            rows={[
              { label: "Northwind Trading", value: "7 open" },
              { label: "Acme Logistics", value: "3 open" },
            ]}
          />
        </PlainCard>
        <PlainCard
          title="Calls from the phone"
          body="Join a channel meeting from the Events tab while the call is live: audio or video, no separate app to install."
        >
          <Chips wrap atBottom={false} items={["Join live calls", "Audio or video", "Linked requests"]} />
        </PlainCard>
        <PlainCard
          title="Nothing to set up"
          body="Install it, sign in, and the channels you belong to are already there, including the ones a client invited you into this morning."
        >
          <BadgeList
            items={[
              { badge: "1", text: "Download the app" },
              { badge: "2", text: "Sign in with your Kolabr account" },
              { badge: "✓", text: "Your channels are waiting", accent: true },
            ]}
          />
        </PlainCard>
      </BentoSection>

      <QuestionSection
        title="Does it cost extra?"
        lede="No. The app is part of Kolabr, for your team and for the guests you invite, on both platforms."
        items={[
          { title: "Guests get it too", body: "A client you invited can follow their requests and answer from their phone, without an account or a licence of their own." },
          { title: "A companion, not a replacement", body: "Heavy administration, analytics and playbook editing stay in the browser. The phone is for the work that cannot wait until you are back." },
          { title: "Same data, same rules", body: "Members see only the channels they belong to, on the phone exactly as in the browser. Nothing is cached where it should not be." },
        ]}
      />

      <CtaBand
        title="Take the whole thing with you."
        body="Free with every seat, on iOS and Android."
        actions={
          <>
            <StoreButtons align="center" />
            <div className="flex flex-wrap justify-center gap-3">
              <ButtonLink href={SIGNUP_PATH} variant="tint" size="lg">
                Get started
              </ButtonLink>
              <ButtonLink href="/contact" variant="secondary" size="lg" className="[--lift-shadow:none]">
                Talk to us
              </ButtonLink>
            </div>
          </>
        }
      />
    </>
  );
}
