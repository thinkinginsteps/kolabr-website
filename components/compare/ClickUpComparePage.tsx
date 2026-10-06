import { ButtonLink } from "../ButtonLink";
import { CtaBand } from "../CtaBand";
import { Rich } from "../Rich";
import { PanelHeading, TintRows } from "../product/Illustrations";
import { Screenshot } from "../product/ProductSections";
import { ClickUpBillChart } from "./ClickUpBillChart";
import { BandHead, Faq, FeatureTable, NarrowBand, PAD, PricingNudge, Proof } from "./ComparePage";
import { GlassNote } from "./Sketches";
import { CLICKUP_PLANS, guestPlaces, TEAM_SIZES } from "@/lib/clickup-cost";
import type { ClickUpComparison } from "@/lib/compare-clickup";
import { screens } from "@/lib/use-case-images";

/**
 * Kolabr against ClickUp. The argument is who gets a say: ClickUp is built for your team to
 * manage work and meters every guest who can comment or approve, so teams ration who they
 * invite; Kolabr puts everyone in the room, free, in a channel they can find their way around on
 * the first day. So the page states ClickUp's allowance rule, then what a client has to learn,
 * then the request a client reads in place of a board, then the bill for the reader's team size.
 * No picked example: every figure follows from ClickUp's rules and the team size chosen.
 * Its own layout, built for this comparison.
 */

const LABEL = "text-[12px] font-semibold tracking-[0.11em] uppercase";

/* ---------- Hero ---------- */

