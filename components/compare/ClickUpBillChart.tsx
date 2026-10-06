"use client";

import { useState, type KeyboardEvent, type PointerEvent } from "react";
import { ToggleButton } from "../BillingToggle";
import { billSeries, CHART_TEAMS, chartRange, DEFAULT_CHART_TEAM } from "@/lib/clickup-cost";

/**
 * The monthly bill for a team the reader chooses, as more guests take part: ClickUp
 * Unlimited and Business step up as their guest allowances run out, Kolabr stays flat. There is
 * no picked scenario and no marked point; the reader sets the team size and reads any point.
 *
 * Lines are drawn in an SVG that stretches to the box; every label is HTML placed by percentage,
 * so text stays legible at phone width instead of shrinking with the drawing. Kolabr is the
 * highlighted series (accent), ClickUp's two plans the reference (ink, and muted ink dashed so the
 * pair never relies on colour alone). A legend names all three, hover, touch or the arrow keys
 * read any point, and a table repeats the figures for screen readers.
 */

const W = 600;
const H = 300;

const SERIES = [
  { key: "unlimited", name: "ClickUp Unlimited", line: "stroke-ink", swatch: "bg-ink", dash: undefined, width: 2 },
  { key: "business", name: "ClickUp Business", line: "stroke-ink-muted", swatch: "bg-ink-muted", dash: "7 5", width: 2 },
  { key: "kolabr", name: "Kolabr Pro", line: "stroke-accent", swatch: "bg-accent", dash: undefined, width: 3 },
] as const;

type Key = (typeof SERIES)[number]["key"];

const money = (v: number) => `$${v % 1 ? v.toFixed(2) : v.toLocaleString("en-US")}`;

/** A round axis top a little above the highest value, split into four even steps. */
function axis(max: number) {
  const raw = (max * 1.08) / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw)!;
  return { top: step * 4, ticks: [0, 1, 2, 3, 4].map((i) => i * step) };
}

