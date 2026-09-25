import type { ReactNode } from "react";

const WIDTHS = { 820: "max-w-[820px]", 900: "max-w-[900px]" } as const;

/**
 * The plain text hero used by About and Contact: eyebrow, H1 and lede paragraphs over the
 * hero glow. The design varies the column width, the gap and the bottom padding per page.
 */
export function PageHero({
  id,
  eyebrow,
  title,
  width,
  gap,
  bottom,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  width: keyof typeof WIDTHS;
  gap: "gap-5" | "gap-[22px]";
  bottom: "pb-[110px]" | "pb-[130px]";
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={`relative bg-hero-glow px-10 pt-[196px] ${bottom} max-tab:!px-5 max-tab:!pt-[124px] max-tab:!pb-0`}>
      <div className="mx-auto max-w-content">
        <div data-rise="" className={`flex flex-col ${gap} ${WIDTHS[width]}`}>
          <span className="text-[12px] font-semibold tracking-[0.12em] text-accent-ink uppercase">{eyebrow}</span>
          <h1 id={id} className="text-[clamp(38px,4.6vw,66px)] leading-none font-extrabold tracking-[-0.04em] text-balance text-ink">
            {title}
          </h1>
          {children}
        </div>
      </div>
    </section>
  );
}

/** A hero lede paragraph. */
export function HeroLede({ width, children }: { width: "max-w-[700px]" | "max-w-[740px]"; children: ReactNode }) {
  return <p className={`${width} text-[20.5px] leading-normal text-pretty text-ink-muted`}>{children}</p>;
}
