import { ButtonLink } from "@/components/ButtonLink";
import { CtaBand } from "@/components/CtaBand";
import { HeroStack } from "@/components/home/HeroStack";
import {
  AudienceCard,
  Checklist,
  CompareLogoGrid,
  DiscoverGrid,
  LinkTiles,
  StepCards,
} from "@/components/home/HomeSections";
import { JsonLd } from "@/components/JsonLd";
import { UnderlineLink } from "@/components/UnderlineLink";
import { Logo } from "@/components/Logo";
import { PricingPlans } from "@/components/PricingPlans";
import { TrialBanner } from "@/components/TrialBanner";
import { Container, Eyebrow, Kicker, Section } from "@/components/Section";
import { compare, megaMenu, product } from "@/lib/navigation";
import { breadcrumbJsonLd, graph, organizationJsonLd, pageMetadata, websiteJsonLd } from "@/lib/seo";
import { SIGNUP_PATH } from "@/lib/site";

import uiCall from "@/assets/images/ui-call.webp";
import uiChat from "@/assets/images/ui-chat.webp";
import uiDashboard from "@/assets/images/ui-dashboard.webp";
import uiEvents from "@/assets/images/ui-events.webp";
import logoBasecamp from "@/assets/images/logo-basecamp.webp";
import logoClickup from "@/assets/images/logo-clickup.webp";
import logoNotion from "@/assets/images/logo-notion.webp";
import logoSlack from "@/assets/images/logo-slack.webp";
import logoTeams from "@/assets/images/logo-teams.webp";
import logoZendesk from "@/assets/images/logo-zendesk.webp";

export const metadata = pageMetadata("/");

const h2 = "text-[clamp(34px,3.7vw,54px)] leading-[1.04] font-semibold tracking-[-0.03em] text-balance text-ink";
const lede = "text-[20px] leading-normal text-pretty text-ink-muted";

