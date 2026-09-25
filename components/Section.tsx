import type { ComponentPropsWithoutRef, ReactNode } from "react";

type SectionProps = ComponentPropsWithoutRef<"section"> & { tint?: boolean };

/**
 * A full-width page band. Horizontal padding is 40px (20px below 700px) and every band drops
 * to 86px vertical padding below 700px, as in the design. Pass the desktop vertical padding
 * in className (the design varies it per section: 120, 130, 140...).
 */
export function Section({ tint = false, className = "", children, ...props }: SectionProps) {
  return (
    <section
      className={`px-10 max-tab:!px-5 max-tab:!py-[86px] ${tint ? "bg-surface-tint" : ""} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

/** The 1400px content column. The design's padding sits outside this width. */
export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto max-w-content ${className}`}>{children}</div>;
}

/** Small uppercase label with the accent dot, above most section headings. */
export function Eyebrow({ children, onDark = false }: { children: ReactNode; onDark?: boolean }) {
  return (
    <span
      className={`flex items-center gap-2.5 text-[13px] font-semibold tracking-[0.1em] uppercase ${
        onDark ? "text-accent" : "text-ink-muted"
      }`}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
      {children}
    </span>
  );
}

/** A plain uppercase kicker without the dot (used above h3s inside cards). */
export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`text-[12.5px] font-semibold tracking-[0.1em] text-ink-muted uppercase ${className}`}>{children}</span>
  );
}
