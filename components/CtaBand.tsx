import type { ReactNode } from "react";
import type { Href } from "@/lib/links";
import { SIGNUP_PATH } from "@/lib/site";
import { ButtonLink } from "./ButtonLink";

type CtaBandProps = {
  title: ReactNode;
  body: ReactNode;
  primary?: { label: string; href: Href };
  secondary?: { label: string; href: Href };
  /** Replaces the default two buttons (the Mobile app page puts store buttons here). */
  actions?: ReactNode;
  /** Text column width: 660px by default; use cases, compare and Contact use 680, About 700. */
  width?: 660 | 680 | 700;
  /** Small print under the buttons (the compare pages' trademark note). */
  note?: ReactNode;
};

const WIDTHS = { 660: "max-w-[660px]", 680: "max-w-[680px]", 700: "max-w-[700px]" } as const;

/** The closing call to action band (#cta). Heading and line change per page; buttons rarely do. */
export function CtaBand({
  title,
  body,
  primary = { label: "Start free trial", href: SIGNUP_PATH },
  secondary = { label: "Talk to us", href: "/contact" },
  actions,
  width = 660,
  note,
}: CtaBandProps) {
  return (
    <section
      id="cta"
      aria-labelledby="cta-h"
      className="relative bg-cta-glow px-10 pt-[150px] pb-[170px] text-center max-tab:px-5 max-tab:py-[86px]"
    >
      <div data-rise="" className={`mx-auto flex flex-col items-center gap-[26px] ${WIDTHS[width]}`}>
        <h2
          id="cta-h"
          className="text-[clamp(40px,4.6vw,66px)] leading-[0.99] font-semibold tracking-[-0.035em] text-balance text-ink"
        >
          {title}
        </h2>
        <p className="text-[20px] text-pretty">{body}</p>
        {actions ?? (
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink href={primary.href} size="lg">
              {primary.label}
            </ButtonLink>
            <ButtonLink href={secondary.href} variant="secondary" size="lg" className="[--lift-shadow:none]">
              {secondary.label}
            </ButtonLink>
          </div>
        )}
        {note && <p className="max-w-[560px] text-[14px] text-pretty text-ink-muted">{note}</p>}
      </div>
    </section>
  );
}
