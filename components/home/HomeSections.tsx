import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { Route } from "next";
import type { Href } from "@/lib/links";
import { Logo } from "../Logo";
import { SmartLink } from "../SmartLink";

/* ---------- Main features: numbered step cards joined by a faint line ---------- */

export type Step = { kicker: string; title: string; body: string };

export function StepCards({ steps }: { steps: Step[] }) {
  return (
    <div data-rise-group="" className="relative grid grid-cols-1 gap-[18px] tab:grid-cols-2 desk:grid-cols-4">
      <div
        aria-hidden="true"
        className="absolute inset-x-7 top-[47px] hidden h-px bg-stepline opacity-55 desk:block"
      />
      {steps.map((s, i) => (
        <div
          key={s.kicker}
          data-rise=""
          className="lift relative flex flex-col gap-3.5 rounded-3xl bg-surface px-7 pt-[30px] pb-8 shadow-soft [--lift-shadow:var(--shadow-hover)] [--lift-y:-5px]"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-[34px] items-center justify-center rounded-[11px] bg-ink text-[14px] font-extrabold text-on-ink">
              {i + 1}
            </span>
            <span className="text-[12.5px] font-semibold tracking-[0.09em] text-ink-muted uppercase">{s.kicker}</span>
          </div>
          <h3 className="text-[23px] leading-[1.15] font-semibold tracking-[-0.02em] text-balance text-ink">{s.title}</h3>
          <p className="text-[16.5px] leading-normal text-pretty text-ink-muted">{s.body}</p>
        </div>
      ))}
    </div>
  );
}

/* ---------- "In a guest account" checklist ---------- */

