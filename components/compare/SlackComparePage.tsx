import type { ReactNode } from "react";
import { CtaBand } from "../CtaBand";
import { Rich } from "../Rich";
import { MemberList, PanelHeading, QueueList, TintRows, VideoTiles } from "../product/Illustrations";
import { BandHead, Faq, FeatureTable, H2, Hero, Middle, NarrowBand, Paragraphs, Proof, Split, Statement } from "./ComparePage";
import { SlackCostCalculator } from "./SlackCostCalculator";
import type { SlackComparison, ValueSketch } from "@/lib/compare-slack";

/**
 * Kolabr against Slack. Its own order, because its argument is its own: what you get beyond chat
 * comes first, before any price, then why the guests are where Slack gets expensive, then the
 * calculator, then the detail for whoever wants to check it.
 */

/** Centres a sketch under its heading; the sketch pieces pin themselves to the bottom otherwise. */
function Body({ children }: { children: ReactNode }) {
  return <div className="flex flex-1 flex-col justify-center [&>*]:!mt-0">{children}</div>;
}

type Sketches = { [K in ValueSketch["kind"]]: Omit<Extract<ValueSketch, { kind: K }>, "kind"> };

/** Wiki articles as tinted rows, the one suggested to the client picked out in accent. */
function WikiSketch({ heading, articles }: Sketches["wiki"]) {
  return (
    <>
      <PanelHeading count={articles.length} className="pb-2.5">
        {heading}
      </PanelHeading>
      <div className="flex flex-col gap-2">
        {articles.map((a) => (
          <span
            key={a.title}
            className={`flex items-center gap-2.5 rounded-xl px-[11px] py-[9px] text-ink ${a.suggested ? "bg-accent-wash" : "bg-surface-tint"}`}
          >
            <span className="relative flex h-[22px] w-[18px] flex-none flex-col justify-center gap-[3px] rounded-[4px] bg-surface px-[4px] shadow-pill">
              <span className="h-[2px] rounded-full bg-border" />
              <span className="h-[2px] rounded-full bg-border" />
              <span className="h-[2px] w-2/3 rounded-full bg-border" />
            </span>
            <span className="truncate font-semibold">{a.title}</span>
            <span
              className={`ml-auto flex-none text-[12px] font-semibold ${
                a.suggested ? "rounded-full bg-surface px-[9px] py-[3px] text-accent-ink-strong" : "text-ink-muted tabular-nums"
              }`}
            >
              {a.meta}
            </span>
          </span>
        ))}
      </div>
    </>
  );
}

/** A deployed playbook: progress across the top, then each step with its owner and date. */
function PlaybookSketch({ heading, steps }: Sketches["playbook"]) {
  const done = steps.filter((s) => s.done).length;
  return (
    <>
      <PanelHeading className="pb-2">
        {heading}
        <span className="tracking-normal normal-case">
          {done} of {steps.length} done
        </span>
      </PanelHeading>
      <span className="mb-1.5 block h-1.5 overflow-hidden rounded-full bg-surface-tint">
        <span className="block h-full rounded-full bg-accent" style={{ width: `${(done / steps.length) * 100}%` }} />
      </span>
      {steps.map((s) => (
        <span key={s.text} className="flex items-center gap-2.5 border-t border-border py-[9px] first-of-type:border-t-0">
          <span
            className={`flex size-[18px] flex-none items-center justify-center rounded-full text-[11px] font-semibold ${
              s.done ? "bg-accent text-on-ink" : "border-[1.5px] border-border"
            }`}
          >
            {s.done ? "✓" : ""}
          </span>
          <span className={`truncate font-semibold ${s.done ? "text-ink-muted" : "text-ink"}`}>{s.text}</span>
          <span className="ml-auto flex flex-none items-center gap-2">
            <span className="rounded-full bg-surface-tint px-[9px] py-[3px] text-[12px] font-semibold text-ink">{s.owner}</span>
            <span className={`w-[52px] text-right text-[12.5px] font-semibold ${s.done ? "text-ink-muted" : "text-ink"}`}>{s.due}</span>
          </span>
        </span>
      ))}
    </>
  );
}

/** The drawing at the top of a value card. Decorative: the card's own text says the same thing. */
function Sketch({ sketch: k }: { sketch: ValueSketch }) {
  switch (k.kind) {
    case "queue":
      return <QueueList rows={k.rows} />;
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
    case "meeting":
      return (
        <>
          <PanelHeading className="pb-2.5">{k.heading}</PanelHeading>
          <Body>
            <VideoTiles />
          </Body>
          <span className="mt-2.5 w-fit rounded-full bg-accent-soft px-[11px] py-[5px] text-[12.5px] font-semibold text-ink">{k.link}</span>
        </>
      );
    case "playbook":
      return <PlaybookSketch heading={k.heading} steps={k.steps} />;
    case "members":
      return (
        <>
          <PanelHeading className="pb-2.5">{k.heading}</PanelHeading>
          <Body>
            <MemberList members={k.members} />
          </Body>
        </>
      );
  }
}

