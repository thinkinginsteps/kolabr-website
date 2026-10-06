import type { ReactNode } from "react";
import { ButtonLink } from "../ButtonLink";
import { CtaBand } from "../CtaBand";
import { Rich } from "../Rich";
import { PanelHeading, TintRows } from "../product/Illustrations";
import { Screenshot } from "../product/ProductSections";
import { BandHead, Faq, FeatureTable, NarrowBand, PAD, PricingNudge, Proof, Statement } from "./ComparePage";
import { Body, GlassNote, PlaybookSketch, WikiSketch } from "./Sketches";
import { plans } from "@/lib/pricing";
import type { Rich as RichText } from "@/lib/use-cases";
import type { BasecampComparison, DayStep, TileSketch } from "@/lib/compare-basecamp";
import { screens } from "@/lib/use-case-images";

/**
 * Kolabr against Basecamp. The argument is not price: Basecamp keeps a to-do list per project,
 * Kolabr runs the client relationship as it happens. So the page shows one ordinary day in each
 * before it says anything else, then what a to-do list was never built to do, and only then what
 * makes each bill grow. Its own layout, built for this comparison, not the Slack page's.
 */

/* ---------- Hero: the product first, as a screenshot of a live client channel ---------- */

function Hero({ hero }: { hero: BasecampComparison["hero"] }) {
  return (
    <section
      aria-labelledby="vs-hero"
      className="relative bg-hero-glow px-10 pt-[196px] pb-[110px] max-tab:!px-5 max-tab:!pt-[124px] max-tab:!pb-[70px]"
    >
      <div className="mx-auto max-w-content">
        <div data-rise="" className="flex max-w-[880px] flex-col gap-5">
          <span className="text-[12px] font-semibold tracking-[0.12em] text-accent-ink uppercase">{hero.eyebrow}</span>
          <h1 id="vs-hero" className="text-[clamp(38px,4.6vw,66px)] leading-none font-extrabold tracking-[-0.04em] text-balance text-ink">
            {hero.title}
          </h1>
          <p className="max-w-[780px] text-[20.5px] leading-normal text-pretty text-ink-muted">
            <Rich text={hero.lede} />
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <ButtonLink href="#beyond" size="lg">
              See what you get
            </ButtonLink>
          </div>
        </div>
        <div className="relative mt-16 max-tab:mt-12">
          <Screenshot image={screens[hero.image.file]} alt={hero.image.alt} preload />
          {/* Over the sidebar's empty foot rather than the request list it describes. */}
          <GlassNote title={hero.chip.title} body={hero.chip.body} className="bottom-[9%] left-[-14px]" />
        </div>
      </div>
    </section>
  );
}

/* ---------- The same Tuesday, in each ---------- */

const CHIP_TONE = { accent: "bg-accent", risk: "bg-status-risk" } as const;

function DayRow({ step }: { step: DayStep }) {
  return (
    <li
      data-rise=""
      className="relative grid grid-cols-1 gap-3 desk:grid-cols-[minmax(0,1fr)_104px_minmax(0,1fr)] desk:items-center desk:gap-0"
    >
      <div className="flex desk:order-2 desk:justify-center">
        <span className="relative z-10 rounded-full border border-border bg-surface px-3.5 py-1.5 text-[14px] font-semibold text-ink tabular-nums shadow-pill">
          {step.time}
        </span>
      </div>
      <div className="flex flex-col gap-2 rounded-[22px] bg-surface-tint p-[26px] desk:order-1">
        <span className="text-[11.5px] font-semibold tracking-[0.1em] text-ink-muted uppercase desk:hidden">In Basecamp</span>
        <p className="text-[16px] text-pretty text-ink-muted">
          <Rich text={step.basecamp} />
        </p>
      </div>
      <div className="flex flex-col gap-2.5 rounded-[22px] bg-surface p-[26px] shadow-raised desk:order-3">
        <span className="text-[11.5px] font-semibold tracking-[0.1em] text-accent-ink uppercase desk:hidden">In Kolabr</span>
        <h3 className="text-[19px] font-semibold tracking-[-0.02em] text-pretty text-ink">{step.kolabr.title}</h3>
        <p className="text-[16px] text-pretty text-ink">
          <Rich text={step.kolabr.text} />
        </p>
        <span className="mt-1 flex w-fit items-center gap-2 rounded-full bg-surface-tint px-3 py-[6px] text-[13px] font-semibold text-ink">
          <span aria-hidden="true" className={`size-2 rounded-full ${CHIP_TONE[step.kolabr.chip.tone]}`} />
          {step.kolabr.chip.label}
        </span>
      </div>
    </li>
  );
}

