"use client";

import { useId, useState } from "react";

/**
 * What Kolabr costs a team of a given size. The point it makes is the absence of a second input:
 * there is nowhere to type how many clients you have, because that number never enters the sum.
 */

const RATES = { Pro: { monthly: 10, yearly: 8.5 }, Business: { monthly: 25, yearly: 21.25 } } as const;

const money = (n: number) =>
  n % 1 === 0 ? `$${n.toLocaleString()}` : `$${n.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

export function TeamCostEstimate() {
  const id = useId();
  const [team, setTeam] = useState(12);
  const [yearly, setYearly] = useState(false);
  const period = yearly ? "yearly" : "monthly";

  return (
    <div className="flex flex-col gap-5 rounded-3xl bg-surface p-[30px] shadow-subtle">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <label htmlFor={`${id}-team`} className="flex flex-col gap-1.5">
          <span className="text-[14px] font-semibold text-ink">People on your team</span>
          <input
            id={`${id}-team`}
            type="number"
            min={1}
            max={500}
            inputMode="numeric"
            value={team}
            onChange={(e) => {
              const n = Number.parseInt(e.target.value.replace(/\D/g, ""), 10);
              setTeam(Number.isFinite(n) ? Math.min(Math.max(n, 1), 500) : 1);
            }}
            className="w-[140px] rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[16px] leading-[normal] tracking-normal text-ink focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-ring)] focus:outline-none"
          />
        </label>
        <div role="group" aria-label="Billing period" className="flex gap-1 rounded-[14px] border border-border bg-surface-tint p-1">
          {(["monthly", "yearly"] as const).map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={period === p}
              onClick={() => setYearly(p === "yearly")}
              className={`cursor-pointer rounded-[11px] px-4 py-[9px] text-[14.5px] leading-[normal] font-semibold capitalize ${
                period === p ? "bg-surface text-ink shadow-knob" : "text-ink-muted"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3.5 border-t border-border pt-5 max-tab:grid-cols-1">
        {/* Free is shown at every team size, and says plainly when it stops being an option:
            one user is the whole limit, and a reader with a team of eight should see that. */}
        <div className={`flex flex-col gap-1 rounded-2xl p-[18px] bg-surface-tint ${team > 1 ? "opacity-60" : ""}`}>
          <span className="text-[12px] font-semibold tracking-[0.11em] text-ink-muted uppercase">Free</span>
          <span className="text-[30px] leading-none font-semibold tracking-[-0.03em] text-ink">
            $0<span className="text-[15px] font-normal text-ink-muted"> / month</span>
          </span>
          <span className="text-[13.5px] leading-[1.4] text-ink-muted">
            {team > 1 ? `One user only, so not enough for ${team}` : "One user, one channel, 30 free guests"}
          </span>
        </div>
        {(["Pro", "Business"] as const).map((plan) => {
          const rate = RATES[plan][period];
          return (
            <div key={plan} className={`flex flex-col gap-1 rounded-2xl p-[18px] ${plan === "Pro" ? "bg-accent-wash" : "bg-surface-tint"}`}>
              <span
                className={`text-[12px] font-semibold tracking-[0.11em] uppercase ${plan === "Pro" ? "text-accent-ink-strong" : "text-ink-muted"}`}
              >
                {plan}
              </span>
              <span className="text-[30px] leading-none font-semibold tracking-[-0.03em] text-ink">
                {money(Math.round(team * rate * 100) / 100)}
                <span className="text-[15px] font-normal text-ink-muted"> / month</span>
              </span>
              <span className="text-[13.5px] leading-[1.4] text-ink-muted">
                {team} × {money(rate)}
                {yearly ? ", billed yearly" : ""}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-[15.5px] leading-[1.5] text-pretty text-ink">
        There is nowhere here to enter how many clients you have, because it does not change the answer. Guests are free
        and unlimited, and so are channels.
      </p>
    </div>
  );
}
