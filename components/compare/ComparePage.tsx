import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "../ButtonLink";
import { CtaBand } from "../CtaBand";
import { Screenshot } from "../product/ProductSections";
import { Rich } from "../Rich";
import { ShotBand } from "../use-case/UseCasePage";
import type { Comparison, CompareSection } from "@/lib/compare";
import { screens } from "@/lib/use-case-images";
import type { Card, Rich as RichText } from "@/lib/use-cases";

// The six compare pages share this layout. All copy comes from lib/compare.ts.

const H2 = "text-[clamp(34px,3.7vw,54px)] leading-[1.04] font-semibold tracking-[-0.03em] text-balance text-ink";
const PAD = "px-10 max-tab:!px-5 max-tab:!py-[86px]";

function Paragraphs({ items, size }: { items: RichText[]; size: 20 | 20.5 }) {
  return (
    <>
      {items.map((p, i) => (
        <p key={i} className={size === 20 ? "text-[20px] text-pretty" : "text-[20.5px] leading-normal text-pretty"}>
          <Rich text={p} />
        </p>
      ))}
    </>
  );
}

/** A band whose box is 1400px of content plus padding (the design sizes these sections directly). */
function NarrowBand({ id, labelledBy, children }: { id: string; labelledBy: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${PAD} mx-auto max-w-[1480px] pt-0 pb-[150px]`}>
      {children}
    </section>
  );
}

function Split({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 items-center gap-12 desk:grid-cols-[minmax(0,1fr)_minmax(0,.92fr)] desk:gap-24">{children}</div>;
}

/* ---------- Hero ---------- */

function Hero({ hero }: { hero: Comparison["hero"] }) {
  return (
    <section aria-labelledby="vs-hero" className="relative bg-hero-glow px-10 pt-[196px] pb-[130px] max-tab:!px-5 max-tab:!pt-[124px] max-tab:!pb-0">
      <div className="mx-auto max-w-content">
        <div data-rise="" className="flex max-w-[880px] flex-col gap-5">
          <span className="text-[12px] font-semibold tracking-[0.12em] text-accent-ink uppercase">{hero.eyebrow}</span>
          <h1 id="vs-hero" className="text-[clamp(38px,4.6vw,66px)] leading-none font-extrabold tracking-[-0.04em] text-balance text-ink">
            {hero.title}
          </h1>
          <p className="max-w-[760px] text-[20.5px] leading-normal text-pretty text-ink-muted">
            <Rich text={hero.lede} />
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <ButtonLink href="#compare" size="lg">
              Jump to the comparison
            </ButtonLink>
            <ButtonLink href="/pricing" variant="secondary" size="lg" className="[--lift-shadow:none]">
              See pricing
            </ButtonLink>
          </div>
        </div>
        <div data-rise="" className="mt-14 grid max-w-[1080px] grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[18px] max-tab:grid-cols-1">
          {hero.summary.map((c) => (
            <div key={c.title} className="flex flex-col gap-3 rounded-3xl bg-surface-tint p-[30px]">
              <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">{c.title}</h2>
              <p className="text-[16.5px]">
                <Rich text={c.body} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Feature by feature ---------- */

const CELL_BORDER = "border-t border-border";

function FeatureTable({ table, competitor }: { table: Comparison["table"]; competitor: string }) {
  return (
    <section id="compare" aria-labelledby="vs-tbl-h" className={`${PAD} pt-0 pb-[150px]`}>
      <div className="mx-auto max-w-content">
        <div data-rise="" className="mb-11 flex max-w-[820px] flex-col gap-5">
          <h2 id="vs-tbl-h" className={H2}>
            {table.title}
          </h2>
          <p className="text-[20px] text-pretty">
            <Rich text={table.lede} />
          </p>
        </div>
        {/* One flat grid as in the design; rows use display:contents so they can carry table roles. */}
        <div
          data-rise=""
          role="table"
          aria-label={`Kolabr and ${competitor} compared`}
          className="grid grid-cols-[minmax(200px,1.1fr)_minmax(220px,1.2fr)_minmax(220px,1.2fr)] items-stretch overflow-hidden rounded-3xl bg-surface px-[26px] pt-3.5 pb-[26px] shadow-subtle max-tab:grid-cols-1"
        >
          <div role="row" className="contents">
            <div role="columnheader" className="py-[18px] pr-[18px] pl-0.5">
              <span className="sr-only">Feature</span>
            </div>
            <div role="columnheader" className="rounded-t-[14px] bg-surface-tint p-[18px] text-[17px] font-semibold text-ink max-tab:rounded-none">
              Kolabr
            </div>
            <div role="columnheader" className="py-[18px] pr-0.5 pl-[18px] text-[17px] font-semibold text-ink-muted max-tab:rounded-none">
              {competitor}
            </div>
          </div>
          {table.groups.map((g) => (
            <div key={g.title} role="rowgroup" className="contents">
              <div role="row" className="contents">
                <div
                  role="cell"
                  aria-colspan={3}
                  className="col-span-full pt-[30px] pr-5 pb-3 pl-0.5 text-[12px] font-semibold tracking-[0.11em] text-accent-ink uppercase"
                >
                  {g.title}
                </div>
              </div>
              {g.rows.map(([label, kolabr, other], i) => (
                <div key={i} role="row" className="contents">
                  <div role="rowheader" className={`${CELL_BORDER} py-5 pr-[18px] pl-0.5 text-[16px] font-semibold text-pretty text-ink`}>
                    <Rich text={label} />
                  </div>
                  <div role="cell" className={`${CELL_BORDER} bg-surface-tint px-[18px] py-5 text-[15.5px] text-pretty text-ink`}>
                    <Rich text={kolabr} />
                  </div>
                  <div role="cell" className={`${CELL_BORDER} py-5 pr-0.5 pl-[18px] text-[15.5px] text-pretty text-ink-muted`}>
                    <Rich text={other} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Middle sections ---------- */

function WhiteCards({ cards }: { cards: Card[] }) {
  return (
    <div data-rise-group="" className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[18px] max-tab:grid-cols-1">
      {cards.map((c) => (
        <div key={c.title} data-rise="" className="flex flex-col gap-3.5 rounded-3xl bg-surface p-[34px] text-ink shadow-subtle">
          <h3 className="text-[22px] font-semibold tracking-[-0.02em]">{c.title}</h3>
          <p className="text-[16.5px] text-ink-muted">
            <Rich text={c.body} />
          </p>
        </div>
      ))}
    </div>
  );
}

function Middle({ section: s }: { section: CompareSection }) {
  if (s.type === "shotCards") {
    return <ShotBand id={s.id} title={s.title} lede={s.lede} image={s.image} cards={s.cards} headWidth={820} />;
  }
  if (s.type === "cards") {
    return (
      <NarrowBand id={s.id} labelledBy={`${s.id}-h`}>
        <div data-rise="" className="mb-11 flex max-w-[820px] flex-col gap-5">
          <h2 id={`${s.id}-h`} className={H2}>
            {s.title}
          </h2>
          <p className="text-[20px] text-pretty">
            <Rich text={s.lede} />
          </p>
        </div>
        <WhiteCards cards={s.cards} />
      </NarrowBand>
    );
  }
  return (
    <NarrowBand id={s.id} labelledBy={`${s.id}-h`}>
      <Split>
        <div data-rise="" className="flex max-w-[620px] flex-col gap-[22px]">
          <h2 id={`${s.id}-h`} className={H2}>
            {s.title}
          </h2>
          <Paragraphs items={s.paragraphs} size={20.5} />
          <div className="flex flex-col gap-[9px] pt-1">
            {s.reasons.map((r) => (
              <div key={r.lead} className="rounded-[13px] bg-surface-tint px-4 py-3.5 text-[15.5px] text-ink">
                <strong className="font-semibold">{r.lead}</strong> {r.text}
              </div>
            ))}
          </div>
        </div>
        <figure data-rise="" className="m-0 overflow-hidden rounded-[20px] bg-surface shadow-float">
          <Image src={screens[s.image.file]} alt={s.image.alt} sizes="(max-width: 1080px) 100vw, 680px" className="h-auto w-full" />
        </figure>
      </Split>
    </NarrowBand>
  );
}

/* ---------- Cost and FAQ ---------- */

function Cost({ cost }: { cost: Comparison["cost"] }) {
  const priceCard = (p: Comparison["cost"]["kolabr"], ours: boolean) => (
    <div className="flex flex-col gap-2.5 rounded-3xl bg-surface p-[34px] text-ink shadow-subtle">
      <span className={`text-[12px] font-semibold tracking-[0.11em] uppercase ${ours ? "text-accent-ink" : "text-ink-muted"}`}>{p.name}</span>
      <span className="text-[34px] font-semibold tracking-[-0.03em]">{p.price}</span>
      <span className="text-[16px] text-ink-muted">{p.text}</span>
    </div>
  );
  return (
    <NarrowBand id="cost" labelledBy="vs-cost-h">
      <Split>
        <div data-rise="" className="flex max-w-[620px] flex-col gap-[22px]">
          <h2 id="vs-cost-h" className={H2}>
            {cost.title}
          </h2>
          <Paragraphs items={cost.paragraphs} size={20.5} />
          <p className="text-[16.5px] text-pretty text-ink-muted">
            <Rich text={cost.note} />
          </p>
        </div>
        <div data-rise="" className="flex flex-col gap-3.5">
          {priceCard(cost.kolabr, true)}
          {priceCard(cost.other, false)}
        </div>
      </Split>
    </NarrowBand>
  );
}

function Faq({ faq }: { faq: Comparison["faq"] }) {
  return (
    <NarrowBand id="faq" labelledBy="vs-faq-h">
      <div data-rise="" className="mb-11 flex max-w-[820px] flex-col gap-[18px]">
        <h2 id="vs-faq-h" className={H2}>
          {faq.title}
        </h2>
      </div>
      <div data-rise-group="" className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-[18px] max-tab:grid-cols-1">
        {faq.items.map((q) => (
          <div key={q.title} data-rise="" className="flex flex-col gap-3 rounded-3xl bg-surface-tint p-[30px]">
            <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-pretty text-ink">{q.title}</h3>
            <p className="text-[16.5px] text-pretty">
              <Rich text={q.body} />
            </p>
          </div>
        ))}
      </div>
    </NarrowBand>
  );
}

/* ---------- Page ---------- */

export function ComparePage({ content: c }: { content: Comparison }) {
  return (
    <>
      <Hero hero={c.hero} />
      <section id={c.statement.id} aria-labelledby="vs-statement-h" className={`${PAD} pt-[110px] pb-[150px]`}>
        <div className="mx-auto flex max-w-content flex-col gap-12">
          <div data-rise="" className="flex max-w-[820px] flex-col gap-5">
            <h2 id="vs-statement-h" className={H2}>
              {c.statement.title}
            </h2>
            <Paragraphs items={c.statement.paragraphs} size={20} />
          </div>
          <Screenshot image={screens[c.statement.image.file]} alt={c.statement.image.alt} />
        </div>
      </section>
      <FeatureTable table={c.table} competitor={c.competitor} />
      {c.sections.map((s) => (
        <Middle key={s.id} section={s} />
      ))}
      <Cost cost={c.cost} />
      <Faq faq={c.faq} />
      <CtaBand width={680} title={c.cta.title} body={c.cta.body} note={c.cta.disclaimer} />
    </>
  );
}
