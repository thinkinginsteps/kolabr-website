import type { ReactNode } from "react";
import { PanelHeading } from "../product/Illustrations";

// Small product drawings shared by the compare pages, built on the product pages' sketch pieces
// (components/product/Illustrations.tsx). Text only, so they stay sharp and need no image.

/** Centres a sketch under its heading; the sketch pieces pin themselves to the bottom otherwise. */
export function Body({ children }: { children: ReactNode }) {
  return <div className="flex flex-1 flex-col justify-center [&>*]:!mt-0">{children}</div>;
}

/** Wiki articles as tinted rows, the one suggested to the client picked out in accent. */
export function WikiSketch({ heading, articles }: { heading: string; articles: { title: string; meta: string; suggested?: boolean }[] }) {
  return (
    <>
      <PanelHeading count={articles.length} className="pb-2.5">
        {heading}
      </PanelHeading>
      <div className="flex flex-col gap-2">
        {articles.map((a) => (
          <span
            key={a.title}
            className={`flex items-center gap-2.5 rounded-xl px-[11px] py-[9px] text-ink ${a.suggested ? "bg-accent-wash" : "bg-surface-tint"}`}
          >
            <span className="relative flex h-[22px] w-[18px] flex-none flex-col justify-center gap-[3px] rounded-[4px] bg-surface px-[4px] shadow-pill">
              <span className="h-[2px] rounded-full bg-border" />
              <span className="h-[2px] rounded-full bg-border" />
              <span className="h-[2px] w-2/3 rounded-full bg-border" />
            </span>
            <span className="truncate font-semibold">{a.title}</span>
            <span
              className={`ml-auto flex-none text-[12px] font-semibold ${
                a.suggested ? "rounded-full bg-surface px-[9px] py-[3px] text-accent-ink-strong" : "text-ink-muted tabular-nums"
              }`}
            >
              {a.meta}
            </span>
          </span>
        ))}
      </div>
    </>
  );
}

/** A deployed playbook: progress across the top, then each step with its owner and date. */
export function PlaybookSketch({ heading, steps }: { heading: string; steps: { text: string; owner: string; due: string; done: boolean }[] }) {
  const done = steps.filter((s) => s.done).length;
  return (
    <>
      <PanelHeading className="pb-2">
        {heading}
        <span className="tracking-normal normal-case">
          {done} of {steps.length} done
        </span>
      </PanelHeading>
      <span className="mb-1.5 block h-1.5 overflow-hidden rounded-full bg-surface-tint">
        <span className="block h-full rounded-full bg-accent" style={{ width: `${(done / steps.length) * 100}%` }} />
      </span>
      {steps.map((s) => (
        <span key={s.text} className="flex items-center gap-2.5 border-t border-border py-[9px] first-of-type:border-t-0">
          <span
            className={`flex size-[18px] flex-none items-center justify-center rounded-full text-[11px] font-semibold ${
              s.done ? "bg-accent text-on-ink" : "border-[1.5px] border-border"
            }`}
          >
            {s.done ? "✓" : ""}
          </span>
          <span className={`truncate font-semibold ${s.done ? "text-ink-muted" : "text-ink"}`}>{s.text}</span>
          <span className="ml-auto flex flex-none items-center gap-2">
            <span className="rounded-full bg-surface-tint px-[9px] py-[3px] text-[12px] font-semibold text-ink">{s.owner}</span>
            <span className={`w-[52px] text-right text-[12.5px] font-semibold ${s.done ? "text-ink-muted" : "text-ink"}`}>{s.due}</span>
          </span>
        </span>
      ))}
    </>
  );
}

