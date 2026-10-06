import { ButtonLink } from "../ButtonLink";
import { CtaBand } from "../CtaBand";
import { Rich } from "../Rich";
import { Screenshot } from "../product/ProductSections";
import { BandHead, Faq, FeatureTable, NarrowBand, PAD, PricingNudge, Proof } from "./ComparePage";
import { GlassNote } from "./Sketches";
import { ZendeskCostBars } from "./ZendeskCostBars";
import type { JourneyStep, ZendeskComparison } from "@/lib/compare-zendesk";
import { screens } from "@/lib/use-case-images";
import { KOLABR_PRO_YEARLY, ZENDESK_PLANS } from "@/lib/zendesk-cost";

/**
 * Kolabr against Zendesk. The argument is the door against the room: Zendesk keeps customers at a
 * portal and a queue, where an agent relays what the expert knows; Kolabr brings clients into the
 * channel, where the person who knows answers and the clock is in plain sight. So the page follows
 * one request through each, then shows who is allowed to answer, what a client keeps, and what
 * response targets cost. Its own layout, built for this comparison.
 */

const LABEL = "text-[12px] font-semibold tracking-[0.11em] uppercase";
const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0 })}`;

/* ---------- Hero ---------- */

function Hero({ hero }: { hero: ZendeskComparison["hero"] }) {
  return (
    <section
      aria-labelledby="vs-hero"
      className="relative bg-hero-glow px-10 pt-[196px] pb-[110px] max-tab:!px-5 max-tab:!pt-[124px] max-tab:!pb-[70px]"
    >
      <div className="mx-auto max-w-content">
        <div data-rise="" className="flex max-w-[880px] flex-col gap-5">
          <span className={`${LABEL} text-accent-ink`}>{hero.eyebrow}</span>
          <h1 id="vs-hero" className="text-[clamp(38px,4.6vw,66px)] leading-none font-extrabold tracking-[-0.04em] text-balance text-ink">
            {hero.title}
          </h1>
          <p className="max-w-[800px] text-[20.5px] leading-normal text-pretty text-ink-muted">
            <Rich text={hero.lede} />
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <ButtonLink href="#journey" size="lg">
              Follow one request
            </ButtonLink>
          </div>
        </div>
        <div className="relative mt-16 max-tab:mt-12">
          <Screenshot image={screens[hero.image.file]} alt={hero.image.alt} preload />
          {/* Over the empty foot of the sidebar, clear of the conversation it describes. */}
          <GlassNote title={hero.chip.title} body={hero.chip.body} className="bottom-[16%] left-[-14px]" />
        </div>
      </div>
    </section>
  );
}

/* ---------- One request, two journeys ---------- */

/** Who acts in a step: the client in guest colours, your people in team colours, the system neutral. */
const ACTOR_TONE: Record<string, string> = {
  Client: "bg-accent-wash text-accent-ink-strong",
  Agent: "bg-deep text-on-deep",
  Engineer: "bg-deep text-on-deep",
};

/** `onWhite` is the Kolabr lane, where a neutral chip needs the tint to show against the card. */
function Actor({ name, onWhite }: { name: string; onWhite?: boolean }) {
  return (
    <span
      className={`w-[78px] flex-none rounded-full px-2.5 py-1 text-center text-[11.5px] font-semibold ${ACTOR_TONE[name] ?? (onWhite ? "bg-surface-tint text-ink-muted" : "bg-surface text-ink-muted")}`}
    >
      {name}
    </span>
  );
}

function StepRow({ step, n, ours }: { step: JourneyStep; n: number; ours?: boolean }) {
  return (
    <li className="relative flex items-start gap-3 py-2.5">
      <span
        aria-hidden="true"
        className={`relative z-10 flex size-7 flex-none items-center justify-center rounded-full text-[12px] font-semibold tabular-nums ${
          ours ? "bg-accent text-on-ink" : "border border-border bg-surface text-ink-muted"
        }`}
      >
        {n}
      </span>
      <span className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1.5 pt-0.5">
        <Actor name={step.actor} onWhite={ours} />
        <span className="min-w-[200px] flex-1 text-[15.5px] leading-[1.45] text-pretty text-ink">{step.text}</span>
      </span>
    </li>
  );
}

/**
 * The steps of one lane. Consecutive relay steps sit in one dashed outline labelled "The relay",
 * so the hand-off from agent to expert and back reads as a loop the client never sees.
 */
function Lane({ steps, relayLabel, ours }: { steps: JourneyStep[]; relayLabel: string; ours?: boolean }) {
  const groups: { relay: boolean; items: { step: JourneyStep; n: number }[] }[] = [];
  steps.forEach((step, i) => {
    const relay = !!step.relay;
    const last = groups[groups.length - 1];
    if (last && last.relay === relay) last.items.push({ step, n: i + 1 });
    else groups.push({ relay, items: [{ step, n: i + 1 }] });
  });
  return (
    <ol className="relative flex list-none flex-col p-0">
      <span aria-hidden="true" className="absolute top-5 bottom-5 left-[13px] w-px bg-border" />
      {groups.map((g, gi) =>
        g.relay ? (
          <li key={gi} className="relative my-1.5 rounded-[16px] border-2 border-dashed border-ink-muted/40 px-3 pt-6 pb-1">
            <span className="absolute -top-[11px] left-3 rounded-full bg-surface-tint px-2.5 py-0.5 text-[11.5px] font-semibold tracking-[0.06em] text-ink-muted uppercase">
              {relayLabel}
            </span>
            <ol className="flex list-none flex-col p-0">
              {g.items.map(({ step, n }) => (
                <StepRow key={n} step={step} n={n} ours={ours} />
              ))}
            </ol>
          </li>
        ) : (
          g.items.map(({ step, n }) => <StepRow key={n} step={step} n={n} ours={ours} />)
        ),
      )}
    </ol>
  );
}

function Journey({ journey: j }: { journey: ZendeskComparison["journey"] }) {
  return (
    <section id={j.id} aria-labelledby={`${j.id}-h`} className={`${PAD} pt-[120px] pb-[150px]`}>
      <div className="mx-auto max-w-content">
        <BandHead id={`${j.id}-h`} title={j.title} lede={j.lede} />
        <div data-rise-group="" className="grid grid-cols-1 items-start gap-[18px] desk:grid-cols-2">
          <div data-rise="" className="flex flex-col gap-4 rounded-[28px] bg-surface-tint p-[30px] max-tab:p-5">
            <h3 className="flex items-baseline justify-between gap-3">
              <span className={`${LABEL} text-ink-muted`}>{j.zendesk.label}</span>
              <span className="text-[13px] text-ink-muted">{j.zendesk.steps.length} steps</span>
            </h3>
            <Lane steps={j.zendesk.steps} relayLabel={j.relayLabel} />
          </div>
          <div data-rise="" className="flex flex-col gap-4 rounded-[28px] bg-surface p-[30px] shadow-raised max-tab:p-5">
            <h3 className="flex items-baseline justify-between gap-3">
              <span className={`${LABEL} text-accent-ink`}>{j.kolabr.label}</span>
              <span className="text-[13px] text-ink-muted">{j.kolabr.steps.length} steps</span>
            </h3>
            <Lane steps={j.kolabr.steps} relayLabel={j.relayLabel} ours />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Who is allowed to answer ---------- */

function Mark({ yes }: { yes: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-6 flex-none items-center justify-center rounded-full ${yes ? "bg-accent text-on-ink" : "bg-surface text-ink-muted ring-1 ring-border"}`}
    >
      <svg viewBox="0 0 20 20" className="size-3.5">
        {yes ? (
          <path d="M5 10.5l3.2 3.2L15 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M6 6l8 8M14 6l-8 8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        )}
      </svg>
    </span>
  );
}

