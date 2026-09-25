import type { ReactNode } from "react";

// Small UI sketches drawn inside the product page cards. All text, no images, so they stay
// sharp and are in the HTML. Colours and sizes are the design's.

/** Two chat bubbles: one incoming (tint), one outgoing (ink). */
export function ChatBubbles({ incoming, outgoing }: { incoming: string; outgoing: string }) {
  return (
    <div className="mt-auto flex flex-col gap-2 text-[13.5px]">
      <div className="flex items-end gap-2">
        <span className="size-[22px] flex-none rounded-full bg-deep" />
        <span className="rounded-[13px_13px_13px_4px] bg-surface-tint px-3 py-2 text-ink">{incoming}</span>
      </div>
      <div className="flex items-end justify-end gap-2">
        <span className="rounded-[13px_13px_4px_13px] bg-ink px-3 py-2 font-semibold text-on-ink">{outgoing}</span>
        <span className="size-[22px] flex-none rounded-full bg-avatar-guest-3" />
      </div>
    </div>
  );
}

/** Three video tiles in a row. */
export function VideoTiles() {
  return (
    <div aria-hidden="true" className="mt-auto grid grid-cols-3 gap-[7px]">
      <span className="aspect-[4/3] rounded-[10px] bg-deep" />
      <span className="aspect-[4/3] rounded-[10px] bg-ink-muted" />
      <span className="aspect-[4/3] rounded-[10px] bg-avatar-guest-3" />
    </div>
  );
}

/** Placeholder text lines, optionally under a title. */
export function SkeletonLines({ title, widths }: { title?: string; widths: string[] }) {
  return (
    <div className="mt-auto flex flex-col gap-[7px]">
      {title && <span className="text-[13.5px] font-semibold text-ink">{title}</span>}
      {widths.map((w, i) => (
        <span key={i} aria-hidden="true" className="h-[7px] rounded-[4px] bg-surface-tint" style={{ width: w }} />
      ))}
    </div>
  );
}

/** Tinted rows: bold label left, muted value right. */
export function TintRows({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="mt-auto flex flex-col gap-2 text-[13.5px]">
      {rows.map((r) => (
        <span key={r.label} className="flex justify-between gap-2.5 rounded-xl bg-surface-tint px-[13px] py-[11px] text-ink">
          <span className="font-semibold">{r.label}</span>
          <span className="text-ink-muted">{r.value}</span>
        </span>
      ))}
    </div>
  );
}

/** Tinted chips in a row ("Google Calendar", "Outlook"). */
export function Chips({ items, atBottom = true, wrap = false }: { items: string[]; atBottom?: boolean; wrap?: boolean }) {
  return (
    <div className={`flex gap-2 text-[13px] font-semibold ${atBottom ? "mt-auto" : ""} ${wrap ? "flex-wrap" : ""}`}>
      {items.map((c) => (
        <span key={c} className="rounded-[11px] bg-surface-tint px-[13px] py-[9px] text-ink">
          {c}
        </span>
      ))}
    </div>
  );
}

/** Round status pills; the first is highlighted. */
export function StatusPills({ items }: { items: string[] }) {
  return (
    <div className="mt-auto flex flex-wrap gap-[7px] text-[12.5px] font-semibold">
      {items.map((s, i) => (
        <span key={s} className={`rounded-full px-[11px] py-[5px] text-ink ${i === 0 ? "bg-accent-soft" : "bg-surface-tint"}`}>
          {s}
        </span>
      ))}
    </div>
  );
}

/**
 * A list with a small square badge before each line ("W" for wiki, "#" for a request).
 * `tone: "accent"` is the highlighted last line.
 */
export function BadgeList({ items }: { items: { badge: string; text: string; accent?: boolean }[] }) {
  return (
    <div className="mt-auto flex flex-col gap-2 text-[13.5px]">
      {items.map((it) => (
        <span key={it.text} className={`flex items-center gap-[9px] ${it.accent ? "text-ink-muted" : "text-ink"}`}>
          <span
            aria-hidden="true"
            className={`flex size-5 flex-none items-center justify-center rounded-[7px] text-[11px] ${
              it.accent ? "bg-accent-wash text-ink" : "bg-surface-tint text-ink-muted"
            }`}
          >
            {it.badge}
          </span>
          {it.text}
        </span>
      ))}
    </div>
  );
}

