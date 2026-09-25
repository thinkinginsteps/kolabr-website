import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import { UnderlineLink } from "../UnderlineLink";

// Building blocks shared by the eight product pages. Measurements are the design's.

const H2 = "text-[clamp(34px,3.7vw,54px)] leading-[1.04] font-semibold tracking-[-0.03em] text-balance text-ink";
const PAD = "px-10 max-tab:!px-5 max-tab:!py-[86px]";

/* ---------- Hero ---------- */

export function ProductHero({ title, lede, children }: { title: string; lede: ReactNode; children?: ReactNode }) {
  return (
    <section
      aria-labelledby="ch-hero"
      className={`relative bg-hero-glow pt-[196px] pb-[130px] ${PAD}`}
    >
      <div className="mx-auto max-w-content">
        <div data-rise="" className="flex max-w-[820px] flex-col gap-5">
          <h1
            id="ch-hero"
            className="text-[clamp(38px,4.6vw,66px)] leading-none font-extrabold tracking-[-0.04em] text-balance text-ink"
          >
            {title}
          </h1>
          <p className="max-w-[680px] text-[20.5px] leading-normal text-pretty text-ink-muted">{lede}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

/** Full-width framed screenshot (hero and screenshot sections). */
export function Screenshot({
  image,
  alt,
  preload = false,
  className = "",
}: {
  image: StaticImageData;
  alt: string;
  preload?: boolean;
  className?: string;
}) {
  return (
    <figure data-rise="" className={`m-0 overflow-hidden rounded-[20px] bg-surface shadow-shot ${className}`}>
      <Image src={image} alt={alt} preload={preload} sizes="(max-width: 1480px) 100vw, 1400px" className="h-auto w-full" />
    </figure>
  );
}

/* ---------- Split: heading, numbered points, figure ---------- */

export type Point = { title: string; body: string };

export function SplitFeature({
  id,
  title,
  lede,
  points,
  figure,
}: {
  id: string;
  title: string;
  lede: string;
  points: Point[];
  figure: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={`mx-auto max-w-[1480px] py-[110px] ${PAD}`}>
      <div className="grid grid-cols-1 items-center gap-12 desk:grid-cols-[minmax(0,1fr)_minmax(0,.92fr)] desk:gap-24">
        <div data-rise="" className="flex max-w-[620px] flex-col gap-6">
          <h2 id={`${id}-h`} className={H2}>
            {title}
          </h2>
          <p className="text-[20.5px] leading-normal text-pretty">{lede}</p>
          <div className="mt-3 flex flex-col gap-0.5">
            {points.map((p, i) => (
              <div
                key={p.title}
                className={`grid grid-cols-[44px_1fr] gap-[18px] border-t border-border py-[22px] ${i === points.length - 1 ? "border-b" : ""}`}
              >
                <span className="flex size-11 items-center justify-center rounded-[14px] bg-surface-tint text-[15px] font-semibold text-ink">
                  {i + 1}
                </span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-[19.5px] font-semibold tracking-[-0.015em] text-ink">{p.title}</h3>
                  <p className="text-[16.5px]">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {figure}
      </div>
    </section>
  );
}

/**
 * The figure beside a split: a tinted rounded backdrop with the content floated over it.
 * `wide` is the backdrop that bleeds right for oversized screenshots.
 */
export function SplitFigure({
  children,
  align = "center",
  wide = false,
  minHeight = 620,
}: {
  children: ReactNode;
  align?: "center" | "start";
  wide?: boolean;
  minHeight?: 600 | 620;
}) {
  return (
    <figure
      data-rise=""
      className={`relative m-0 flex items-center max-desk:!min-h-0 max-desk:!py-10 ${align === "start" ? "justify-start" : "justify-center"} ${
        minHeight === 600 ? "min-h-[600px]" : "min-h-[620px]"
      }`}
    >
      <div
        aria-hidden="true"
        className={`absolute rounded-[32px] bg-backdrop-tint ${
          wide ? "inset-y-[8%] -right-[8%] -left-[4%]" : "inset-x-0 inset-y-[6%]"
        }`}
      />
      {children}
    </figure>
  );
}

/** A framed image inside a SplitFigure. `width` is the design's CSS width, e.g. "min(470px,92%)". */
export function FramedImage({
  image,
  alt,
  width,
  plainShadow = false,
  float = false,
  centered = false,
  sizes = "(max-width: 1080px) 92vw, 560px",
}: {
  image: StaticImageData;
  alt: string;
  width: string;
  plainShadow?: boolean;
  float?: boolean;
  centered?: boolean;
  sizes?: string;
}) {
  return (
    <div
      style={{ width }}
      className={`relative overflow-hidden rounded-[18px] bg-surface ${plainShadow ? "shadow-shot-plain" : "shadow-float"} ${
        float ? "animate-float" : ""
      } ${centered ? "mx-auto" : ""}`}
    >
      <Image src={image} alt={alt} sizes={sizes} className="h-auto w-full" />
    </div>
  );
}

/* ---------- Screenshot section: heading and a full-width screenshot ---------- */

export function ShotSection({
  id,
  title,
  lede,
  image,
  alt,
  figure,
  first = true,
}: {
  id: string;
  title: string;
  lede: string;
  image?: StaticImageData;
  alt?: string;
  /** Replaces the screenshot (the Mobile app page shows phones here). */
  figure?: ReactNode;
  /** The first one after a split has 40px top padding; one that follows another has none. */
  first?: boolean;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={`${first ? "pt-10" : "pt-0"} pb-[150px] ${PAD}`}>
      <div className="mx-auto flex max-w-content flex-col gap-12">
        <div data-rise="" className="flex max-w-[760px] flex-col gap-5">
          <h2 id={`${id}-h`} className={H2}>
            {title}
          </h2>
          <p className="text-[20px] text-pretty">{lede}</p>
        </div>
        {figure ?? (image && <Screenshot image={image} alt={alt ?? ""} />)}
      </div>
    </section>
  );
}

/* ---------- Bento: one wide glass card, one dark card, three plain cards ---------- */

export function BentoSection({ id, title, lede, children }: { id: string; title: string; lede: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={`pt-0 pb-[150px] ${PAD}`}>
      <div className="mx-auto max-w-content">
        <div data-rise="" className="mb-14 flex max-w-[760px] flex-col gap-5">
          <h2 id={`${id}-h`} className={H2}>
            {title}
          </h2>
          <p className="text-[20px] text-pretty">{lede}</p>
        </div>
        <div data-rise-group="" className="grid grid-cols-1 gap-[18px] tab:grid-cols-2 desk:grid-cols-6">
          {children}
        </div>
      </div>
    </section>
  );
}

/** The inline link at the end of a bento lede ("See how requests carry the outcome"). */
export function LedeLink({ href, children }: { href: Route; children: ReactNode }) {
  return (
    <>
      {" "}
      <UnderlineLink href={href} inline>
        {children}
      </UnderlineLink>
      .
    </>
  );
}

type WideCardProps = {
  title: string;
  body: ReactNode;
  /** Text link at the bottom of the text column. */
  link?: { label: string; href: Route };
  /** Makes the whole card a link; `link.label` is then shown as a plain underlined label. */
  cardHref?: Route;
  aside: ReactNode;
  /** Width of the aside column: the design uses .9fr, and .72fr (vertically centred) once. */
  narrowAside?: boolean;
};

export function WideCard({ title, body, link, cardHref, aside, narrowAside = false }: WideCardProps) {
  const cls = `glass grid grid-cols-1 gap-[22px] rounded-3xl p-[34px] text-ink shadow-card desk:col-span-4 desk:gap-8 ${
    narrowAside ? "items-center desk:grid-cols-[minmax(0,1fr)_minmax(0,.72fr)]" : "items-start desk:grid-cols-[minmax(0,1fr)_minmax(0,.9fr)]"
  }`;
  const text = (
    <div className={`flex flex-col gap-3 ${narrowAside ? "" : "min-h-full self-stretch"}`}>
      <h3 className="text-[27px] font-semibold tracking-[-0.02em]">{title}</h3>
      <p className="text-[16.5px] text-ink-muted">{body}</p>
      {link && (
        <span className="mt-auto self-start pt-[22px]">
          {cardHref ? (
            <span className="border-b-2 border-accent pb-px text-[15.5px] font-semibold">{link.label}</span>
          ) : (
            <UnderlineLink href={link.href} className="text-[15.5px]">
              {link.label}
            </UnderlineLink>
          )}
        </span>
      )}
    </div>
  );
  if (cardHref) {
    return (
      <Link href={cardHref} data-rise="" className={`${cls} transition-transform duration-400 ease-out-soft hover:-translate-y-1 hover:text-ink`}>
        {text}
        {aside}
      </Link>
    );
  }
  return (
    <div data-rise="" className={cls}>
      {text}
      {aside}
    </div>
  );
}

/** Image in the aside of a WideCard. */
export function CardImage({ image, alt, maxHeight }: { image: StaticImageData; alt: string; maxHeight?: number }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface shadow-subtle" style={maxHeight ? { maxHeight } : undefined}>
      <Image src={image} alt={alt} sizes="(max-width: 1080px) 90vw, 520px" className="block h-auto w-full" />
    </div>
  );
}

/** White panel in the aside of a WideCard, holding a small illustration. */
export function CardPanel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex flex-col rounded-2xl bg-surface shadow-subtle ${className}`}>{children}</div>;
}

export function DeepCard({
  title,
  body,
  children,
  alignStart = false,
  bleed = false,
}: {
  title: string;
  body: ReactNode;
  children?: ReactNode;
  /** The card keeps its own height instead of stretching to the row. */
  alignStart?: boolean;
  /** Bottom padding removed so an image can run off the bottom edge. */
  bleed?: boolean;
}) {
  return (
    <div
      data-rise=""
      className={`flex flex-col rounded-3xl bg-deep text-on-deep-muted shadow-card desk:col-span-2 ${alignStart ? "self-start" : ""} ${
        bleed ? "gap-3.5 overflow-hidden px-[34px] pt-[34px]" : "gap-4 p-[34px]"
      }`}
    >
      <h3 className="text-[24px] font-semibold tracking-[-0.02em] text-on-deep">{title}</h3>
      <p className="text-[16px]">{body}</p>
      {children}
    </div>
  );
}

/** Rows on the dark card. `highlight` is the accent-tinted one. */
export function DeepRows({
  rows,
  atBottom = false,
  stacked = false,
}: {
  rows: { label: string; value: string; highlight?: boolean }[];
  atBottom?: boolean;
  /** Label above value instead of side by side. */
  stacked?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-[9px] ${atBottom ? "mt-auto" : ""}`}>
      {rows.map((r) => (
        <div
          key={r.label}
          className={`flex rounded-[13px] px-3.5 py-3 ${r.highlight ? "bg-accent-soft" : "bg-on-deep-panel"} ${
            stacked ? "flex-col gap-0.5" : "justify-between gap-2.5"
          }`}
        >
          <span className="text-[14.5px] font-semibold text-on-deep">{r.label}</span>
          <span className="text-[13px]">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

export function PlainCard({
  title,
  body,
  children,
  href,
  linkLabel,
  alignStart = false,
  bleed = false,
}: {
  title: string;
  body: ReactNode;
  children?: ReactNode;
  /** Makes the whole card a link, with `linkLabel` underlined at the bottom. */
  href?: Route;
  linkLabel?: string;
  alignStart?: boolean;
  /** No bottom padding, so a BleedImage can run off the bottom edge. */
  bleed?: boolean;
}) {
  const cls = `flex flex-col gap-3.5 rounded-3xl bg-surface text-ink shadow-subtle desk:col-span-2 ${alignStart ? "self-start" : ""} ${
    bleed ? "overflow-hidden px-[34px] pt-[34px]" : "p-[34px]"
  }`;
  const inner = (
    <>
      <h3 className="text-[24px] font-semibold tracking-[-0.02em]">{title}</h3>
      <p className="text-[16px] text-ink-muted">{body}</p>
      {children}
      {linkLabel && <span className="self-start border-b-2 border-accent pb-px text-[15.5px] font-semibold">{linkLabel}</span>}
    </>
  );
  if (href) {
    return (
      <Link href={href} data-rise="" className={`lift ${cls} [--lift-y:-4px] hover:text-ink`}>
        {inner}
      </Link>
    );
  }
  return (
    <div data-rise="" className={cls}>
      {inner}
    </div>
  );
}

/* ---------- Closing questions: heading, lede, three or four tinted cards ---------- */

export function QuestionSection({
  title,
  lede,
  items,
}: {
  title: string;
  lede: ReactNode;
  items: { title: string; body: ReactNode }[];
}) {
  return (
    <section aria-labelledby="both-h" className={`mx-auto max-w-[1480px] pt-0 pb-[150px] ${PAD}`}>
      <div data-rise="" className="mb-12 flex max-w-[720px] flex-col gap-[18px]">
        <h2
          id="both-h"
          className="text-[clamp(32px,3.4vw,48px)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-ink"
        >
          {title}
        </h2>
        <p className="text-[20px] text-pretty">{lede}</p>
      </div>
      <div data-rise-group="" className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[18px] max-tab:grid-cols-1">
        {items.map((it) => (
          <div key={it.title} data-rise="" className="flex flex-col gap-3 rounded-3xl bg-surface-tint p-9">
            <h3 className="text-[21px] font-semibold tracking-[-0.02em] text-ink">{it.title}</h3>
            <p className="text-[16.5px]">{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Screenshot crop that runs off the bottom edge of a card (use with `bleed` cards). */
export function BleedImage({
  image,
  alt,
  className = "",
  shadow = "dark",
}: {
  image: StaticImageData;
  alt: string;
  className?: string;
  /** "dark" on the deep card, "light" on a white card. */
  shadow?: "dark" | "light";
}) {
  return (
    <div
      className={`mx-auto w-[min(300px,100%)] overflow-hidden rounded-t-[14px] ${
        shadow === "dark" ? "shadow-[0_-20px_60px_-20px_rgba(0,0,0,.5)]" : "shadow-[0_-20px_50px_-24px_rgba(51,80,91,.45)]"
      } ${className}`}
    >
      <Image src={image} alt={alt} sizes="300px" className="block h-auto w-full" />
    </div>
  );
}
