"use client";

import { useState } from "react";
import { BillingToggle, ToggleButton } from "../BillingToggle";
import { kolabrSide, money, slackSide, SLACK_PRICES_CHECKED, type SideCost, type SlackInputs } from "@/lib/slack-cost";

/**
 * The Slack page's calculator. It describes the account the way people think about it (your
 * team, your clients, how many people each client brings) and asks the one question Slack's
 * billing turns on: does a client need more than one channel.
 *
 * It starts on the hero card's numbers, and on Yes, because a client with a project, a bill and a
 * question is in three channels. It is allowed to lose: answer No for a small team and Slack can
 * come out cheaper, and the verdict says so, then says what the difference buys.
 */

const FIELD =
  "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-[16px] leading-[normal] tracking-normal text-ink transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-ring)] focus:outline-none";

const WHAT_IT_INCLUDES = "requests with response targets, a wiki in every channel, playbooks and scheduled events";

function clamp(value: string, max: number) {
  const n = Number.parseInt(value.replace(/\D/g, ""), 10);
  if (!Number.isFinite(n)) return 0;
  return Math.min(Math.max(n, 0), max);
}

function NumberField({ label, value, max, onChange }: { label: string; value: number; max: number; onChange: (n: number) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[14px] font-semibold text-ink">{label}</span>
      <input
        className={FIELD}
        type="number"
        min={0}
        max={max}
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(clamp(e.target.value, max))}
      />
    </label>
  );
}

export function SlackCostCalculator() {
  const [team, setTeam] = useState(12);
  const [clients, setClients] = useState(8);
  const [guestsPerClient, setGuestsPerClient] = useState(5);
  const [multiChannel, setMultiChannel] = useState(true);
  const [yearly, setYearly] = useState(false);

  const inputs: SlackInputs = { team, clients, guestsPerClient, multiChannel, yearly };
  const ours = kolabrSide(inputs);
  const theirs = slackSide(inputs);
  const gapMonth = theirs.perMonth - ours.perMonth;
  const gapYear = theirs.perYear - ours.perYear;
  const terms = yearly ? " on annual terms" : "";

  return (
    <div className="flex flex-col gap-5 rounded-3xl bg-surface p-[30px] shadow-subtle max-tab:p-[22px]">
      <div className="flex flex-col gap-1">
        <h3 className="text-[19px] font-semibold tracking-[-0.02em] text-ink">What it costs your team</h3>
        <p className="text-[15px] leading-[1.5] text-pretty text-ink-muted">
          Kolabr Pro against Slack Pro, on list prices. Change the numbers to yours.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3.5 max-tab:grid-cols-1">
        <NumberField label="Users" value={team} max={500} onChange={setTeam} />
        <NumberField label="Clients" value={clients} max={500} onChange={setClients} />
        <NumberField label="Guests per client" value={guestsPerClient} max={100} onChange={setGuestsPerClient} />
      </div>

      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div className="flex flex-col gap-1.5">
          <span id="slack-multi-label" className="text-[14px] font-semibold text-ink">
            Each client needs more than one channel
          </span>
          <div role="group" aria-labelledby="slack-multi-label" className="flex w-fit gap-1 rounded-[14px] border border-border bg-surface-tint p-1">
            <ToggleButton active={!multiChannel} onClick={() => setMultiChannel(false)}>
              No
            </ToggleButton>
            <ToggleButton active={multiChannel} onClick={() => setMultiChannel(true)}>
              Yes
            </ToggleButton>
          </div>
        </div>
        <BillingToggle yearly={yearly} onChange={setYearly} />
      </div>

      <div className="grid grid-cols-2 gap-3.5 border-t border-border pt-5 max-tab:grid-cols-1">
        <Total name="Kolabr" plan="Pro" cost={ours} yearly={yearly} ours />
        <Total name="Slack" plan="Slack Pro" cost={theirs} yearly={yearly} />
      </div>

      <p role="status" className="text-[15.5px] leading-[1.5] text-pretty text-ink">
        {gapMonth > 0 ? (
          <>
            Kolabr is <strong className="font-semibold">{money(gapMonth)} a month less</strong>
            {terms}, or {money(gapYear)} a year, and it includes {WHAT_IT_INCLUDES}.
          </>
        ) : gapMonth < 0 ? (
          <>
            Slack is <strong className="font-semibold">{money(-gapMonth)} a month less</strong>
            {terms}. Kolabr&rsquo;s figure also covers {WHAT_IT_INCLUDES}, and your guests stay free if a client ever needs a second channel.
          </>
        ) : (
          <>
            The two come to the same bill{terms}. Kolabr&rsquo;s figure also covers {WHAT_IT_INCLUDES}.
          </>
        )}
      </p>

      <p className="text-[13.5px] leading-[1.45] text-pretty text-ink-muted">
        List prices, excluding introductory offers. Slack prices checked {SLACK_PRICES_CHECKED}; they change, so check
        Slack&rsquo;s pricing page before you budget.
      </p>
    </div>
  );
}

function Total({ name, plan, cost, yearly, ours }: { name: string; plan: string; cost: SideCost; yearly: boolean; ours?: boolean }) {
  return (
    <div className={`flex flex-col gap-1.5 rounded-2xl p-[18px] ${ours ? "bg-accent-wash" : "bg-surface-tint"}`}>
      <span className={`text-[12px] font-semibold tracking-[0.11em] uppercase ${ours ? "text-accent-ink-strong" : "text-ink-muted"}`}>
        {name}
      </span>
      <span className="text-[30px] leading-none font-semibold tracking-[-0.03em] text-ink tabular-nums">
        {money(cost.perMonth)}
        <span className="text-[15px] font-normal text-ink-muted"> / month</span>
      </span>
      <span className="text-[13.5px] text-ink-muted">
        {yearly ? `${plan}, billed yearly: ${money(cost.perYear)} a year` : `${plan}, billed monthly`}
      </span>
      <span className="text-[13.5px] leading-[1.45] text-pretty text-ink-muted">{cost.basis}</span>
    </div>
  );
}
