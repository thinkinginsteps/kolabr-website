"use client";

import { useId, useState } from "react";
import { MODELS, kolabrCost, kolabrYearly } from "@/lib/cost-model";

/**
 * Two monthly totals for a team you describe. It replaces a pair of per-seat list prices, which
 * compared the wrong thing: the question is never what a user costs, it is what the bill is once
 * the clients are in the room.
 *
 * It is allowed to lose. On Basecamp it usually says Basecamp is cheaper, and on Notion and
 * ClickUp it says guests are free on both sides. A calculator that only ever flatters
 * us would be worth nothing to the person reading it, and they can check every figure.
 */

const FIELD =
  "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[16px] leading-[normal] tracking-normal text-ink transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-ring)] focus:outline-none";

function clamp(value: string, max: number) {
  const n = Number.parseInt(value.replace(/\D/g, ""), 10);
  if (!Number.isFinite(n)) return 0;
  return Math.min(Math.max(n, 0), max);
}

export function CostCalculator({ slug }: { slug: string }) {
  const model = MODELS[slug];
  const id = useId();
  const [team, setTeam] = useState(12);
  const [outside, setOutside] = useState(40);
  const [multi, setMulti] = useState(40);

  if (!model) return null;

  const ours = kolabrCost(team);
  const theirs = model.price(team, outside, Math.min(multi, outside));
  const saving = theirs.total - ours.total;

  return (
    <div className="flex flex-col gap-5 rounded-3xl bg-surface p-[30px] shadow-subtle">
      <div className="flex flex-col gap-1">
        <h3 className="text-[19px] font-semibold tracking-[-0.02em] text-ink">What it costs your team</h3>
        <p className="text-[15px] leading-[1.5] text-pretty text-ink-muted">
          Monthly, on list prices. Change the numbers to yours.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3.5 max-tab:grid-cols-1">
        <label className="flex flex-col gap-1.5">
          <span className="text-[14px] font-semibold text-ink">Users</span>
          <input
            id={`${id}-team`}
            className={FIELD}
            type="number"
            min={1}
            max={500}
            inputMode="numeric"
            value={team}
            onChange={(e) => setTeam(clamp(e.target.value, 500))}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[14px] font-semibold text-ink">Guests</span>
          <input
            id={`${id}-outside`}
            className={FIELD}
            type="number"
            min={0}
            max={2000}
            inputMode="numeric"
            value={outside}
            onChange={(e) => {
              const n = clamp(e.target.value, 2000);
              setOutside(n);
              if (multi > n) setMulti(n);
            }}
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-[14px] font-semibold text-ink">
          Of those, how many need to take part rather than just read?
        </span>
        <input
          id={`${id}-multi`}
          type="range"
          min={0}
          max={outside}
          value={Math.min(multi, outside)}
          onChange={(e) => setMulti(Number(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-accent"
        />
        <span className="text-[14px] text-ink-muted">
          {Math.min(multi, outside)} of {outside}. It never changes what you pay us
          {model.sliderNote ? "." : `, and on ${model.name} it is the number that costs you money.`}
        </span>
      </label>

      <div className="grid grid-cols-2 gap-3.5 border-t border-border pt-5 max-tab:grid-cols-1">
        <Total
          name="Kolabr"
          amount={ours.total}
          basis={ours.basis}
          plan="Pro, monthly"
          annual={`or $${kolabrYearly(team).toLocaleString()} a month on annual terms`}
          ours
        />
        <Total name={model.name} amount={theirs.total} basis={theirs.basis} plan={model.plan} note={model.sliderNote} />
      </div>

      <p role="status" className="text-[15.5px] leading-[1.5] text-pretty text-ink">
        {saving > 0 ? (
          <>
            Kolabr is <strong className="font-semibold">${saving.toLocaleString()} a month less</strong>, or $
            {(saving * 12).toLocaleString()} a year.
          </>
        ) : saving < 0 ? (
          <>
            {model.name} is <strong className="font-semibold">${Math.abs(saving).toLocaleString()} a month less</strong>
            {model.guestsAreFreeToo ? ", and guests are free on both. The difference is what they can do once they are in." : "."}
          </>
        ) : (
          <>The two come to the same monthly bill, so the decision is what you get for it, not the price.</>
        )}
      </p>
    </div>
  );
}

function Total({
  name,
  amount,
  basis,
  plan,
  annual,
  note,
  ours,
}: {
  name: string;
  amount: number;
  basis: string;
  plan: string;
  /** Our side only: the same team on annual terms, under the monthly figure. */
  annual?: string;
  /** Their side only: why the participation slider leaves this total alone. */
  note?: string;
  ours?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-1.5 rounded-2xl p-[18px] ${ours ? "bg-accent-wash" : "bg-surface-tint"}`}>
      <span className={`text-[12px] font-semibold tracking-[0.11em] uppercase ${ours ? "text-accent-ink-strong" : "text-ink-muted"}`}>
        {name}
      </span>
      <span className="text-[30px] leading-none font-semibold tracking-[-0.03em] text-ink">
        ${amount.toLocaleString()}
        <span className="text-[15px] font-normal text-ink-muted"> / month</span>
      </span>
      <span className="text-[13.5px] text-ink-muted">
        {plan}
        {annual && <>, {annual}</>}
      </span>
      <span className="text-[13.5px] leading-[1.45] text-pretty text-ink-muted">{basis}</span>
      {note && <span className="text-[13.5px] leading-[1.45] text-pretty text-ink-muted">{note}</span>}
    </div>
  );
}