function Hero({ hero }: { hero: ClickUpComparison["hero"] }) {
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
            <ButtonLink href="#room" size="lg">
              See who gets a say
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

/* ---------- How many guests your users can bring in ---------- */

const Dot = ({ className }: { className: string }) => <span className={`size-[18px] flex-none rounded-full ${className}`} />;

/** One rule card: a user, the guests they make room for, and what happens past that. */
function RuleCard({
  label,
  visual,
  rule,
  after,
  perUser,
  ours,
}: {
  label: string;
  visual: string;
  rule: string;
  after: string;
  /** Guests each user after the first makes room for; undefined means no limit. */
  perUser?: number;
  ours?: boolean;
}) {
  return (
    <div
      data-rise=""
      className={`flex flex-col gap-5 rounded-[28px] p-[30px] max-tab:p-6 ${ours ? "bg-surface shadow-raised" : "bg-surface-tint"}`}
    >
      <h3 className={`${LABEL} ${ours ? "text-accent-ink" : "text-ink-muted"}`}>{label}</h3>
      <span className="-mb-2 text-[13px] text-ink-muted">{visual}</span>
      <div aria-hidden="true" className="flex min-h-[44px] items-center gap-3">
        <span className="flex size-[34px] flex-none items-center justify-center rounded-full bg-deep text-[11px] font-semibold text-on-ink">
          1
        </span>
        <span className="text-[18px] text-ink-muted">+</span>
        <span className="flex flex-wrap items-center gap-[6px]">
          {perUser === undefined ? (
            <>
              {Array.from({ length: 9 }, (_, i) => (
                <Dot key={i} className="bg-avatar-guest-3" />
              ))}
              {[0.6, 0.35, 0.15].map((o) => (
                <span key={o} className="size-[18px] flex-none rounded-full bg-avatar-guest-3" style={{ opacity: o }} />
              ))}
            </>
          ) : (
            Array.from({ length: perUser }, (_, i) => <Dot key={i} className="bg-avatar-guest-3" />)
          )}
        </span>
      </div>
      <p className="text-[19px] leading-[1.4] font-semibold tracking-[-0.01em] text-pretty text-ink">{rule}</p>
      <p className={`mt-auto border-t border-border pt-4 text-[15.5px] text-pretty ${ours ? "text-ink" : "text-ink-muted"}`}>{after}</p>
    </div>
  );
}

/**
 * ClickUp's guest allowance stated as its own rule, which a reader can check and apply to their
 * team, with a table of common team sizes worked out from it. No picked example.
 */
function Room({ room: r }: { room: ClickUpComparison["room"] }) {
  const plans = [CLICKUP_PLANS.unlimited, CLICKUP_PLANS.business];
  return (
    <section id={r.id} aria-labelledby={`${r.id}-h`} className={`${PAD} pt-[120px] pb-[150px]`}>
      <div className="mx-auto max-w-content">
        <BandHead id={`${r.id}-h`} title={r.title} lede={r.lede} />
        <div data-rise-group="" className="grid grid-cols-1 gap-[18px] desk:grid-cols-3">
          {plans.map((p, i) => (
            <RuleCard key={p.name} {...r.plans[i]} perUser={p.perUser} />
          ))}
          <RuleCard {...r.kolabr} ours />
        </div>

        <div data-rise="" className="mt-[18px] overflow-x-auto rounded-[24px] border border-border">
          <table className="w-full border-collapse text-left text-[15.5px] max-tab:text-[14px]">
            <caption className="px-[26px] pt-6 pb-4 text-left text-[17px] font-semibold text-pretty text-ink max-tab:px-4 max-tab:text-[16px]">
              {r.tableTitle}
            </caption>
            <thead>
              <tr className="border-t border-border bg-surface-tint text-[12.5px] tracking-[0.06em] text-ink-muted uppercase max-tab:text-[11px] max-tab:tracking-[0.03em]">
                <th scope="col" className="px-[26px] py-3 font-semibold max-tab:px-4">
                  {r.teamLabel}
                </th>
                {plans.map((p) => (
                  <th key={p.name} scope="col" className="px-4 py-3 font-semibold max-tab:px-2">
                    {/* On a phone the column is just "Unlimited" or "Business"; the brand is in the section above. */}
                    <span className="max-tab:sr-only">ClickUp </span>
                    {p.name.replace("ClickUp ", "")}
                  </th>
                ))}
                <th scope="col" className="px-4 py-3 font-semibold text-accent-ink max-tab:px-2">
                  Kolabr
                </th>
              </tr>
            </thead>
            <tbody>
              {TEAM_SIZES.map((n) => (
                <tr key={n} className="border-t border-border">
                  <th scope="row" className="px-[26px] py-3.5 font-semibold text-ink tabular-nums max-tab:px-4">
                    {n}
                  </th>
                  {plans.map((p) => (
                    <td key={p.name} className="px-4 py-3.5 text-ink-muted tabular-nums max-tab:px-2">
                      {guestPlaces(p, n)}
                    </td>
                  ))}
                  <td className="px-4 py-3.5 font-semibold whitespace-nowrap text-ink max-tab:px-2">{r.noLimit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p data-rise="" className="mt-5 max-w-[820px] px-1 text-[14.5px] leading-[1.5] text-pretty text-ink-muted">
          <Rich text={r.note} />
        </p>
      </div>
    </section>
  );
}

/* ---------- One channel, not a workspace to learn ---------- */

function Learn({ learn: l }: { learn: ClickUpComparison["learn"] }) {
  return (
    <NarrowBand id={l.id} labelledBy={`${l.id}-h`}>
      <BandHead id={`${l.id}-h`} title={l.title} lede={l.lede} />
      <div data-rise-group="" className="grid grid-cols-1 gap-[18px] desk:grid-cols-2">
        <figure data-rise="" className="m-0 flex flex-col gap-5 rounded-[28px] bg-surface-tint p-[30px] max-tab:p-5">
          <span className={`${LABEL} text-ink-muted`}>{l.clickup.label}</span>
          <div aria-hidden="true" className="flex flex-1 flex-col gap-4 rounded-[20px] bg-surface p-5 text-[13.5px] shadow-soft">
            <ol className="flex list-none flex-col gap-1.5 p-0">
              {l.clickup.path.map((p, i) => (
                <li key={p.level} className="flex items-center gap-2.5" style={{ paddingLeft: `${i * 16}px` }}>
                  {i > 0 && <span className="h-px w-2.5 flex-none bg-border" />}
                  <span className="w-[92px] flex-none rounded-md bg-surface-tint px-2 py-1 text-center text-[11px] font-semibold tracking-[0.04em] text-ink-muted uppercase">
                    {p.level}
                  </span>
                  <span className="truncate text-ink">{p.name}</span>
                </li>
              ))}
            </ol>
            <span className="mt-auto flex flex-wrap gap-1.5 border-t border-border pt-4">
              {l.clickup.views.map((v) => (
                <span key={v} className="rounded-lg bg-surface-tint px-2.5 py-1.5 text-[12.5px] font-semibold text-ink-muted">
                  {v}
                </span>
              ))}
            </span>
          </div>
          <figcaption className="text-[16px] text-pretty text-ink-muted">
            <Rich text={l.clickup.caption} />
          </figcaption>
        </figure>

        <figure data-rise="" className="m-0 flex flex-col gap-5 rounded-[28px] bg-surface-tint p-[30px] max-tab:p-5">
          <span className={`${LABEL} text-accent-ink`}>{l.kolabr.label}</span>
          <div aria-hidden="true" className="flex flex-1 flex-col gap-3 rounded-[20px] bg-surface p-5 text-[14px] shadow-raised">
            <span className="text-[12.5px] text-ink-muted">{l.kolabr.client}</span>
            <span className="text-[19px] font-semibold tracking-[-0.01em] text-ink">
              <span className="text-ink-muted">#</span> {l.kolabr.channel}
            </span>
            <span className="mt-1 flex flex-col gap-2">
              {l.kolabr.tabs.map((t, i) => (
                <span
                  key={t}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-3 font-semibold text-ink ${i === 0 ? "bg-accent-wash" : "bg-surface-tint"}`}
                >
                  <span className="flex size-6 flex-none items-center justify-center rounded-[7px] bg-surface text-[11px] text-ink-muted shadow-pill">
                    {i + 1}
                  </span>
                  {t}
                </span>
              ))}
            </span>
          </div>
          <figcaption className="text-[16px] text-pretty text-ink">
            <Rich text={l.kolabr.caption} />
          </figcaption>
        </figure>
      </div>
    </NarrowBand>
  );
}

/* ---------- Promises the client can hold you to ---------- */

function Promises({ promise: p }: { promise: ClickUpComparison["promise"] }) {
  return (
    <NarrowBand id={p.id} labelledBy={`${p.id}-h`}>
      <BandHead id={`${p.id}-h`} title={p.title} lede={p.lede} />
      <div
        data-rise=""
        className="grid grid-cols-1 items-center gap-[18px] rounded-[28px] bg-surface-tint p-[30px] max-tab:p-5 desk:grid-cols-[minmax(0,1.15fr)_auto_minmax(0,.85fr)]"
      >
        <figure className="m-0 flex flex-col gap-3">
          <span className={`${LABEL} text-ink-muted`}>{p.board.label}</span>
          <div
            aria-hidden="true"
            className="grid grid-cols-5 gap-2 rounded-[20px] bg-surface p-4 text-[12px] shadow-soft max-tab:gap-1.5 max-tab:p-3"
          >
            {p.board.columns.map((c) => (
              <div key={c.name} className="flex min-w-0 flex-col gap-1.5">
                <span className="truncate pb-1 text-[11px] font-semibold tracking-[0.04em] text-ink-muted uppercase">{c.name}</span>
                {c.highlight && (
                  <span className="rounded-lg border border-accent bg-accent-wash px-2 py-2 text-[11.5px] leading-tight font-semibold text-ink">
                    {c.highlight}
                  </span>
                )}
                {Array.from({ length: c.cards }, (_, i) => (
                  <span key={i} className="flex flex-col gap-1 rounded-lg bg-surface-tint px-2 py-2">
                    <span className="h-1.5 w-4/5 rounded-full bg-border" />
                    <span className="h-1.5 w-1/2 rounded-full bg-border" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </figure>
        <span aria-hidden="true" className="hidden text-[22px] text-ink-muted desk:block">
          →
        </span>
        <figure className="m-0 flex flex-col gap-3">
          <span className={`${LABEL} text-accent-ink`}>{p.request.label}</span>
          <div aria-hidden="true" className="flex flex-col gap-3 rounded-[20px] bg-surface p-5 text-[13.5px] shadow-raised">
            <PanelHeading>
              {p.request.id}
              <span className="tracking-normal normal-case">{p.request.title}</span>
            </PanelHeading>
            <TintRows rows={p.request.rows} />
            <span className="text-[13px] text-ink-muted">{p.request.footer}</span>
          </div>
        </figure>
      </div>
      <p data-rise="" className="mt-5 px-1 text-[17px] font-semibold text-pretty text-ink">
        <Rich text={p.caption} />
      </p>
      <div data-rise-group="" className="mt-10 grid grid-cols-1 gap-[18px] desk:grid-cols-3">
        {p.points.map((pt) => (
          <div key={pt.title} data-rise="" className="flex flex-col gap-2.5 border-t-2 border-accent pt-5">
            <h3 className="text-[19px] font-semibold tracking-[-0.02em] text-ink">{pt.title}</h3>
            <p className="text-[16px] text-pretty text-ink-muted">
              <Rich text={pt.body} />
            </p>
          </div>
        ))}
      </div>
    </NarrowBand>
  );
}

/* ---------- The bill as your client list grows ---------- */

function Cost({ cost: c }: { cost: ClickUpComparison["cost"] }) {
  return (
    <NarrowBand id="cost" labelledBy="cost-h">
      <BandHead id="cost-h" title={c.title} lede={c.lede} />
      <div data-rise="">
        <ClickUpBillChart title={c.chartTitle} teamLabel={c.teamLabel} hint={c.hint} />
      </div>
      <p data-rise="" className="mt-5 max-w-[960px] px-1 text-[13.5px] leading-[1.5] text-pretty text-ink-muted">
        <Rich text={c.note} />
      </p>
      <PricingNudge className="mt-6 px-1" />
    </NarrowBand>
  );
}

/* ---------- Page ---------- */

export function ClickUpComparePage({ content: c }: { content: ClickUpComparison }) {
  return (
    <>
      <Hero hero={c.hero} />
      <Room room={c.room} />
      <Learn learn={c.learn} />
      <Promises promise={c.promise} />
      <Cost cost={c.cost} />
      <FeatureTable table={c.table} competitor={c.competitor} />
      <Faq faq={c.faq} />
      <Proof proof={c.proof} />
      <CtaBand width={680} title={c.cta.title} body={c.cta.body} note={c.cta.disclaimer} />
    </>
  );
}
