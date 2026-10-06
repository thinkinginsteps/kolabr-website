import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "../ButtonLink";
import { CtaBand } from "../CtaBand";
import { Rich } from "../Rich";
import { SkeletonLines } from "../product/Illustrations";
import { BandHead, Faq, FeatureTable, NarrowBand, PAD, PricingNudge, Proof } from "./ComparePage";
import { GlassNote } from "./Sketches";
import type { NotionComparison } from "@/lib/compare-notion";
import { plans } from "@/lib/pricing";
import { screens } from "@/lib/use-case-images";

/**
 * Kolabr against Notion. The argument is building against working: Notion can be made to run
 * client work, but somebody builds it, connects a chat tool and a video tool, and keeps it alive,
 * and the client still gets a page. So the page sets the two checklists side by side, then shows
 * what a client walks into on each, then who owns the setup in two years, and only then the bill.
 * Its own layout, built for this comparison.
 */

const pro = plans.find((p) => p.name === "Pro")!;
const business = plans.find((p) => p.name === "Business")!;

const LABEL = "text-[12px] font-semibold tracking-[0.11em] uppercase";
const CHIP = "w-fit rounded-full px-3 py-1 text-[12px] font-semibold";

function Tick({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-[20px] flex-none items-center justify-center rounded-full bg-accent text-on-ink ${className}`}
    >
      <svg viewBox="0 0 20 20" className="size-3.5">
        <path d="M5 10.5l3.2 3.2L15 7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/* ---------- Hero: the words beside a wiki that lives next to the conversation ---------- */

function Hero({ hero }: { hero: NotionComparison["hero"] }) {
  return (
    <section
      aria-labelledby="vs-hero"
      className="relative bg-hero-glow px-10 pt-[196px] pb-[120px] max-tab:!px-5 max-tab:!pt-[124px] max-tab:!pb-[70px]"
    >
      <div className="mx-auto grid max-w-content grid-cols-1 items-center gap-14 desk:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] desk:gap-20">
        <div data-rise="" className="flex flex-col gap-5">
          <span className={`${LABEL} text-accent-ink`}>{hero.eyebrow}</span>
          <h1 id="vs-hero" className="text-[clamp(38px,4.6vw,66px)] leading-none font-extrabold tracking-[-0.04em] text-balance text-ink">
            {hero.title}
          </h1>
          <p className="text-[20.5px] leading-normal text-pretty text-ink-muted">
            <Rich text={hero.lede} />
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <ButtonLink href="#build" size="lg">
              See what you would build
            </ButtonLink>
          </div>
        </div>
        <div data-rise="" className="relative">
          {/* The article is tall; the frame shows its top, where the title, the notice and the first steps are. */}
          <figure className="m-0 h-[560px] overflow-hidden rounded-[20px] bg-surface shadow-shot max-tab:h-[400px]">
            <Image
              src={screens[hero.image.file]}
              alt={hero.image.alt}
              preload
              sizes="(max-width: 1080px) 100vw, 680px"
              className="h-auto w-full"
            />
          </figure>
          <GlassNote title={hero.chip.title} body={hero.chip.body} className="bottom-[9%] left-[-28px]" />
        </div>
      </div>
    </section>
  );
}

/* ---------- Build it, or open it ---------- */

function Build({ build: b }: { build: NotionComparison["build"] }) {
  return (
    <section id={b.id} aria-labelledby={`${b.id}-h`} className={`${PAD} pt-[110px] pb-[150px]`}>
      <div className="mx-auto max-w-content">
        <BandHead id={`${b.id}-h`} title={b.title} lede={b.lede} />
        <div data-rise-group="" className="grid grid-cols-1 items-start gap-[18px] desk:grid-cols-2">
          <div data-rise="" className="flex flex-col gap-5 rounded-[28px] bg-surface-tint p-[34px] max-tab:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-[23px] font-semibold tracking-[-0.02em] text-ink">{b.notion.title}</h3>
              <span className={`${CHIP} bg-surface text-ink-muted`}>{b.notion.items.length} things to set up</span>
            </div>
            <ol className="flex list-none flex-col p-0">
              {b.notion.items.map((item) => (
                <li key={item.text} className="flex gap-3.5 border-t border-border py-3.5">
                  <span
                    aria-hidden="true"
                    className="mt-[3px] size-[18px] flex-none rounded-[6px] border-[1.5px] border-border bg-surface"
                  />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[16px] leading-[1.45] text-pretty text-ink">{item.text}</span>
                    {item.note && <span className="text-[13.5px] text-ink-muted">{item.note}</span>}
                  </span>
                </li>
              ))}
            </ol>
            <p className="border-t border-border pt-4 text-[16px] font-semibold text-ink-muted">{b.notion.footer}</p>
          </div>

          <div data-rise="" className="flex flex-col gap-6 rounded-[28px] bg-surface p-[34px] shadow-raised max-tab:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-[23px] font-semibold tracking-[-0.02em] text-ink">{b.kolabr.title}</h3>
              <span className={`${CHIP} bg-accent-wash text-accent-ink-strong`}>{b.kolabr.actions.length} steps</span>
            </div>
            <ol className="flex list-none flex-col gap-3 p-0">
              {b.kolabr.actions.map((a, i) => (
                <li key={a} className="flex items-center gap-4 rounded-[18px] bg-surface-tint px-5 py-4">
                  <span
                    aria-hidden="true"
                    className="flex size-9 flex-none items-center justify-center rounded-full bg-ink text-[16px] font-semibold text-on-ink tabular-nums"
                  >
                    {i + 1}
                  </span>
                  <span className="text-[19px] font-semibold tracking-[-0.01em] text-ink">{a}</span>
                </li>
              ))}
            </ol>
            <div className="flex flex-col gap-3">
              <span className={`${LABEL} text-accent-ink`}>{b.kolabr.includedLabel}</span>
              <ul className="grid list-none grid-cols-1 gap-x-6 gap-y-3 p-0 tab:grid-cols-2">
                {b.kolabr.included.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[15.5px] leading-[1.45] text-ink">
                    <Tick className="mt-px" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            <p className="rounded-[16px] bg-accent-wash px-5 py-4 text-[16px] font-semibold text-ink">{b.kolabr.footer}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- What your client walks into ---------- */

/** A drawn app window: a quiet title bar, then whatever the guest sees. Decorative; the caption says it. */
function Screen({ children }: { children: ReactNode }) {
  return (
    <div aria-hidden="true" className="flex flex-1 flex-col overflow-hidden rounded-[22px] bg-surface text-[13.5px] shadow-raised">
      <div className="flex items-center gap-1.5 border-b border-border bg-surface-tint px-4 py-3">
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">{children}</div>
    </div>
  );
}

function Row({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="flex items-center gap-2.5 rounded-xl bg-surface-tint px-3 py-2.5 text-ink">
      <span className="flex size-[22px] flex-none items-center justify-center rounded-[7px] bg-surface text-[11px] font-semibold text-ink-muted shadow-pill">
        {icon}
      </span>
      {children}
    </span>
  );
}

function WalkIn({ walkIn: w }: { walkIn: NotionComparison["walkIn"] }) {
  const n = w.notion;
  const k = w.kolabr;
  return (
    <NarrowBand id={w.id} labelledBy={`${w.id}-h`}>
      <BandHead id={`${w.id}-h`} title={w.title} lede={w.lede} />
      <div data-rise-group="" className="grid grid-cols-1 gap-[18px] desk:grid-cols-2">
        <figure data-rise="" className="m-0 flex flex-col gap-4 rounded-[28px] bg-surface-tint p-[26px] max-tab:p-4">
          <span className={`${LABEL} px-1 text-ink-muted`}>{n.label}</span>
          <Screen>
            <span className="text-[12.5px] text-ink-muted">{n.breadcrumb}</span>
            <span className="text-[22px] leading-tight font-semibold tracking-[-0.02em] text-ink">{n.page}</span>
            <div className="[&>*]:!mt-0">
              <SkeletonLines widths={["94%", "88%", "72%", "90%", "60%"]} />
            </div>
            <span className="mt-auto flex flex-col gap-1.5 rounded-xl border border-border p-3.5">
              <span className="flex items-center gap-2">
                <span className="size-[22px] rounded-full bg-avatar-guest-3" />
                <span className="font-semibold text-ink">{n.comment.name}</span>
                <span className="text-[12px] text-ink-muted">commented</span>
              </span>
              <span className="text-ink">{n.comment.text}</span>
            </span>
          </Screen>
          <figcaption className="px-1 text-[16px] text-pretty text-ink-muted">{n.caption}</figcaption>
        </figure>

        <figure data-rise="" className="m-0 flex flex-col gap-4 rounded-[28px] bg-surface-tint p-[26px] max-tab:p-4">
          <span className={`${LABEL} px-1 text-accent-ink`}>{k.label}</span>
          <Screen>
            <span className="flex items-center justify-between gap-3">
              <span className="text-[17px] font-semibold text-ink">
                <span className="text-ink-muted">#</span> {k.channel}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-[12.5px] font-semibold text-ink">
                <svg viewBox="0 0 20 20" className="size-3.5">
                  <path
                    d="M3 6.5A1.5 1.5 0 014.5 5h7A1.5 1.5 0 0113 6.5v7a1.5 1.5 0 01-1.5 1.5h-7A1.5 1.5 0 013 13.5zM13 9l4-2.5v7L13 11"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
                Call
              </span>
            </span>
            {/* The client asks (guest colours), your team answers (team colours), as in the product. */}
            <div className="flex flex-col gap-2">
              <div className="flex items-end gap-2">
                <span className="size-[22px] flex-none rounded-full bg-avatar-guest-3" />
                <span className="rounded-[13px_13px_13px_4px] bg-surface-tint px-3 py-2 text-ink">{k.incoming}</span>
              </div>
              <div className="flex items-end justify-end gap-2">
                <span className="rounded-[13px_13px_4px_13px] bg-ink px-3 py-2 font-semibold text-on-ink">{k.outgoing}</span>
                <span className="size-[22px] flex-none rounded-full bg-deep" />
              </div>
            </div>
            <span className="mt-auto flex flex-col gap-2">
              <span className="flex items-center gap-2.5 rounded-xl bg-surface-tint px-3 py-2.5 text-ink">
                <span className="text-ink-muted tabular-nums">{k.request.id}</span>
                <span className="truncate font-semibold">{k.request.title}</span>
                <span className="ml-auto flex flex-none items-center gap-1.5 text-[12.5px] font-semibold">
                  <span className="size-2 rounded-full bg-status-risk" />
                  {k.request.due}
                </span>
              </span>
              <Row icon="W">{k.wiki}</Row>
              <Row icon="31">{k.event}</Row>
            </span>
          </Screen>
          <figcaption className="px-1 text-[16px] text-pretty text-ink-muted">{k.caption}</figcaption>
        </figure>
      </div>
    </NarrowBand>
  );
}

/* ---------- The tracker nobody has to own ---------- */

function Owner({ owner: o }: { owner: NotionComparison["owner"] }) {
  return (
    <NarrowBand id={o.id} labelledBy={`${o.id}-h`}>
      <div
        data-rise=""
        className="grid grid-cols-1 gap-12 rounded-[28px] bg-surface-tint p-[58px] max-tab:p-7 desk:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] desk:gap-20"
      >
        <div className="flex flex-col gap-5">
          <h2
            id={`${o.id}-h`}
            className="text-[clamp(30px,3.1vw,44px)] leading-[1.06] font-semibold tracking-[-0.03em] text-balance text-ink"
          >
            {o.title}
          </h2>
          <p className="text-[19px] leading-normal text-pretty text-ink-muted">
            <Rich text={o.lede} />
          </p>
        </div>
        <ol className="flex list-none flex-col p-0">
          {o.points.map((p, i) => (
            <li
              key={p.title}
              className="grid grid-cols-[48px_minmax(0,1fr)] gap-x-4 border-t border-border py-6 first:border-t-0 first:pt-0 last:pb-0"
            >
              <span aria-hidden="true" className="text-[28px] leading-none font-semibold tracking-[-0.03em] text-accent-ink tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">{p.title}</h3>
                <p className="text-[16.5px] text-pretty text-ink-muted">
                  <Rich text={p.body} />
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </NarrowBand>
  );
}

/* ---------- One subscription, or a stack ---------- */

function ReceiptTotal({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-4 pt-5">
      <span className="text-[14.5px] text-ink-muted">{label}</span>
      {children}
    </div>
  );
}

/**
 * Two receipts, per person per month on yearly terms. Notion's stack names its other
 * subscriptions without pricing them; Kolabr's figure comes from lib/pricing.ts.
 */
function Cost({ cost: c }: { cost: NotionComparison["cost"] }) {
  return (
    <NarrowBand id="cost" labelledBy="cost-h">
      <BandHead id="cost-h" title={c.title} lede={c.lede} />
      <div data-rise-group="" className="grid grid-cols-1 items-start gap-[18px] desk:grid-cols-2">
        <div data-rise="" className="flex flex-col rounded-[24px] bg-surface-tint p-[30px] max-tab:p-6">
          <span className={`${LABEL} pb-3 text-ink-muted`}>{c.notion.label}</span>
          <ul className="flex list-none flex-col p-0">
            {c.notion.lines.map((l) => (
              <li key={l.name} className="flex items-baseline justify-between gap-4 border-b border-dashed border-border py-3.5">
                <span className="text-[16.5px] text-ink">{l.name}</span>
                <span
                  className={l.price.startsWith("$") ? "text-[17px] font-semibold text-ink tabular-nums" : "text-[15px] text-ink-muted"}
                >
                  {l.price}
                </span>
              </li>
            ))}
          </ul>
          <ReceiptTotal label={c.totalLabel}>
            <span className="text-right text-[22px] leading-tight font-semibold tracking-[-0.02em] text-ink">{c.notion.total}</span>
          </ReceiptTotal>
        </div>

        <div data-rise="" className="flex flex-col rounded-[24px] bg-surface p-[30px] shadow-raised max-tab:p-6">
          <span className={`${LABEL} pb-3 text-accent-ink`}>{c.kolabr.label}</span>
          <ul className="flex list-none flex-col p-0">
            {c.kolabr.lines.map((l) => (
              <li key={l} className="flex items-center justify-between gap-4 border-b border-dashed border-border py-3.5">
                <span className="text-[16.5px] text-ink">{l}</span>
                <span className="flex items-center gap-2 text-[15px] font-semibold text-accent-ink-strong">
                  <Tick />
                  Included
                </span>
              </li>
            ))}
          </ul>
          <ReceiptTotal label={c.totalLabel}>
            <span className="text-[34px] leading-none font-semibold tracking-[-0.03em] text-ink tabular-nums">{pro.yearly}*</span>
          </ReceiptTotal>
        </div>
      </div>

      <div
        data-rise=""
        className="mt-[18px] grid grid-cols-1 gap-x-10 gap-y-4 rounded-[24px] border border-border p-[28px] max-tab:p-6 desk:grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)]"
      >
        <span className="text-[17px] font-semibold text-ink">{c.scale.title}</span>
        <p className="text-[15.5px] leading-[1.5] text-pretty text-ink-muted">
          <Rich text={c.scale.notion} />
        </p>
        <p className="text-[15.5px] leading-[1.5] text-pretty text-ink">
          <strong className="font-semibold">Kolabr Business is {business.yearly}* per user.</strong> <Rich text={c.scale.kolabr} />
        </p>
      </div>

      <p data-rise="" className="mt-5 max-w-[900px] px-1 text-[13.5px] leading-[1.5] text-pretty text-ink-muted">
        <Rich text={c.note} />
      </p>
      <PricingNudge className="mt-6 px-1" />
    </NarrowBand>
  );
}

/* ---------- Page ---------- */

export function NotionComparePage({ content: c }: { content: NotionComparison }) {
  return (
    <>
      <Hero hero={c.hero} />
      <Build build={c.build} />
      <WalkIn walkIn={c.walkIn} />
      <Owner owner={c.owner} />
      <Cost cost={c.cost} />
      <FeatureTable table={c.table} competitor={c.competitor} />
      <Faq faq={c.faq} />
      <Proof proof={c.proof} />
      <CtaBand width={680} title={c.cta.title} body={c.cta.body} note={c.cta.disclaimer} />
    </>
  );
}
