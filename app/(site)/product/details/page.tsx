import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { PresenceList } from "@/components/product/Illustrations";
import {
  BentoSection,
  BleedImage,
  CardImage,
  FramedImage,
  PlainCard,
  ProductHero,
  QuestionSection,
  SplitFeature,
  SplitFigure,
  WideCard,
} from "@/components/product/ProductSections";
import { RevealSlider } from "@/components/product/RevealSlider";
import { UnderlineLink } from "@/components/UnderlineLink";
import { breadcrumbJsonLd, graph, pageMetadata } from "@/lib/seo";
import { SIGNUP_PATH } from "@/lib/site";

import uiChannelDashboard from "@/assets/images/ui-channel-dashboard.webp";
import uiDashDark from "@/assets/images/ui-dash-dark.webp";
import uiPopAccount from "@/assets/images/ui-pop-account.webp";
import uiPopChats from "@/assets/images/ui-pop-chats.webp";
import uiPopNotifications from "@/assets/images/ui-pop-notifications.webp";

export const metadata = pageMetadata("/product/details/");

export default function DetailsPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd("/product/details/"))} />

      <ProductHero
        title="The things you notice on day two"
        lede="None of these will sell you a platform. They are the reason people stop minding that they have to use one: light and dark mode, several accounts at once, and everything you check twenty times a day one click from where you are."
      >
        <figure data-rise="" className="m-0 mt-14 flex flex-col gap-4">
          <RevealSlider
            light={uiChannelDashboard}
            dark={uiDashDark}
            lightAlt="The Kolabr dashboard in light mode"
            darkAlt="The same dashboard in dark mode"
          />
          <figcaption className="flex justify-between gap-4 text-[14px] font-semibold text-ink-muted">
            <span>Light</span>
            <span className="font-normal">Drag to switch</span>
            <span>Dark</span>
          </figcaption>
        </figure>
      </ProductHero>

      <SplitFeature
        id="accounts"
        title="Several accounts, one app"
        lede="Most people end up with more than one Kolabr identity: the seat their employer pays for, and the guest account a supplier invited them into. Add them all and switch in a tap, without signing out of anything."
        points={[
          { title: "Add as many as you need", body: "Not just two. A staff seat, a guest account at one client, another at a supplier, each with its own channels and notifications." },
          { title: "Nothing bleeds across", body: "Guest accounts are marked as such, and each one sees only its own channels. Switching is a context change, not a merge." },
          { title: "Leave together, if you like", body: "Sign out of one, or out of all of them at once on a shared machine." },
        ]}
        figure={
          <SplitFigure minHeight={600}>
            <FramedImage
              width="min(400px,92%)"
              image={uiPopAccount}
              alt="The account menu: presence set to Available, links to account, security, notifications and help, another account marked as a guest with a Switch action, and Add another account"
            />
          </SplitFigure>
        }
      />

      <BentoSection id="little-things" title="And the rest of the small print" lede="Things that take a second each and save one every time.">
        <WideCard
          narrowAside
          title="Notifications that say what happened"
          body="An SLA about to breach, someone joining a channel, a request assigned to you, a resolution rated. Named, timed and one click from anywhere in the app, with mark-all-read for the mornings you come back to forty of them."
          aside={
            <CardImage
              image={uiPopNotifications}
              alt="The notifications panel: an SLA at risk, a member joining, an assigned request, a resolved request rated 5 out of 5 and new replies in a group chat"
            />
          }
        />
        <PlainCard
          alignStart
          bleed
          title="Chats without leaving the page"
          body="The same popover for conversations, with an unread filter for when you only want the ones still waiting on you."
        >
          <BleedImage
            shadow="light"
            className="mt-2.5"
            image={uiPopChats}
            alt="The active chats panel with a search box, an unread toggle and four conversations"
          />
        </PlainCard>
        <PlainCard
          alignStart
          title="Presence you set yourself"
          body="Available, busy, away. Set it on your account and everyone in your channels sees it beside your name."
        >
          <PresenceList />
        </PlainCard>
        <PlainCard
          alignStart
          title="Dark mode that is actually dark"
          body="Not a grey filter over a white app. Charts, badges and status colours are drawn for both themes, and the switch is in the header where you can find it at 11pm."
        />
      </BentoSection>

      <QuestionSection
        title="Why spend time on this?"
        lede="Because people live in this thing for eight hours a day. The small courtesies are what stop a tool from being resented."
        items={[
          { title: "Fewer tabs", body: "Notifications, chats and account switching are all in the header, so the work you were doing stays on screen." },
          { title: "Yours to set", body: "Theme and presence are personal settings, not company policy, unless an admin decides otherwise." },
          {
            title: "Same on the phone",
            body: (
              <>
                The{" "}
                <UnderlineLink href="/product/mobile-app" inline>
                  companion app
                </UnderlineLink>{" "}
                follows the same theme and the same accounts.
              </>
            ),
          },
        ]}
      />

      <CtaBand
        title="Have a look for yourself."
        body="Two weeks, no card. Switch it to dark mode in the first minute."
        primary={{ label: "Get started", href: SIGNUP_PATH }}
      />
    </>
  );
}
