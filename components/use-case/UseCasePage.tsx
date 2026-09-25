import Image from "next/image";
import type { ReactNode } from "react";
import { ButtonLink } from "../ButtonLink";
import { CtaBand } from "../CtaBand";
import { CardPanel, DeepCard, DeepRows, FramedImage, PlainCard, QuestionSection, Screenshot, SplitFigure, WideCard } from "../product/ProductSections";
import { Rich } from "../Rich";
import type { Faq } from "@/lib/use-case-faqs";
import type { Card, Rich as RichText, Shot, UseCase } from "@/lib/use-cases";
import { screens } from "@/lib/use-case-images";
import { SIGNUP_PATH } from "@/lib/site";

// Sections of the use case pages. The twelve industry pages compose them in a fixed order
// (UseCasePage below, copy from lib/use-cases.ts); Schools composes them in its own order.

const H2 = "text-[clamp(34px,3.7vw,54px)] leading-[1.04] font-semibold tracking-[-0.03em] text-balance text-ink";
const PAD = "px-10 max-tab:!px-5 max-tab:!py-[86px]";
type HeadWidth = 760 | 780 | 800 | 820;
const HEAD_W: Record<HeadWidth, string> = { 760: "max-w-[760px]", 780: "max-w-[780px]", 800: "max-w-[800px]", 820: "max-w-[820px]" };

function Head({ id, title, lede, max, className = "" }: { id: string; title: string; lede: RichText; max: HeadWidth; className?: string }) {
  return (
    <div data-rise="" className={`flex flex-col gap-5 ${HEAD_W[max]} ${className}`}>
      <h2 id={id} className={H2}>
        {title}
      </h2>
      <p className="text-[20px] text-pretty">
        <Rich text={lede} />
      </p>
    </div>
  );
}

/** White cards (channels), tinted cards (requests) or small tinted cards (beside a figure). */
function CardGrid({ cards, tone }: { cards: Card[]; tone: "white" | "tint" | "small" }) {
  const grid = {
    white: "grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[18px] max-tab:grid-cols-1",
    tint: "grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[18px] max-tab:grid-cols-1",
    small: "grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3",
  }[tone];
  return (
    <div data-rise-group="" className={`grid ${grid}`}>
      {cards.map((c) =>
        tone === "white" ? (
          <div key={c.title} data-rise="" className="flex flex-col gap-3.5 rounded-3xl bg-surface p-[34px] text-ink shadow-subtle">
            <h3 className="text-[23px] font-semibold tracking-[-0.02em]">{c.title}</h3>
            <p className="text-[16.5px] text-ink-muted">
              <Rich text={c.body} />
            </p>
          </div>
        ) : tone === "tint" ? (
          <div key={c.title} data-rise="" className="flex flex-col gap-3 rounded-3xl bg-surface-tint p-9">
            <h3 className="text-[21px] font-semibold tracking-[-0.02em] text-ink">{c.title}</h3>
            <p className="text-[16.5px]">
              <Rich text={c.body} />
            </p>
          </div>
        ) : (
          <div key={c.title} data-rise="" className="flex flex-col gap-2 rounded-3xl bg-surface-tint p-6">
            <h3 className="text-[18px] font-semibold text-ink">{c.title}</h3>
            <p className="text-[15.5px]">
              <Rich text={c.body} />
            </p>
          </div>
        ),
      )}
    </div>
  );
}

function Points({ points }: { points: Card[] }) {
  return (
    <>
      {points.map((p, i) => (
        <div key={p.title} className={`grid grid-cols-[44px_1fr] gap-[18px] border-t border-border py-[22px] ${i === points.length - 1 ? "border-b" : ""}`}>
          <span className="flex size-11 items-center justify-center rounded-[14px] bg-surface-tint text-[15px] font-semibold text-ink">{i + 1}</span>
          <div className="flex flex-col gap-1.5">
            <h3 className="text-[19.5px] font-semibold tracking-[-0.015em] text-ink">{p.title}</h3>
            <p className="text-[16.5px]">
              <Rich text={p.body} />
            </p>
          </div>
        </div>
      ))}
    </>
  );
}

/* ---------- Sections ---------- */