export function Checklist({ title, items }: { title: string; items: { ok: boolean; text: string }[] }) {
  return (
    <div className="rounded-[18px] bg-surface px-[22px] pt-2 pb-3.5">
      <span className="block pt-3.5 pb-1 text-[12px] font-semibold tracking-[0.09em] text-ink-muted uppercase">{title}</span>
      {items.map((it, i) => (
        <div
          key={it.text}
          className={`grid grid-cols-[22px_1fr] items-start gap-3 py-[13px] ${i < items.length - 1 ? "border-b border-border" : ""}`}
        >
          <span aria-hidden="true" className={`text-[14px] leading-normal font-extrabold ${it.ok ? "text-accent" : "text-ink-muted"}`}>
            {it.ok ? "✓" : "×"}
          </span>
          <span className="text-[15.5px] leading-[1.45] text-ink">
            <span className="sr-only">{it.ok ? "Included: " : "Not included: "}</span>
            {it.text}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Users vs guests cards on the dark panel ---------- */

const userDots = ["bg-avatar-user-1", "bg-avatar-user-2", "bg-avatar-user-3"];
const guestDots = ["bg-avatar-guest-1", "bg-avatar-guest-2", "bg-avatar-guest-3", "bg-avatar-guest-4"];

export function AudienceCard({ kind, label, title, body }: { kind: "users" | "guests"; label: string; title: string; body: string }) {
  const guests = kind === "guests";
  const dots = guests ? guestDots : userDots;
  return (
    <div className={`flex flex-col gap-[13px] rounded-[22px] p-7 ${guests ? "bg-accent-wash" : "bg-on-deep-panel"}`}>
      {/* Accent label is on the dark panel here, where it has enough contrast. */}
      <span className={`text-[12px] font-semibold tracking-[0.09em] uppercase ${guests ? "text-accent" : "text-on-deep-muted"}`}>{label}</span>
      <span className="text-[30px] leading-[1.1] font-semibold tracking-[-0.03em] text-on-deep">{title}</span>
      <p className="text-[15px] leading-normal">{body}</p>
      {/* 32px dots plus a 2px ring: the design sizes them content-box, so 36px overall. */}
      <div aria-hidden="true" className="mt-1.5 flex">
        {dots.map((d, i) => (
          <span key={d} className={`size-9 rounded-full border-2 border-deep ${d} ${i ? "-ml-[11px]" : ""}`} />
        ))}
        {guests && (
          <span className="-ml-[11px] flex size-9 items-center justify-center rounded-full border-2 border-deep bg-avatar-guest-5 text-[12px] font-semibold text-deep">
            +
          </span>
        )}
      </div>
    </div>
  );
}

/* ---------- "Take a closer look" link cards ---------- */

export type DiscoverItem = { title: string; body: string; href: Route };

export function DiscoverGrid({ items }: { items: DiscoverItem[] }) {
  return (
    <div data-rise-group="" className="grid grid-cols-1 gap-[18px] tab:grid-cols-2 desk:grid-cols-4">
      {items.map((it) => (
        <Link
          key={it.title}
          href={it.href}
          data-rise=""
          className="lift flex flex-col gap-[9px] rounded-[20px] bg-surface-tint px-6 pt-[26px] pb-6 text-ink shadow-soft [--lift-shadow:var(--shadow-hover)] [--lift-y:-4px] hover:text-ink"
        >
          <h3 className="text-[21px] font-semibold tracking-[-0.02em]">{it.title}</h3>
          <p className="text-[15.5px] leading-normal text-pretty text-ink-muted">{it.body}</p>
          <span className="mt-3.5 inline-flex items-center gap-2 self-start rounded-xl bg-surface px-4 py-2.5 text-[14.5px] font-semibold text-ink shadow-pill">
            Learn more
            <span aria-hidden="true" className="text-accent">
              →
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}

/* ---------- Use case tiles ---------- */

export function LinkTiles({ links }: { links: { label: string; href: Href }[] }) {
  return (
    <div data-rise-group="" className="grid grid-cols-2 gap-3 desk:grid-cols-4">
      {links.map((l) => (
        <SmartLink
          key={l.href}
          href={l.href}
          className="lift flex items-center justify-between gap-3 rounded-[14px] bg-surface-tint px-[18px] py-[15px] text-[15.5px] font-semibold text-ink shadow-[0_1px_2px_rgba(15,23,32,.04)] [--lift-shadow:var(--shadow-hover)] hover:text-ink"
        >
          {l.label}
          <span aria-hidden="true" className="text-accent">
            →
          </span>
        </SmartLink>
      ))}
    </div>
  );
}

/* ---------- Kolabr vs competitor logo cards ---------- */

export type CompareCard = { name: string; logo: StaticImageData; alt: string; href: Href };

export function CompareLogoGrid({ items }: { items: CompareCard[] }) {
  return (
    <div data-rise-group="" className="grid grid-cols-1 gap-3 tab:grid-cols-2 desk:grid-cols-4">
      {items.map((c) => (
        <SmartLink
          key={c.href}
          href={c.href}
          data-rise=""
          aria-label={`Kolabr vs ${c.name}`}
          className="lift flex flex-col gap-[18px] rounded-[18px] bg-surface px-[22px] pt-6 pb-5 text-ink shadow-subtle [--lift-y:-3px] hover:text-ink"
        >
          <span className="grid min-h-[46px] grid-cols-[1fr_auto_1fr] items-center gap-3.5">
            <span className="flex justify-center">
              <Logo className="h-5 w-auto text-ink" />
            </span>
            <span className="text-[13px] font-semibold tracking-[0.02em] text-ink-muted">vs</span>
            <span className="flex h-[42px] items-center justify-center">
              <Image src={c.logo} alt={c.alt} sizes="160px" className="h-[38px] w-auto max-w-full object-contain" />
            </span>
          </span>
          <span className="flex items-center justify-between gap-2.5 border-t border-border pt-3.5 text-[15.5px] font-semibold">
            Kolabr vs {c.name}
            <span aria-hidden="true" className="text-accent">
              →
            </span>
          </span>
        </SmartLink>
      ))}
    </div>
  );
}