/**
 * Six cards, each a sketch of the feature over what it does, with Slack's nearest equivalent
 * underneath. The cards share one subgrid, so the sketches, titles and Slack lines line up across
 * a row however long each card's text runs.
 */
function ValueBand({ band }: { band: SlackComparison["valueBand"] }) {
  return (
    <NarrowBand id={band.id} labelledBy={`${band.id}-h`}>
      <div className="pt-[110px] max-tab:pt-0">
        <BandHead id={`${band.id}-h`} title={band.title} lede={band.lede} />
        <div data-rise-group="" className="grid grid-cols-3 gap-[18px] max-desk:grid-cols-2 max-tab:grid-cols-1">
          {band.items.map((item) => (
            <div
              key={item.title}
              data-rise=""
              className="row-span-4 grid grid-rows-subgrid gap-y-0 rounded-[26px] bg-surface-tint p-2"
            >
              <div aria-hidden="true" className="flex min-h-[156px] flex-col rounded-[20px] bg-surface p-[18px] text-[13.5px] shadow-soft">
                <Sketch sketch={item.sketch} />
              </div>
              <h3 className="px-[22px] pt-6 text-[21px] font-semibold tracking-[-0.02em] text-pretty text-ink">{item.title}</h3>
              <p className="px-[22px] pt-2.5 text-[16.5px] text-pretty text-ink">
                <Rich text={item.body} />
              </p>
              <p className="mx-[22px] mt-5 mb-4 flex flex-col items-start gap-2 border-t border-border pt-4 text-[15px] leading-[1.5] text-pretty text-ink-muted">
                <span className="rounded-full bg-surface px-2.5 py-1 text-[11.5px] font-semibold tracking-[0.1em] text-ink-muted uppercase">
                  In Slack
                </span>
                <span>
                  <Rich text={item.slack} />
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </NarrowBand>
  );
}

/**
 * The first month as a track: four stops along one line, rather than four more boxes. On a phone
 * the line turns vertical and runs down the left.
 */
function FirstMonth({ outcome }: { outcome: SlackComparison["outcome"] }) {
  return (
    <NarrowBand id="first-month" labelledBy="vs-month-h">
      <div className="rounded-[28px] bg-surface px-[58px] pt-[58px] pb-[62px] shadow-raised max-tab:px-6 max-tab:pt-10 max-tab:pb-11">
        <BandHead id="vs-month-h" title={outcome.title} lede={outcome.lede} />
        <ol data-rise-group="" className="relative grid list-none grid-cols-4 gap-x-10 p-0 max-desk:grid-cols-1">
          <span aria-hidden="true" className="absolute top-[7px] right-0 left-0 h-px bg-border max-desk:hidden" />
          {outcome.items.map((item, i) => (
            <li
              key={item.lead}
              data-rise=""
              className="relative flex flex-col gap-3 pt-10 max-desk:border-l max-desk:border-border max-desk:pt-0 max-desk:pb-10 max-desk:pl-9 max-desk:last:border-l-transparent max-desk:last:pb-0"
            >
              <span
                aria-hidden="true"
                className="absolute top-0 left-0 size-[15px] rounded-full bg-accent ring-[6px] ring-accent-wash max-desk:-left-2"
              />
              <span aria-hidden="true" className="text-[40px] leading-none font-semibold tracking-[-0.04em] text-accent-ink tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[21px] font-semibold tracking-[-0.02em] text-pretty text-ink">{item.lead}</h3>
              <p className="text-[16.5px] text-pretty text-ink-muted">
                <Rich text={item.text} />
              </p>
            </li>
          ))}
        </ol>
      </div>
    </NarrowBand>
  );
}

function Cost({ cost }: { cost: SlackComparison["cost"] }) {
  return (
    <NarrowBand id="cost" labelledBy="cost-h">
      <Split>
        <div data-rise="" className="flex max-w-[620px] flex-col gap-[22px]">
          <h2 id="cost-h" className={H2}>
            {cost.title}
          </h2>
          <Paragraphs items={cost.paragraphs} size={20.5} />
        </div>
        <div data-rise="">
          <SlackCostCalculator />
        </div>
      </Split>
    </NarrowBand>
  );
}

export function SlackComparePage({ content: c }: { content: SlackComparison }) {
  return (
    <>
      <Hero hero={c.hero} primary={{ label: "Work out your cost", href: "#cost" }} />
      <ValueBand band={c.valueBand} />
      <Statement statement={c.statement} flush />
      <Cost cost={c.cost} />
      <FeatureTable table={c.table} competitor={c.competitor} />
      {c.sections.map((s) => (
        <Middle key={s.id} section={s} />
      ))}
      <FirstMonth outcome={c.outcome} />
      <Faq faq={c.faq} />
      <Proof proof={c.proof} />
      <CtaBand width={680} title={c.cta.title} body={c.cta.body} note={c.cta.disclaimer} />
    </>
  );
}