export function UseCaseHero({ hero }: { hero: UseCase["hero"] }) {
  return (
    <section aria-labelledby="uc-hero" className="relative bg-hero-glow px-10 pt-[196px] pb-[130px] max-tab:!px-5 max-tab:!pt-[124px] max-tab:!pb-0">
      <div className="mx-auto max-w-content">
        <div data-rise="" className="flex max-w-[860px] flex-col gap-5">
          <span className="text-[12px] font-semibold tracking-[0.12em] text-accent-ink uppercase">{hero.eyebrow}</span>
          <h1 id="uc-hero" className="text-[clamp(38px,4.6vw,66px)] leading-none font-extrabold tracking-[-0.04em] text-balance text-ink">
            {hero.title}
          </h1>
          <p className="max-w-[720px] text-[20.5px] leading-normal text-pretty text-ink-muted">
            <Rich text={hero.lede} />
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <ButtonLink href={SIGNUP_PATH} size="lg">
              Start free trial
            </ButtonLink>
            <ButtonLink href="/pricing" variant="secondary" size="lg" className="[--lift-shadow:none]">
              See pricing
            </ButtonLink>
          </div>
          {hero.note && (
            <p className="max-w-[640px] pt-1 text-[15px] text-ink-muted">
              <Rich text={hero.note} />
            </p>
          )}
        </div>
        <Screenshot preload className="mt-16" image={screens[hero.image.file]} alt={hero.image.alt} />
      </div>
    </section>
  );
}

/** "Where a … puts its channels": six white cards and the seat-count note. */
export function ChannelsSection({ data, headWidth = 780 }: { data: UseCase["channels"]; headWidth?: HeadWidth }) {
  return (
    <section id="channels" aria-labelledby="uc-channels-h" className={`${PAD} pt-[110px] pb-[150px]`}>
      <div className="mx-auto max-w-content">
        <Head id="uc-channels-h" title={data.title} lede={data.lede} max={headWidth} className="mb-14" />
        <CardGrid cards={data.cards} tone="white" />
        <p data-rise="" className={`mt-7 text-[16.5px] text-pretty text-ink-muted ${HEAD_W[headWidth]}`}>
          <Rich text={data.seatNote} />
        </p>
      </div>
    </section>
  );
}

/** Heading, full-width screenshot, then optional tinted cards. */
export function ShotBand({
  id,
  title,
  lede,
  image,
  cards,
  headWidth = 800,
}: {
  id: string;
  title: string;
  lede: RichText;
  image: Shot;
  cards?: Card[];
  headWidth?: HeadWidth;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={`${PAD} pt-0 pb-[150px]`}>
      <div className="mx-auto flex max-w-content flex-col gap-12">
        <Head id={`${id}-h`} title={title} lede={lede} max={headWidth} />
        <Screenshot image={screens[image.file]} alt={image.alt} />
        {cards && <CardGrid cards={cards} tone="tint" />}
      </div>
    </section>
  );
}

/** Two-column band. `media` is the figure; `mediaFirst` puts it on the left (.92fr / 1fr). */
export function SplitBand({
  id,
  title,
  lede,
  media,
  mediaFirst = false,
  children,
}: {
  id: string;
  title: string;
  lede: RichText;
  media: ReactNode;
  mediaFirst?: boolean;
  /** Numbered points or small cards under the lede. */
  children: ReactNode;
}) {
  const text = (
    <div data-rise="" className="flex max-w-[620px] flex-col gap-6">
      <h2 id={`${id}-h`} className={H2}>
        {title}
      </h2>
      <p className="text-[20.5px] leading-normal text-pretty">
        <Rich text={lede} />
      </p>
      {children}
    </div>
  );
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={`${PAD} mx-auto max-w-[1480px] pt-0 pb-[150px]`}>
      <div
        className={`grid grid-cols-1 items-center gap-12 desk:gap-24 ${
          mediaFirst ? "desk:grid-cols-[minmax(0,.92fr)_minmax(0,1fr)]" : "desk:grid-cols-[minmax(0,1fr)_minmax(0,.92fr)]"
        }`}
      >
        {mediaFirst ? (
          <>
            {media}
            {text}
          </>
        ) : (
          <>
            {text}
            {media}
          </>
        )}
      </div>
    </section>
  );
}

export const SplitPoints = Points;
export const SmallCards = ({ cards }: { cards: Card[] }) => <CardGrid cards={cards} tone="small" />;

/** A plain framed screenshot beside a split. */
export function FramedShot({ image }: { image: Shot }) {
  return (
    <figure data-rise="" className="m-0 overflow-hidden rounded-[20px] bg-surface shadow-float">
      <Image src={screens[image.file]} alt={image.alt} sizes="(max-width: 1080px) 100vw, 680px" className="h-auto w-full" />
    </figure>
  );
}