export default function HomePage() {
  return (
    <>
      <JsonLd data={graph(organizationJsonLd, websiteJsonLd, breadcrumbJsonLd("/"))} />

      {/* Hero */}
      <section
        aria-labelledby="hero-h"
        className="relative flex min-h-svh items-center overflow-hidden bg-hero-glow pt-[clamp(92px,11svh,128px)] pb-[clamp(28px,5svh,56px)] max-tab:pt-[124px] max-tab:pb-0"
      >
        <div className="mx-auto grid w-full max-w-[1480px] grid-cols-1 items-center gap-12 px-10 max-tab:px-5 desk:grid-cols-[minmax(0,.92fr)_minmax(0,1.08fr)] desk:gap-[35px]">
          <div className="@container relative z-2 flex max-w-[600px] flex-col gap-[26px]">
            <span className="glass-soft inline-flex items-center gap-[9px] self-start rounded-full py-[7px] pr-[15px] pl-[11px] text-[14px] font-semibold text-ink shadow-subtle">
              <span aria-hidden="true" className="size-2 animate-pulse-ring rounded-full bg-accent" />
              Pay for your team, not your clients
            </span>
            <h1
              id="hero-h"
              className="flex flex-col text-[clamp(30px,11cqw,78px)] leading-[0.98] font-extrabold tracking-[-0.045em] text-ink [&>span]:text-[min(76px,10.6cqw)] [&>span]:whitespace-nowrap"
            >
              <span>Shared workspace</span>
              <span>for your team and</span>
              <span>your clients.</span>
            </h1>
            <p className="max-w-[520px] text-[20.5px] leading-normal text-pretty text-ink-muted">
              Kolabr is a collaboration app that puts your team and the clients, partners and suppliers you work with in
              one shared channel, with the chat, the requests it creates, the meetings about it and the wiki it leaves
              behind all in the same place.
            </p>
            <div className="flex flex-wrap gap-3 pt-1.5">
              <ButtonLink href={SIGNUP_PATH} size="lg">
                Start free trial
              </ButtonLink>
              <ButtonLink href="/#features-h" variant="secondary" size="lg">
                Learn more
              </ButtonLink>
            </div>
            <p className="text-[15px] text-ink-muted">You pay only for your team users. Guests are invited for free.</p>
          </div>

          <HeroStack
            shots={[
              { label: "Dashboard", image: uiDashboard, alt: "The Kolabr dashboard: request totals, SLA at risk, request volume and assigned requests" },
              { label: "Scheduled events", image: uiEvents, alt: "Scheduled events: the day’s meetings beside a month calendar" },
              { label: "Group Chat 1", image: uiChat, alt: "A group chat in the channel with a request moved to In progress" },
              { label: "Video call", image: uiCall, alt: "A video call inside the channel, linked to request TK-025430" },
            ]}
          />
        </div>
      </section>

      {/* Main features */}
      <Section tint aria-labelledby="features-h" className="relative overflow-hidden py-[140px]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-features-glow" />
        <Container className="relative">
          <div data-rise="" className="mb-14 flex max-w-[1240px] flex-col gap-5">
            <Eyebrow>Main features</Eyebrow>
            <h2
              id="features-h"
              className="flex flex-wrap items-baseline gap-x-[.5em] gap-y-[.1em] text-[clamp(34px,3.9vw,58px)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance text-ink"
            >
              <span className="min-w-0 flex-[1_1_380px]">One project should not need four different tools.</span>
              <span className="flex flex-[0_1_auto] items-baseline gap-[.16em] whitespace-nowrap">
                <Logo className="h-[.66em] w-auto translate-y-[.02em]" /> does it all.
              </span>
            </h2>
            <p className="max-w-[880px] text-[19.5px] leading-[1.55] text-pretty text-ink-muted">
              Kolabr gives your work its own shared channels: one per project, or as many as it takes. The conversation,
              the work it creates, the meetings about it and the notes that come out of them all sit in one place. Your
              team is in it, and so are the clients, partners or other departments the project depends on, so nobody has
              to be forwarded anything.
            </p>
          </div>

          <StepCards
            steps={[
              { kicker: "Ask", title: "A client message, not an email thread", body: "Your client writes in the channel instead of emailing three people. Everyone who needs to see it already can." },
              { kicker: "Track", title: "Any message becomes a tracked request", body: "One click turns it into a work item with an owner, a category and an SLA, so nothing lives or dies in someone’s inbox." },
              { kicker: "Decide", title: "Meetings happen where the work is", body: "Schedule and run the call from the channel. Notes and decisions land on the request they belong to." },
              { kicker: "Keep", title: "The history stays, the people change", body: "Every answer, file and decision stays in the channel. New joiners read it instead of asking for it." },
            ]}
          />

          <div data-rise="" className="my-24 grid grid-cols-1 items-start gap-12 desk:grid-cols-[minmax(0,1fr)_minmax(0,.9fr)] desk:gap-11">
            <div className="flex flex-col gap-2.5">
              <Kicker>Guest accounts</Kicker>
              <h3 className="text-[clamp(24px,2.2vw,31px)] leading-[1.1] font-semibold tracking-[-0.025em] text-balance text-ink">
                Your clients get a free guest account
              </h3>
              <p className="text-[16.5px] leading-[1.55] text-pretty text-ink-muted">
                Anyone outside your company joins from an email link as a guest. A guest account is limited to the
                channels they are invited to: they take part in the chat, raise and follow requests, join meetings and
                read the wiki there, and see nothing else of your workspace. Guest accounts are free, so you are only ever
                billed for your own team.
              </p>
              <UnderlineLink href="/#free" className="mt-1.5 text-[15.5px]">
                How guest accounts work
              </UnderlineLink>
            </div>
            <Checklist
              title="In a guest account"
              items={[
                { ok: true, text: "Chat, requests, meetings and wiki in the channels they are invited to" },
                { ok: true, text: "Their own login, no software to install" },
                { ok: false, text: "No access to your other channels or your workspace settings" },
                { ok: false, text: "No licence, no card, nothing to pay" },
              ]}
            />
          </div>

          <div id="free" data-rise="" className="relative overflow-hidden rounded-[36px] bg-deep p-[clamp(40px,4.4vw,72px)] text-on-deep-muted">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-deep-glow"
            />
            <div className="relative grid grid-cols-1 items-center gap-12 desk:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] desk:gap-16">
              <div data-rise="" className="flex max-w-[580px] flex-col gap-6">
                <Eyebrow onDark>The difference</Eyebrow>
                <h2 className="text-[clamp(36px,4.1vw,60px)] leading-[1.02] font-semibold tracking-[-0.035em] text-balance text-on-deep">
                  Who pays for the guests you invite?
                </h2>
                <p className="text-[21px] leading-[1.45] text-on-deep">
                  Nobody. You pay for your team, and the guests you invite join free.
                </p>
                <p className="text-[17.5px] text-pretty">
                  Users hold a paid Kolabr account and are your own team. Guests join by email link, a client, a partner, a
                  supplier or another department, and work inside the channels they are invited to at no charge. Each
                  channel has a member limit set by your plan, so you decide who belongs in it.
                </p>
                <p className="text-[17.5px] text-pretty">So bringing the right people into a project never adds to the bill.</p>
                <UnderlineLink href="/pricing" onDark>
                  See pricing
                </UnderlineLink>
              </div>
              <div data-rise="" className="flex flex-col gap-4">
                <AudienceCard kind="users" label="Users" title="Your team" body="Paid accounts. They create channels, set roles, and run administration and analytics." />
                <AudienceCard
                  kind="guests"
                  label="Guests, free"
                  title="Everyone else"
                  body="Clients, partners, suppliers, other departments. They work in the channels they are invited to, at no charge."
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Discover */}
      <Section aria-labelledby="discover-h" className="py-[140px]">
        <Container>
          <div data-rise="" className="mb-[52px] flex max-w-[820px] flex-col gap-[18px]">
            <Eyebrow>Discover Kolabr</Eyebrow>
            <h2 id="discover-h" className={h2}>
              Take a closer look at what you get
            </h2>
            <p className={lede}>Start with the channel, then look at what sits inside it and what runs around it.</p>
          </div>
          <DiscoverGrid
            items={[
              { title: "Channels", body: product.channels.blurb, href: product.channels.href },
              { title: "Channel chat", body: "One conversation for the channel, plus direct and group chats", href: product.chat.href },
              { title: "Requests", body: "Work items with an owner, a category, an SLA and a status", href: product.requests.href },
              { title: "Meetings", body: "Calls with screen share and a shared whiteboard", href: product.meetings.href },
              { title: "Scheduled Events", body: "A channel calendar, synced with Google and Outlook", href: product.meetings.href },
              { title: "Wiki", body: "A knowledge base that lives inside the channel", href: product.wiki.href },
              { title: "Administration", body: "Roles, routing, playbooks and the audit log", href: product.administration.href },
            ]}
          />
        </Container>
      </Section>

      {/* Pricing */}
      <Section tint id="pricing" aria-labelledby="pricing-h" className="py-[130px]">
        <Container>
          <div data-rise="" className="mb-[22px] flex max-w-[820px] flex-col gap-[18px]">
            <Eyebrow>Pricing</Eyebrow>
            <h2 id="pricing-h" className={h2}>
              Pay for your team, invite everyone else
            </h2>
            <p className={lede}>
              Start with 14 days free on Max, every option included, no card needed. Then pick the size that fits your
              team, and change it whenever.
            </p>
          </div>
          <PricingPlans />
          <TrialBanner>
            {" "}
            <UnderlineLink href="/pricing#compare-plans" inline>
              See the full feature comparison
            </UnderlineLink>
            .
          </TrialBanner>
        </Container>
      </Section>

      {/* Use cases */}
      <Section id="use-cases" aria-labelledby="cases-h" className="py-[130px]">
        <Container>
          <div data-rise="" className="mb-[50px] flex max-w-[780px] flex-col gap-[18px]">
            <Eyebrow>Use cases</Eyebrow>
            <h2 id="cases-h" className={h2}>
              Built for teams whose work involves other people
            </h2>
            <p className={lede}>See how Kolabr is set up for your industry.</p>
          </div>
          <div className="mb-[38px]">
            <LinkTiles links={megaMenu.useCases} />
          </div>
        </Container>
      </Section>

      {/* Compare */}
      <Section tint aria-labelledby="compare-h" className="py-[120px]">
        <Container className="flex flex-col gap-9">
          <div data-rise="" className="flex max-w-[640px] flex-col gap-3.5">
            <h2 id="compare-h" className="text-[clamp(28px,3vw,40px)] leading-[1.08] font-semibold tracking-[-0.03em] text-ink">
              How does Kolabr compare?
            </h2>
            <p className="text-[17.5px]">Fair, specific comparisons, including where the other tool is the better choice.</p>
          </div>
          <CompareLogoGrid
            items={[
              { name: "Slack", logo: logoSlack, alt: "Slack", href: compare.slack.href },
              { name: "Teams", logo: logoTeams, alt: "Microsoft Teams", href: compare.teams.href },
              { name: "Basecamp", logo: logoBasecamp, alt: "Basecamp", href: compare.basecamp.href },
              { name: "Notion", logo: logoNotion, alt: "Notion", href: compare.notion.href },
              { name: "ClickUp", logo: logoClickup, alt: "ClickUp", href: compare.clickup.href },
              { name: "Zendesk", logo: logoZendesk, alt: "Zendesk", href: compare.zendesk.href },
            ]}
          />
        </Container>
      </Section>

      <CtaBand
        title="Start with one channel."
        body="Pick one project, invite the people involved, and see how it feels when everything is in one place."
      />
    </>
  );
}
