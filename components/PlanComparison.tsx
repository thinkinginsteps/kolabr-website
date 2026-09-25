import { featureGroups, type Cell } from "@/lib/plan-features";

// Same four-column grid on every row, as in the design. Laid out with divs (so the header can
// stick while scrolling) and given ARIA table roles so it reads as a table.
const ROW = "grid grid-cols-[minmax(0,1.7fr)_repeat(3,minmax(0,1fr))]";
const CELL = "flex min-w-0 items-center gap-2 px-[18px] py-3.5 text-[15px] leading-[1.35] text-ink";
const PLANS = ["Starter", "Pro", "Max"] as const;

/** The full feature comparison table on /pricing. Pro (the middle column) is tinted. */
export function PlanComparison() {
  const lastGroup = featureGroups.length - 1;
  return (
    <div role="table" aria-label="Feature comparison by plan" className="rounded-[22px] border border-border bg-surface shadow-panel">
      <div role="rowgroup" className="sticky top-16 z-2 rounded-t-[21px] border-b border-border bg-surface">
        <div role="row" className={ROW}>
          <span role="columnheader" className="rounded-tl-[21px] p-[18px] text-[11.5px] font-semibold tracking-[0.1em] text-ink-muted uppercase">
            Feature
          </span>
          {PLANS.map((plan, i) => (
            <span
              key={plan}
              role="columnheader"
              className={`flex items-baseline gap-2 p-[18px] text-[16.5px] font-semibold text-ink ${i === 1 ? "bg-highlight-col-head" : ""} ${
                i === 2 ? "rounded-tr-[21px]" : ""
              }`}
            >
              {plan}
              {i === 1 && <span className="text-[10.5px] font-semibold tracking-[0.09em] text-accent-ink uppercase">Popular</span>}
            </span>
          ))}
        </div>
      </div>

      {featureGroups.map((group, g) => (
        <div role="rowgroup" key={group.title}>
          <div role="row" className={`${ROW} border-y border-border bg-surface-tint`}>
            <span
              role="cell"
              aria-colspan={4}
              className="col-span-full px-[18px] py-[13px] text-[11.5px] font-semibold tracking-[0.11em] text-accent-ink uppercase"
            >
              {group.title}
            </span>
          </div>
          {group.rows.map((row, r) => {
            const last = g === lastGroup && r === group.rows.length - 1;
            return (
              <div
                role="row"
                key={row.name}
                className={`${ROW} hover-tint [--tint:var(--row-hover)] ${last ? "rounded-b-[21px]" : "border-b border-rule-soft"}`}
              >
                <span role="rowheader" className={`min-w-0 px-[18px] py-3.5 text-[15px] leading-[1.35] font-semibold text-ink ${last ? "rounded-bl-[21px]" : ""}`}>
                  {row.name}
                  {row.note && (
                    <a href="#guest-note" aria-describedby="guest-note" className="pl-px font-extrabold text-accent-ink">
                      *
                    </a>
                  )}
                </span>
                {row.values.map((cell, i) => (
                  <span
                    role="cell"
                    key={i}
                    className={`${CELL} ${i === 1 ? "bg-highlight-col" : ""} ${last && i === 2 ? "rounded-br-[21px]" : ""}`}
                  >
                    <CellValue cell={cell} />
                  </span>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function CellValue({ cell }: { cell: Cell }) {
  return (
    <>
      {cell.icon === "yes" && (
        <span role="img" aria-label="Included" className="flex">
          <Tick />
        </span>
      )}
      {/* A tick in front of a qualifier ("conditional and multi-level"): the text carries the meaning. */}
      {cell.icon === "tick" && <Tick />}
      {cell.icon === "no" && (
        <span role="img" aria-label="Not included" className="flex">
          <svg viewBox="0 0 20 20" aria-hidden="true" className="size-[15px] flex-none text-ink-faint">
            <path d="M5 5l10 10M15 5L5 15" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" />
          </svg>
        </span>
      )}
      {cell.text && <span className="min-w-0">{cell.text}</span>}
    </>
  );
}

function Tick() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className="size-[18px] flex-none text-accent-ink">
      <path d="M4 10.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