/** A phone screenshot on the tinted backdrop beside a split. */
export function PhoneFigure({ image }: { image: Shot }) {
  return (
    <SplitFigure>
      <FramedImage width="min(470px,92%)" image={screens[image.file]} alt={image.alt} />
    </SplitFigure>
  );
}

/** Dashboard screenshot and the oversight bento. */
export function OversightSection({ data, headWidth = 780 }: { data: UseCase["oversight"]; headWidth?: HeadWidth }) {
  return (
    <section id="oversight" aria-labelledby="uc-ov-h" className={`${PAD} pt-0 pb-[150px]`}>
      <div className="mx-auto max-w-content">
        <Head id="uc-ov-h" title={data.title} lede={data.lede} max={headWidth} className="mb-14" />
        <Screenshot className="mb-[42px]" image={screens[data.image.file]} alt={data.image.alt} />
        <div data-rise-group="" className="grid grid-cols-1 gap-[18px] tab:grid-cols-2 desk:grid-cols-6">
          <WideCard
            title={data.wide.title}
            body={<Rich text={data.wide.body} />}
            link={data.wide.link}
            aside={
              <CardPanel className="gap-3 px-6 py-[22px] text-[14px]">
                {data.wide.rows.map((r) => (
                  <span key={r.label} className={`flex justify-between gap-2.5 text-ink ${r.total ? "border-t border-border pt-2.5" : ""}`}>
                    <span>{r.label}</span>
                    <span className={`font-semibold ${r.total ? "text-accent-ink" : ""}`}>{r.value}</span>
                  </span>
                ))}
              </CardPanel>
            }
          />
          <DeepCard alignStart title={data.deep.title} body={<Rich text={data.deep.body} />}>
            <DeepRows rows={data.deep.rows} />
          </DeepCard>
          {data.cards.map((card) => (
            <PlainCard key={card.title} title={card.title} body={<Rich text={card.body} />} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function StagesSection({ data }: { data: UseCase["stages"] }) {
  return (
    <QuestionSection
      title={data.title}
      lede={<Rich text={data.lede} />}
      items={data.cards.map((card) => ({ title: card.title, body: <Rich text={card.body} /> }))}
    />
  );
}

/**
 * Frequently asked questions, shown on the page and the source of its FAQPage schema. The
 * layout is the compare pages' FAQ grid; the answers come from lib/use-case-faqs.ts, which is
 * drawn from what the page itself says.
 */
export function UseCaseFaq({ items }: { items: Faq[] }) {
  return (
    <section id="faq" aria-labelledby="uc-faq-h" className={`${PAD} pt-0 pb-[150px]`}>
      <div className="mx-auto max-w-content">
        <div data-rise="" className="mb-11 flex max-w-[820px] flex-col gap-[18px]">
          <h2 id="uc-faq-h" className={H2}>
            Frequently asked questions
          </h2>
        </div>
        <div data-rise-group="" className="grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-[18px] max-tab:grid-cols-1">
          {items.map((item) => (
            <div key={item.q} data-rise="" className="flex flex-col gap-3 rounded-3xl bg-surface-tint p-[30px]">
              <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-pretty text-ink">{item.q}</h3>
              <p className="text-[16.5px] text-pretty">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function UseCaseCta({ data }: { data: UseCase["cta"] }) {
  return <CtaBand width={680} title={data.title} body={data.body} primary={{ label: data.primary, href: SIGNUP_PATH }} />;
}

/* ---------- The twelve-page template ---------- */

export function UseCasePage({ content: c, faqs }: { content: UseCase; faqs: Faq[] }) {
  return (
    <>
      <UseCaseHero hero={c.hero} />
      <ChannelsSection data={c.channels} />
      <ShotBand id={c.requests.id} title={c.requests.title} lede={c.requests.lede} image={c.requests.image} cards={c.requests.cards} />
      <SplitBand id={c.split.id} title={c.split.title} lede={c.split.lede} media={<FramedShot image={c.split.image} />}>
        <SplitPoints points={c.split.points} />
      </SplitBand>
      <SplitBand id={c.site.id} title={c.site.title} lede={c.site.lede} media={<PhoneFigure image={c.site.image} />} mediaFirst>
        <SmallCards cards={c.site.cards} />
      </SplitBand>
      <ShotBand id="calendar" title={c.calendar.title} lede={c.calendar.lede} image={c.calendar.image} />
      <OversightSection data={c.oversight} />
      <StagesSection data={c.stages} />
      <UseCaseFaq items={faqs} />
      <UseCaseCta data={c.cta} />
    </>
  );
}
