import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { HeroLede, PageHero } from "@/components/PageHero";
import { UnderlineLink } from "@/components/UnderlineLink";
import { breadcrumbJsonLd, graph, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/about/");

const H2 = "text-[clamp(34px,3.7vw,54px)] leading-[1.04] font-semibold tracking-[-0.03em] text-balance text-ink";
const BAND = "px-10 pt-0 pb-[150px] max-tab:!px-5 max-tab:!py-[86px]";

const broken = [
  {
    title: "The client is the one on email",
    body: "The people who matter most to the work, the client, the contractor, the parent, the funder, are the ones the tool cannot accommodate. So they get email, and the work splits in two.",
  },
  {
    title: "It all lives in one person’s head",
    body: "The account manager knows what was promised. The engineer knows why the detail changed. When they leave, it leaves with them, because none of it was ever written anywhere findable.",
  },
  {
    title: "Nobody can say what is outstanding",
    body: "Requests arrive as messages, favours and corridor conversations. Without an owner and a date they are not tracked, they are just remembered, badly, and by one person.",
  },
  {
    title: "Per-seat pricing punishes the point",
    body: "Charge for every outsider and firms ration access to the people they most need in the room. The pricing model quietly decides how the work gets done, and it decides wrong.",
  },
];

const values = [
  {
    title: "Guests are never billed",
    body: "On any plan, for any number of people. Clients, contractors, parents and funders cost nothing, because a product that charges you to include them is arguing against its own purpose. It is the most expensive decision we have made and the one we would defend first.",
  },
  {
    title: "A channel is a place, not a chat",
    body: "Conversation, requests, the calendar and the knowledge behind them, inside one boundary with one membership. Separate those and you get four tools, four logins, and four different answers to what is going on.",
  },
  {
    title: "Written beats remembered",
    body: "A message is not a record. Decisions that carry money, time or liability should have a name and a date on them, and still be findable in two years when somebody disputes them.",
  },
  {
    title: "Boring where it matters",
    body: "Retention, audit logs, access control and archiving are not an enterprise upsell. They are what makes the record worth keeping, so they are in the product rather than in a sales conversation.",
  },
  {
    title: "We will say when we are not the fit",
    body: "If you need a contact centre, a project planner or a company intranet, we will tell you and point you somewhere sensible. A bad fit costs us a year and costs you more than that.",
  },
];

const wont = [
  {
    title: "Engagement metrics",
    body: "We do not measure how long you spend in Kolabr, and we would not celebrate it if it went up. Time in a tool is a cost to you, not a win for us.",
  },
  {
    title: "Notifications designed to pull you back",
    body: "Alerts exist so the right person sees the right thing. Not to build a habit, not to defend a daily-active number.",
  },
  {
    title: "AI that writes to your client for you",
    body: "Summarising a long thread is useful. Generating the message you send a client in your own name is not something we want to be responsible for.",
  },
  {
    title: "Per-guest pricing, ever",
    body: "Not as a future tier, not as an enterprise add-on. If that changes the whole argument changes with it.",
  },
];

function SectionHead({ id, title, lede, className }: { id: string; title: string; lede: string; className: string }) {
  return (
    <div data-rise="" className={`flex max-w-[780px] flex-col gap-5 ${className}`}>
      <h2 id={id} className={H2}>
        {title}
      </h2>
      <p className="text-[20px] text-pretty">{lede}</p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd("/about/"))} />
      <PageHero
        id="ab-hero"
        eyebrow="About Kolabr"
        title="Collaboration software was built for the inside of a company. Most work is not."
        width={900}
        gap="gap-[22px]"
        bottom="pb-[130px]"
      >
        <HeroLede width="max-w-[740px]">
          Every tool in this category assumes one payroll, one directory, one email domain. It is a reasonable assumption and it is
          wrong for most of the work that actually happens, which runs between an architect and a contractor, a school and a parent,
          an agency and a client, a firm and the people it serves.
        </HeroLede>
        <HeroLede width="max-w-[740px]">
          Everyone outside the company gets email, or a guest seat somebody has to pay for and therefore rations. We started Kolabr
          because that gap is where the work goes wrong, and because closing it properly means changing what you charge for, not
          adding a feature.
        </HeroLede>
      </PageHero>

      <section id="broken" aria-labelledby="ab-br-h" className={BAND}>
        <div className="mx-auto max-w-content">
          <SectionHead
            id="ab-br-h"
            title="What we think is broken"
            lede="Not opinions about software. Four things we have watched happen in every firm we have spoken to."
            className="mb-14"
          />
          <div data-rise-group="" className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[18px] max-tab:grid-cols-1">
            {broken.map((c) => (
              <div key={c.title} data-rise="" className="flex flex-col gap-3.5 rounded-3xl bg-surface p-[34px] text-ink shadow-subtle">
                <h3 className="text-[23px] font-semibold tracking-[-0.02em]">{c.title}</h3>
                <p className="text-[16.5px] text-ink-muted">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="values" aria-labelledby="ab-v-h" className={BAND}>
        <div className="mx-auto max-w-content">
          <SectionHead
            id="ab-v-h"
            title="What we believe"
            lede="A value is only worth stating if it costs something. Each of these has a price, and we have paid it."
            className="mb-12"
          />
          <div data-rise-group="" className="flex flex-col">
            {values.map((v) => (
              <div
                key={v.title}
                data-rise=""
                className="grid grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)] items-start gap-14 border-t border-border py-[34px] last:border-b max-[900px]:grid-cols-1 max-[900px]:gap-3.5"
              >
                <h3 className="text-[clamp(22px,2.1vw,29px)] font-semibold tracking-[-0.025em] text-balance text-ink">{v.title}</h3>
                <p className="text-[17.5px] leading-[1.55] text-pretty text-ink-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="wont" aria-labelledby="ab-w-h" className={BAND}>
        <div className="mx-auto max-w-content">
          <div data-rise="" className="flex flex-col gap-11 rounded-[28px] bg-deep p-[clamp(40px,5vw,72px)] text-on-deep-muted shadow-card">
            <div className="flex max-w-[720px] flex-col gap-[18px]">
              <h2 id="ab-w-h" className="text-[clamp(32px,3.4vw,50px)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-on-deep">
                What we will not build
              </h2>
              <p className="text-[19.5px] leading-normal text-pretty">
                Anyone can list values. The useful version is the list of things we have decided against, because those are the ones
                that would make us money.
              </p>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[18px] max-tab:grid-cols-1">
              {wont.map((c) => (
                <div key={c.title} className="flex flex-col gap-2.5 rounded-[20px] bg-on-deep-card p-[30px]">
                  <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-on-deep">{c.title}</h3>
                  <p className="text-[16px] leading-normal">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        width={700}
        title="Judge it by the product."
        body={
          <>
            Fourteen days free on Max, every option included, no card. Open one channel, invite the people you currently email, and see
            whether any of the above holds up. If you would rather ask first,{" "}
            <UnderlineLink href="/contact" inline>
              tell us how you work
            </UnderlineLink>
            .
          </>
        }
        secondary={{ label: "See pricing", href: "/pricing" }}
      />
    </>
  );
}