/** Numbered playbook steps; done steps have an accent badge. */
export function PlaybookSteps({ steps }: { steps: { text: string; done: boolean }[] }) {
  return (
    <div className="mt-auto flex flex-col gap-2 text-[13.5px] text-ink">
      {steps.map((s, i) => (
        <span key={s.text} className="flex items-center gap-[9px]">
          <span
            aria-hidden="true"
            className={`flex size-[18px] items-center justify-center rounded-[6px] text-[11px] ${
              s.done ? "bg-accent text-on-ink" : "bg-surface-tint text-ink-muted"
            }`}
          >
            {i + 1}
          </span>
          {s.text}
        </span>
      ))}
    </div>
  );
}

/** A small bar chart (heights in %, alternating strong and faint bars). */
export function Bars({ bars }: { bars: { height: number; strong: boolean }[] }) {
  return (
    <div aria-hidden="true" className="mt-auto flex h-16 items-end gap-1.5">
      {bars.map((b, i) => (
        <span
          key={i}
          className={`flex-1 rounded-t-[4px] bg-accent ${b.strong ? "opacity-90" : "opacity-50"}`}
          style={{ height: `${b.height}%` }}
        />
      ))}
    </div>
  );
}

/** A small uppercase label at the top of an aside panel, with an optional count. */
export function PanelHeading({ children, count, className = "" }: { children: ReactNode; count?: number; className?: string }) {
  return (
    <span
      className={`flex justify-between gap-2.5 text-[11.5px] font-semibold tracking-[0.1em] text-ink-muted uppercase ${className}`}
    >
      {children}
      {count !== undefined && <span>{count}</span>}
    </span>
  );
}

/** On/off switches with labels. */
export function Toggles({ items }: { items: { label: string; on: boolean }[] }) {
  return (
    <div className="mt-auto flex flex-col gap-2 text-[13.5px]">
      {items.map((t) => (
        <span key={t.label} className={`flex items-center justify-between gap-2.5 ${t.on ? "text-ink" : "text-ink-muted"}`}>
          {t.label}
          <span
            aria-hidden="true"
            className={`relative h-[19px] w-[34px] flex-none rounded-full ${t.on ? "bg-accent" : "bg-border"}`}
          >
            <span className={`absolute top-0.5 size-[15px] rounded-full bg-surface ${t.on ? "right-0.5" : "left-0.5"}`} />
          </span>
          <span className="sr-only">{t.on ? "(on)" : "(off)"}</span>
        </span>
      ))}
    </div>
  );
}

const SLA_TONE = { Breached: "text-status-breached", "At risk": "text-status-risk", "On track": "text-status-ok" } as const;