function Roles({ roles: r }: { roles: ZendeskComparison["roles"] }) {
  const [agent, light, user] = r.cards;
  const [team, pro] = ZENDESK_PLANS;
  const cards = [
    { ...agent, replies: true, price: `${money(team.yearly)}* or ${money(pro.yearly)}*`, per: "per agent a month", ours: false },
    { ...light, replies: false, price: null, per: null, ours: false },
    { ...user, replies: true, price: `${money(KOLABR_PRO_YEARLY)}*`, per: "per user a month, on Pro", ours: true },
  ];
  return (
    <NarrowBand id={r.id} labelledBy={`${r.id}-h`}>
      <BandHead id={`${r.id}-h`} title={r.title} lede={r.lede} />
      <div data-rise-group="" className="grid grid-cols-1 gap-[18px] desk:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            data-rise=""
            className={`flex flex-col gap-5 rounded-[28px] p-[30px] max-tab:p-6 ${c.ours ? "bg-surface shadow-raised" : "bg-surface-tint"}`}
          >
            <h3 className={`${LABEL} ${c.ours ? "text-accent-ink" : "text-ink-muted"}`}>{c.label}</h3>
            <p className="flex items-start gap-3 text-[18px] leading-[1.4] font-semibold text-pretty text-ink">
              <Mark yes={c.replies} />
              {c.can}
            </p>
            <div className="mt-auto flex flex-col gap-1 border-t border-border pt-4">
              {c.price && (
                <span className="flex items-baseline gap-2">
                  <span className="text-[26px] leading-none font-semibold tracking-[-0.03em] text-ink tabular-nums">{c.price}</span>
                  <span className="text-[13.5px] text-ink-muted">{c.per}</span>
                </span>
              )}
              <span className="text-[15px] text-pretty text-ink-muted">{c.note}</span>
            </div>
          </div>
        ))}
      </div>
      <p data-rise="" className="mt-6 px-1 text-[17px] font-semibold text-pretty text-ink">
        <Rich text={r.footer} />
      </p>
    </NarrowBand>
  );
}