export function ClickUpBillChart({ title, teamLabel, hint }: { title: string; teamLabel: string; hint: string }) {
  const [team, setTeam] = useState<number>(DEFAULT_CHART_TEAM);
  const [hover, setHover] = useState<number | null>(null);

  const max = chartRange(team);
  const data = billSeries(team, max);
  const { top, ticks } = axis(Math.max(...data.map((d) => Math.max(d.unlimited, d.business, d.kolabr))));
  const xTicks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i);

  const x = (g: number) => (g / max) * W;
  const y = (v: number) => H - (v / top) * H;
  const pctX = (g: number) => `${(g / max) * 100}%`;
  const pctY = (v: number) => `${100 - (v / top) * 100}%`;

  // A step after each point: the bill holds until the next guest needs a seat.
  const path = (key: Key) => data.map((d, i) => `${i ? `H${x(d.guests)}V` : "M0 "}${y(d[key])}`).join("") + `H${W}`;

  const point = hover === null ? null : data[hover];
  const at = (clientX: number, el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    return Math.max(0, Math.min(max, Math.round(((clientX - r.left) / r.width) * max)));
  };
  const onPointer = (e: PointerEvent<HTMLDivElement>) => setHover(at(e.clientX, e.currentTarget));
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const by = e.shiftKey ? Math.max(1, Math.round(max / 20)) : 1;
    setHover((h) => Math.max(0, Math.min(max, (h ?? 0) + step * by)));
  };
  const chooseTeam = (n: number) => {
    setTeam(n);
    setHover(null);
  };

  return (
    <figure className="m-0 flex flex-col gap-5 rounded-3xl bg-surface p-[30px] shadow-subtle max-tab:p-5">
      <figcaption className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <span className="max-w-[560px] text-[18px] font-semibold tracking-[-0.02em] text-pretty text-ink">{title}</span>
          <div className="flex flex-col gap-1.5">
            <span id="clickup-team-label" className="text-[13px] font-semibold text-ink">
              {teamLabel}
            </span>
            <div
              role="group"
              aria-labelledby="clickup-team-label"
              className="flex w-fit gap-1 rounded-[14px] border border-border bg-surface-tint p-1"
            >
              {CHART_TEAMS.map((n) => (
                <ToggleButton key={n} active={team === n} onClick={() => chooseTeam(n)}>
                  {n}
                </ToggleButton>
              ))}
            </div>
          </div>
        </div>
        <span aria-hidden="true" className="flex flex-wrap gap-x-5 gap-y-1.5 text-[14px] text-ink-muted">
          {SERIES.map((s) => (
            <span key={s.key} className="flex items-center gap-2">
              <span className={`h-[3px] w-5 rounded-full ${s.swatch} ${s.dash ? "opacity-70" : ""}`} />
              {s.name}
            </span>
          ))}
        </span>
      </figcaption>

      <div aria-hidden="true" className="relative h-[320px] pt-2 pr-3 pb-9 pl-14 max-tab:h-[270px] max-tab:pl-12">
        <div className="relative h-full w-full">
          {ticks.map((t) => (
            <span
              key={t}
              className="absolute right-full -translate-y-1/2 pr-2.5 text-[12px] text-ink-muted tabular-nums"
              style={{ top: pctY(t) }}
            >
              {money(t)}
            </span>
          ))}
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
            {ticks.map((t) => (
              <line key={t} x1={0} x2={W} y1={y(t)} y2={y(t)} className="stroke-border" strokeWidth={1} vectorEffect="non-scaling-stroke" />
            ))}
            {point && (
              <line
                x1={x(point.guests)}
                x2={x(point.guests)}
                y1={0}
                y2={H}
                className="stroke-ink-muted"
                strokeWidth={1}
                strokeDasharray="4 4"
                vectorEffect="non-scaling-stroke"
              />
            )}
            {SERIES.map((s) => (
              <path
                key={s.key}
                d={path(s.key)}
                fill="none"
                className={s.line}
                strokeWidth={s.width}
                strokeDasharray={s.dash}
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
          {point && (
            <>
              {SERIES.map((s) => (
                <span
                  key={s.key}
                  className={`absolute size-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-surface ${s.swatch}`}
                  style={{ left: pctX(point.guests), top: pctY(point[s.key]) }}
                />
              ))}
              <span
                className="absolute -top-1 -translate-x-1/2 -translate-y-full rounded-full bg-surface-tint px-2.5 py-1 text-[12px] font-semibold whitespace-nowrap text-ink"
                style={{ left: pctX(point.guests) }}
              >
                {point.guests} guests
              </span>
              <span
                className={`absolute top-[6%] flex flex-col gap-1.5 rounded-xl bg-surface/95 px-3 py-2.5 text-[13px] shadow-soft max-tab:hidden ${
                  point.guests >= max / 2 ? "-translate-x-[calc(100%+14px)]" : "translate-x-[14px]"
                }`}
                style={{ left: pctX(point.guests) }}
              >
                {SERIES.map((s) => (
                  <span key={s.key} className="flex items-center gap-2 whitespace-nowrap">
                    <span className={`size-2 rounded-full ${s.swatch}`} />
                    <span className="text-ink-muted">{s.name}</span>
                    <span className="ml-auto pl-3 font-semibold text-ink tabular-nums">{money(point[s.key])}*</span>
                  </span>
                ))}
              </span>
            </>
          )}
          {xTicks.map((t) => (
            <span
              key={t}
              className="absolute top-full -translate-x-1/2 pt-2 text-[12px] text-ink-muted tabular-nums"
              style={{ left: pctX(t) }}
            >
              {t}
            </span>
          ))}
          <div
            tabIndex={0}
            onPointerMove={onPointer}
            onPointerDown={onPointer}
            onPointerLeave={(e) => e.pointerType === "mouse" && setHover(null)}
            onKeyDown={onKey}
            onBlur={() => setHover(null)}
            className="absolute inset-0 cursor-crosshair touch-pan-y rounded-md outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>
      </div>
      <p aria-hidden="true" className="-mt-2 text-center text-[13px] text-ink-muted">
        Guests who can comment or approve
      </p>

      {/* The values for the point being read; on a phone there is no room beside the line, so they sit here. */}
      <div
        aria-hidden="true"
        className={`flex-col gap-2 rounded-xl bg-surface-tint px-4 py-3 text-[14px] ${point ? "hidden max-tab:flex" : "flex"}`}
      >
        {point ? (
          <>
            <span className="text-[13px] font-semibold text-ink">{point.guests} guests</span>
            {SERIES.map((s) => (
              <span key={s.key} className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${s.swatch}`} />
                <span className="text-ink-muted">{s.name}</span>
                <span className="ml-auto font-semibold text-ink tabular-nums">{money(point[s.key])}*</span>
              </span>
            ))}
          </>
        ) : (
          <span className="text-[14px] text-ink-muted">{hint}</span>
        )}
      </div>

      <div className="sr-only">
        <table>
          <caption>
            {title}, for {team} users, per month on yearly fees
          </caption>
          <thead>
            <tr>
              <th scope="col">Guests</th>
              {SERIES.map((s) => (
                <th key={s.key} scope="col">
                  {s.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 11 }, (_, i) => Math.round((max / 10) * i)).map((g) => (
              <tr key={g}>
                <th scope="row">{g}</th>
                {SERIES.map((s) => (
                  <td key={s.key}>{money(data[g][s.key])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
