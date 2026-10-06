"use client";

import { useState } from "react";
import { ToggleButton } from "../BillingToggle";
import { BAND_TEAMS, DEFAULT_BAND_TEAM, kolabrMonthly, ZENDESK_PLANS, zendeskMonthly } from "@/lib/zendesk-cost";

/**
 * Three amounts for one team size: Kolabr Pro, Zendesk Suite Team and Zendesk Suite Professional,
 * per month on yearly fees. Comparing a few magnitudes is what bars are for; the reader picks the
 * team size. Kolabr is the highlighted bar (accent), Zendesk's plans the reference (ink shades),
 * every bar carries its value and its response-target status in words, and a table repeats it all.
 */

const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;

export function ZendeskCostBars({
  title,
  teamLabel,
  noTargets,
  withTargets,
}: {
  title: string;
  teamLabel: string;
  noTargets: string;
  withTargets: string;
}) {
  const [users, setUsers] = useState<number>(DEFAULT_BAND_TEAM);
  const rows = [
    { name: "Kolabr Pro", value: kolabrMonthly(users), targets: true, bar: "bg-accent", ours: true },
    ...ZENDESK_PLANS.map((p, i) => ({
      name: p.name,
      value: zendeskMonthly(p, users),
      targets: p.responseTargets,
      bar: i === 0 ? "bg-ink-muted" : "bg-ink",
      ours: false,
    })),
  ];
  const max = Math.max(...rows.map((r) => r.value));

  return (
    <figure className="m-0 flex flex-col gap-6 rounded-3xl bg-surface p-[30px] shadow-subtle max-tab:p-5">
      <figcaption className="flex flex-wrap items-end justify-between gap-4">
        <span className="text-[18px] font-semibold tracking-[-0.02em] text-ink">{title}</span>
        <span className="flex flex-col gap-1.5">
          <span id="zendesk-team-label" className="text-[13px] font-semibold text-ink">
            {teamLabel}
          </span>
          <span
            role="group"
            aria-labelledby="zendesk-team-label"
            className="flex w-fit gap-1 rounded-[14px] border border-border bg-surface-tint p-1"
          >
            {BAND_TEAMS.map((n) => (
              <ToggleButton key={n} active={users === n} onClick={() => setUsers(n)}>
                {n}
              </ToggleButton>
            ))}
          </span>
        </span>
      </figcaption>

      <div aria-hidden="true" className="flex flex-col gap-5">
        {rows.map((r) => (
          <div key={r.name} className="grid grid-cols-[220px_minmax(0,1fr)] items-center gap-5 max-tab:grid-cols-1 max-tab:gap-2">
            <span className="flex flex-col gap-0.5">
              <span className={`text-[15.5px] font-semibold ${r.ours ? "text-ink" : "text-ink-muted"}`}>{r.name}</span>
              <span className="flex items-center gap-1.5 text-[13px] text-ink-muted">
                <span className={`size-2 rounded-full ${r.targets ? "bg-status-ok" : "bg-border"}`} />
                {r.targets ? withTargets : noTargets}
              </span>
            </span>
            <span className="flex items-center gap-3">
              <span className="h-9 min-w-0 flex-1">
                <span className={`block h-full rounded-r-[4px] ${r.bar}`} style={{ width: `${Math.max((r.value / max) * 100, 1.5)}%` }} />
              </span>
              <span className="w-[92px] flex-none text-right text-[17px] font-semibold text-ink tabular-nums">{money(r.value)}*</span>
            </span>
          </div>
        ))}
      </div>

      <div className="sr-only">
        <table>
          <caption>
            {title}, for {users} users, per month on yearly fees
          </caption>
          <thead>
            <tr>
              <th scope="col">Plan</th>
              <th scope="col">Per month</th>
              <th scope="col">Response targets</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name}>
                <th scope="row">{r.name}</th>
                <td>{money(r.value)}</td>
                <td>{r.targets ? withTargets : noTargets}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