/** The "Open queue" list: request number, title, status pill and SLA state. */
export function QueueList({
  rows,
}: {
  rows: { id: string; title: string; status: string; sla: keyof typeof SLA_TONE }[];
}) {
  return (
    <>
      <PanelHeading className="pb-1.5 !text-[12px]">Open queue</PanelHeading>
      {rows.map((r) => (
        <div key={r.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-2.5 border-t border-border py-[9px] text-[13.5px]">
          <span className="text-ink-muted tabular-nums">{r.id}</span>
          <span className="truncate font-semibold text-ink">{r.title}</span>
          <span className="flex flex-none items-center gap-[7px]">
            <span className="rounded-full bg-surface-tint px-[9px] py-1 text-[12px] font-semibold text-ink">{r.status}</span>
            <span className={`text-[12.5px] font-semibold ${SLA_TONE[r.sla]}`}>{r.sla}</span>
          </span>
        </div>
      ))}
    </>
  );
}

/** Channel chat: a group chat card drawn in the split figure. Content-box, like the design, so its padding sits outside the width. */
export function GroupChatCard() {
  return (
    <div className="relative box-content flex w-[min(460px,92%)] flex-col gap-3.5 rounded-[20px] bg-surface p-[26px] shadow-float">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3.5">
        <span className="text-[17px] font-semibold text-ink">Group Chat 1</span>
        <span className="rounded-full bg-surface-tint px-[11px] py-[5px] text-[12.5px] font-semibold text-ink-muted">6 members · 4 online</span>
      </div>
      <div className="flex items-end gap-2.5">
        <span className="size-[26px] flex-none rounded-full bg-deep" />
        <span className="rounded-[14px_14px_14px_5px] bg-surface-tint px-3.5 py-2.5 text-[14.5px] text-ink">
          The gateway rejects anything under 50, so the retry queue never clears.
        </span>
      </div>
      <div className="flex items-end justify-end gap-2.5">
        <span className="rounded-[14px_14px_5px_14px] bg-accent-wash px-3.5 py-2.5 text-[14.5px] font-semibold text-ink">
          Push to staging first: 41 invoices to replay.
        </span>
        <span className="size-[26px] flex-none rounded-full bg-avatar-guest-3" />
      </div>
      <div className="flex items-center gap-3 rounded-[14px] bg-surface-tint px-[15px] py-[13px]">
        <span
          aria-hidden="true"
          className="flex size-7 flex-none items-center justify-center rounded-[9px] bg-ink text-[15px] font-semibold text-on-ink"
        >
          ✓
        </span>
        <span className="flex flex-col gap-0.5">
          <span className="text-[14.5px] font-semibold text-ink">Request #4821 moved to In progress</span>
          <span className="text-[13px] text-ink-muted">Ruben Pienaar · owner assigned</span>
        </span>
      </div>
      <div className="flex items-center gap-2.5 text-[13px] text-ink-muted">
        <span aria-hidden="true" className="flex">
          <span className="size-[22px] rounded-full bg-ink-muted" />
          <span className="-ml-[7px] size-[22px] rounded-full bg-deep" />
        </span>
        Nathan and Ruben are typing…
      </div>
    </div>
  );
}

/** Floating glass note over a split figure. Hidden below 1080px, as in the design. */
export function FloatingChip({ title, body }: { title: string; body: string }) {
  return (
    <div className="absolute right-[-10px] bottom-[12%] box-content flex max-w-[214px] animate-float flex-col gap-1 rounded-2xl px-4 py-3.5 shadow-card [backdrop-filter:blur(22px)_saturate(180%)] [-webkit-backdrop-filter:blur(22px)_saturate(180%)] bg-glass max-desk:hidden">
      <span className="text-[13.5px] font-semibold text-ink">{title}</span>
      <span className="text-[13px] text-ink-muted">{body}</span>
    </div>
  );
}

/** Channel members with a TEAM or GUEST label. */
export function MemberList({ members }: { members: { name: string; guest: boolean }[] }) {
  return (
    <div className="mt-auto flex flex-col gap-2 text-[13.5px]">
      {members.map((m) => (
        <span key={m.name} className="flex items-center gap-2 text-ink">
          <span aria-hidden="true" className={`size-[22px] rounded-full ${m.guest ? "bg-avatar-guest-3" : "bg-deep"}`} />
          {m.name}
          {/* Design used --accent for GUEST; that fails contrast as small text, so --accent-ink. */}
          <span className={`ml-auto text-[11.5px] font-semibold tracking-[0.08em] ${m.guest ? "text-accent-ink" : "text-ink-muted"}`}>
            {m.guest ? "GUEST" : "TEAM"}
          </span>
        </span>
      ))}
    </div>
  );
}

/** Wiki sections with their articles, as in the wiki sidebar. */
export function SectionList({ sections }: { sections: { title: string; items: string[] }[] }) {
  return (
    <>
      {sections.map((s, i) => (
        <div key={s.title} className="contents">
          <PanelHeading count={s.items.length} className={i > 0 ? "border-t border-border pt-2" : ""}>
            {s.title}
          </PanelHeading>
          {s.items.map((item) => (
            <span key={item} className="text-ink">
              {item}
            </span>
          ))}
        </div>
      ))}
    </>
  );
}

/** Roles with a short description and a Staff / Guest ok pill. */
export function RoleList({ roles }: { roles: { name: string; body: string; pill: string; guest?: boolean }[] }) {
  return (
    <>
      <PanelHeading className="pb-1.5">Roles</PanelHeading>
      {roles.map((r) => (
        <span key={r.name} className="flex items-start justify-between gap-3 border-t border-border py-3">
          <span className="flex flex-col">
            <span className="font-semibold text-ink">{r.name}</span>
            <span className="text-[13px] text-ink-muted">{r.body}</span>
          </span>
          <span
            className={`flex-none rounded-full px-2.5 py-1 text-[12px] font-semibold text-ink ${r.guest ? "bg-accent-wash" : "bg-surface-tint"}`}
          >
            {r.pill}
          </span>
        </span>
      ))}
    </>
  );
}

/** Presence states with a coloured dot. */
export function PresenceList() {
  const items = [
    { label: "Available", dot: "bg-presence-available", muted: false },
    { label: "Busy", dot: "bg-presence-busy", muted: false },
    { label: "Away", dot: "bg-presence-away", muted: true },
  ];
  return (
    <div className="flex flex-col gap-2 text-[14px]">
      {items.map((p) => (
        <span key={p.label} className={`flex items-center gap-[9px] ${p.muted ? "text-ink-muted" : "text-ink"}`}>
          <span aria-hidden="true" className={`size-[9px] rounded-full ${p.dot}`} />
          {p.label}
        </span>
      ))}
    </div>
  );
}