/**
 * One client, one day, as a timeline: Basecamp on the left, Kolabr on the right, the time on the
 * line between them. On narrower screens each moment stacks: the time, then Basecamp, then Kolabr.
 */
function Tuesday({ day }: { day: BasecampComparison["tuesday"] }) {
  return (
    <section id={day.id} aria-labelledby={`${day.id}-h`} className={`${PAD} pt-[120px] pb-[150px]`}>
      <div className="mx-auto max-w-content">
        <BandHead id={`${day.id}-h`} title={day.title} lede={day.lede} />
        <div aria-hidden="true" className="mb-5 grid grid-cols-[minmax(0,1fr)_104px_minmax(0,1fr)] max-desk:hidden">
          <span className="text-[12px] font-semibold tracking-[0.11em] text-ink-muted uppercase">In Basecamp</span>
          <span />
          <span className="text-[12px] font-semibold tracking-[0.11em] text-accent-ink uppercase">In Kolabr</span>
        </div>
        <ol className="relative flex list-none flex-col gap-[18px] p-0 max-desk:gap-12">
          <span aria-hidden="true" className="absolute top-0 bottom-0 left-1/2 w-px -translate-x-1/2 bg-border max-desk:hidden" />
          {day.steps.map((step) => (
            <DayRow key={step.time} step={step} />
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- What a to-do list was never built to do ---------- */

/** The call tile's drawing, drawn for the dark tile: a shared screen, the people on the call, the tools. */
function CallSketch({ heading, chips }: { heading: string; chips: string[] }) {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3 rounded-[20px] bg-on-deep-panel p-[18px] text-[13px]">
      <span className="text-[11.5px] font-semibold tracking-[0.1em] text-on-deep-muted uppercase">{heading}</span>
      <div className="grid grid-cols-[minmax(0,1fr)_72px] gap-2">
        <div className="flex aspect-[16/10] flex-col justify-center gap-2 rounded-[12px] bg-on-deep-card px-5">
          <span className="h-[7px] w-3/5 rounded-full bg-on-deep-muted opacity-60" />
          <span className="h-[7px] w-4/5 rounded-full bg-on-deep-muted opacity-35" />
          <span className="h-[7px] w-2/5 rounded-full bg-on-deep-muted opacity-35" />
          <span className="mt-1 h-[34px] w-[46%] rounded-[8px] border-2 border-dashed border-accent-on-deep" />
        </div>
        <div className="grid grid-rows-3 gap-2">
          <span className="rounded-[10px] bg-ink-muted" />
          <span className="rounded-[10px] bg-avatar-guest-3" />
          <span className="rounded-[10px] bg-avatar-user-2" />
        </div>
      </div>
      <div className="flex flex-wrap gap-[7px]">
        {chips.map((c) => (
          <span key={c} className="rounded-full bg-on-deep-card px-[11px] py-[5px] font-semibold text-on-deep">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function ChannelsSketch({ heading, items, more }: { heading: string; items: string[]; more: string }) {
  return (
    <>
      <PanelHeading className="pb-2.5">{heading}</PanelHeading>
      <Body>
        <div className="flex flex-wrap gap-2">
          {items.map((c) => (
            <span key={c} className="flex items-center gap-2 rounded-[11px] bg-surface-tint px-3 py-2 font-semibold text-ink">
              <span aria-hidden="true" className="text-ink-muted">
                #
              </span>
              {c}
            </span>
          ))}
          <span className="rounded-[11px] bg-accent-soft px-3 py-2 font-semibold text-ink">{more}</span>
        </div>
      </Body>
    </>
  );
}

function TileDrawing({ sketch: k }: { sketch: Exclude<TileSketch, { kind: "call" }> }) {
  switch (k.kind) {
    case "rows":
      return (
        <>
          <PanelHeading className="pb-2.5">{k.heading}</PanelHeading>
          <Body>
            <TintRows rows={k.rows} />
          </Body>
        </>
      );
    case "wiki":
      return <WikiSketch heading={k.heading} articles={k.articles} />;
    case "playbook":
      return <PlaybookSketch heading={k.heading} steps={k.steps} />;
    case "channels":
      return <ChannelsSketch heading={k.heading} items={k.items} more={k.more} />;
  }
}

/** Where each of the six tiles sits on the three-column grid: wide, narrow, narrow, wide, narrow, wide. */
const WIDE = [true, false, false, true, false, true];

function Tile({ tile, wide }: { tile: BasecampComparison["beyond"]["tiles"][number]; wide: boolean }) {
  const dark = tile.sketch.kind === "call";
  const text = (
    <div className="flex flex-col gap-3">
      <h3 className={`text-[22px] font-semibold tracking-[-0.02em] text-pretty ${dark ? "text-on-deep" : "text-ink"}`}>{tile.title}</h3>
      <p className={`text-[16.5px] text-pretty ${dark ? "text-on-deep-muted" : "text-ink-muted"}`}>
        <Rich text={tile.body} />
      </p>
    </div>
  );
  const drawing =
    tile.sketch.kind === "call" ? (
      <CallSketch heading={tile.sketch.heading} chips={tile.sketch.chips} />
    ) : (
      <div aria-hidden="true" className="flex min-h-[172px] flex-col rounded-[20px] bg-surface p-[18px] text-[13.5px] shadow-soft">
        <TileDrawing sketch={tile.sketch} />
      </div>
    );
  return (
    <div
      data-rise=""
      className={`rounded-[26px] p-[30px] max-tab:p-6 ${dark ? "bg-deep" : "bg-surface-tint"} ${
        wide
          ? "grid grid-cols-[minmax(0,1fr)] gap-8 tab:col-span-2 desk:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] desk:items-center"
          : "flex flex-col gap-7"
      }`}
    >
      {wide ? (
        <>
          {text}
          {drawing}
        </>
      ) : (
        <>
          {drawing}
          {text}
        </>
      )}
    </div>
  );
}

function Beyond({ beyond }: { beyond: BasecampComparison["beyond"] }) {
  return (
    <NarrowBand id={beyond.id} labelledBy={`${beyond.id}-h`}>
      <BandHead id={`${beyond.id}-h`} title={beyond.title} lede={beyond.lede} />
      <div data-rise-group="" className="grid grid-cols-1 gap-[18px] tab:grid-cols-2 desk:grid-cols-3">
        {beyond.tiles.map((tile, i) => (
          <Tile key={tile.title} tile={tile} wide={WIDE[i]} />
        ))}
      </div>
    </NarrowBand>
  );
}

/* ---------- What you pay for, plan by plan ---------- */

const TAG = "w-fit rounded-full px-3 py-1 text-[11.5px] font-semibold tracking-[0.1em] uppercase";

/** One plan as a row: name and what it gets on the left, the price on the right. */
function PlanRow({ name, price, terms, children }: { name: string; price: string; terms?: string; children: ReactNode }) {
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-5 border-t border-border py-[18px]">
      <div className="flex flex-col gap-2">
        <span className="text-[17px] font-semibold text-ink">{name}</span>
        {children}
      </div>
      <span className="flex flex-col items-end text-right">
        <span className="text-[26px] leading-none font-semibold tracking-[-0.03em] text-ink tabular-nums">{price}</span>
        {terms && <span className="pt-1.5 text-[12.5px] text-ink-muted">{terms}</span>}
      </span>
    </li>
  );
}

/** The panel's closing note: what every plan on that side shares. */
function SameOnEvery({ title, text, ours }: { title: string; text: RichText; ours?: boolean }) {
  return (
    <div className={`flex flex-col gap-1.5 rounded-[18px] p-5 ${ours ? "bg-accent-wash" : "bg-surface"}`}>
      <span className="text-[15px] font-semibold text-ink">{title}</span>
      <p className="text-[15px] leading-[1.5] text-pretty text-ink-muted">
        <Rich text={text} />
      </p>
    </div>
  );
}

/**
 * Each product's plans side by side, so the reader sees what the money buys on each: Basecamp's
 * steps buy more projects and storage with the same tools; Kolabr's buy capability, with
 * channels and guests unlimited throughout. Kolabr's figures come from lib/pricing.ts on yearly
 * terms, marked with the asterisk the note explains.
 */
function Cost({ cost }: { cost: BasecampComparison["cost"] }) {
  const { basecamp: b, kolabr: k } = cost;
  return (
    <NarrowBand id="cost" labelledBy="cost-h">
      <BandHead id="cost-h" title={cost.title} lede={cost.lede} />
      <div data-rise-group="" className="grid grid-cols-1 items-start gap-[18px] desk:grid-cols-2">
        <div data-rise="" className="flex flex-col gap-5 rounded-[28px] bg-surface-tint p-[34px] max-tab:p-6">
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-[24px] font-semibold tracking-[-0.02em] text-ink">Basecamp</h3>
              <span className={`${TAG} bg-surface text-ink-muted`}>{b.tag}</span>
            </div>
            <span className="text-[14.5px] text-ink-muted">{b.unit}</span>
          </div>
          <ul className="flex list-none flex-col p-0">
            {b.plans.map((p) => (
              <PlanRow key={p.name} name={p.name} price={p.price} terms={p.terms}>
                <span className="text-[14.5px] leading-[1.5] text-pretty text-ink-muted">
                  {/* The first limit is the active-project cap: the thing each step up actually buys. */}
                  <strong className="font-semibold text-ink">{p.limits[0]}</strong>
                  {p.limits.slice(1).map((l) => ` · ${l}`)}
                </span>
              </PlanRow>
            ))}
          </ul>
          <SameOnEvery title={b.same.title} text={b.same.text} />
        </div>

        <div data-rise="" className="flex flex-col gap-5 rounded-[28px] bg-surface p-[34px] shadow-raised max-tab:p-6">
          <div className="flex flex-col gap-2.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-[24px] font-semibold tracking-[-0.02em] text-ink">Kolabr</h3>
              <span className={`${TAG} bg-accent-wash text-accent-ink-strong`}>{k.tag}</span>
            </div>
            <span className="text-[14.5px] text-ink-muted">{k.unit}</span>
          </div>
          <ul className="flex list-none flex-col p-0">
            {plans.map((p) => {
              const paid = p.yearly !== "$0";
              return (
                <PlanRow
                  key={p.name}
                  name={p.name}
                  price={paid ? `${p.yearly}*` : p.yearly}
                  terms={paid ? "per user, yearly fee" : "free for good"}
                >
                  {p.includesLabel && <span className="text-[13.5px] text-ink-muted">{p.includesLabel}</span>}
                  <span className="flex flex-col gap-1.5">
                    {p.features.map((f) => (
                      <span key={f} className="flex items-start gap-2 text-[14.5px] leading-[1.45] text-ink">
                        <svg viewBox="0 0 20 20" aria-hidden="true" className="mt-[2px] size-4 flex-none text-accent-ink">
                          <path
                            d="M5 10.5l3.2 3.2L15 7"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {f}
                      </span>
                    ))}
                  </span>
                </PlanRow>
              );
            })}
          </ul>
          <SameOnEvery title={k.same.title} text={k.same.text} ours />
        </div>
      </div>
      <p data-rise="" className="mt-5 max-w-[900px] px-1 text-[13.5px] leading-[1.5] text-pretty text-ink-muted">
        <Rich text={cost.note} />
      </p>
      <PricingNudge className="mt-6 px-1" />
    </NarrowBand>
  );
}

/* ---------- Page ---------- */

export function BasecampComparePage({ content: c }: { content: BasecampComparison }) {
  return (
    <>
      <Hero hero={c.hero} />
      <Tuesday day={c.tuesday} />
      <Beyond beyond={c.beyond} />
      <Statement statement={c.statement} flush />
      <Cost cost={c.cost} />
      <FeatureTable table={c.table} competitor={c.competitor} />
      <Faq faq={c.faq} />
      <Proof proof={c.proof} />
      <CtaBand width={680} title={c.cta.title} body={c.cta.body} note={c.cta.disclaimer} />
    </>
  );
}