/* ---------- Clients, not tickets ---------- */

function Keep({ keep: k }: { keep: ZendeskComparison["keep"] }) {
  return (
    <NarrowBand id={k.id} labelledBy={`${k.id}-h`}>
      <div
        data-rise=""
        className="grid grid-cols-1 gap-12 rounded-[28px] bg-deep p-[58px] text-on-deep max-tab:p-7 desk:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] desk:gap-16"
      >
        <div className="flex flex-col gap-4">
          <h2
            id={`${k.id}-h`}
            className="text-[clamp(30px,3.1vw,44px)] leading-[1.06] font-semibold tracking-[-0.03em] text-balance text-on-deep"
          >
            {k.title}
          </h2>
          <p className="text-[19px] leading-normal text-pretty text-on-deep-muted">
            <Rich text={k.lede} />
          </p>
        </div>
        <ul className="grid list-none grid-cols-1 gap-[14px] p-0">
          {k.tiles.map((t) => (
            <li key={t.title} className="flex flex-col gap-2 rounded-[20px] bg-on-deep-panel p-6">
              <h3 className="text-[19px] font-semibold tracking-[-0.02em] text-on-deep">{t.title}</h3>
              <p className="text-[16px] text-pretty text-on-deep-muted">
                <Rich text={t.body} />
              </p>
            </li>
          ))}
        </ul>
      </div>
    </NarrowBand>
  );
}

/* ---------- What response targets cost ---------- */

function Cost({ cost: c }: { cost: ZendeskComparison["cost"] }) {
  return (
    <NarrowBand id="cost" labelledBy="cost-h">
      <BandHead id="cost-h" title={c.title} lede={c.lede} />
      <div data-rise="">
        <ZendeskCostBars title={c.chartTitle} teamLabel={c.teamLabel} noTargets={c.noTargets} withTargets={c.withTargets} />
      </div>
      <p data-rise="" className="mt-5 max-w-[960px] px-1 text-[13.5px] leading-[1.5] text-pretty text-ink-muted">
        <Rich text={c.note} />
      </p>
      <PricingNudge className="mt-6 px-1" />
    </NarrowBand>
  );
}

/* ---------- Page ---------- */

export function ZendeskComparePage({ content: c }: { content: ZendeskComparison }) {
  return (
    <>
      <Hero hero={c.hero} />
      <Journey journey={c.journey} />
      <Roles roles={c.roles} />
      <Keep keep={c.keep} />
      <Cost cost={c.cost} />
      <FeatureTable table={c.table} competitor={c.competitor} />
      <Faq faq={c.faq} />
      <Proof proof={c.proof} />
      <CtaBand width={680} title={c.cta.title} body={c.cta.body} note={c.cta.disclaimer} />
    </>
  );
}
