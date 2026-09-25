"use client";

import { useState } from "react";
import { PER, plans, type Plan } from "@/lib/pricing";
import { SIGNUP_PATH } from "@/lib/site";

/**
 * Monthly / Yearly switch plus the three plan cards. Both prices are rendered into the HTML
 * and the inactive one is hidden, so every price is in the DOM at build time.
 * `headingLevel` keeps the heading outline valid: h3 under a section h2 (Home), h2 directly
 * under the page h1 (Pricing).
 */
export function PricingPlans({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const [yearly, setYearly] = useState(false);

  return (
    <>
      <div data-rise="" className="mb-[26px] flex items-center gap-5">
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
        <div role="group" aria-label="Billing period" className="flex gap-1 rounded-[14px] border border-border bg-surface-tint p-1">
          <ToggleButton active={!yearly} onClick={() => setYearly(false)}>
            Monthly
          </ToggleButton>
          <ToggleButton active={yearly} onClick={() => setYearly(true)}>
            Yearly
            <span className="rounded-[7px] bg-accent-wash px-[7px] py-[3px] text-[12px] font-extrabold text-accent-ink-strong">1 month free</span>
          </ToggleButton>
        </div>
      </div>

      <div data-rise-group="" className="grid grid-cols-1 items-stretch gap-[18px] desk:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.name} plan={plan} yearly={yearly} headingLevel={headingLevel} />
        ))}
      </div>
    </>
  );
}

function ToggleButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex cursor-pointer items-center gap-2 rounded-[11px] px-4 py-[9px] text-[14.5px] leading-[normal] font-semibold ${
        active ? "bg-surface text-ink shadow-knob" : "text-ink-muted"
      }`}
    >
      {children}
    </button>
  );
}

function PlanCard({ plan, yearly, headingLevel }: { plan: Plan; yearly: boolean; headingLevel: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <div
      data-rise=""
      className={`relative flex flex-col gap-4 rounded-3xl px-[30px] pt-[34px] pb-[30px] ${
        plan.highlighted
          ? // Highlighted plan: glass (approved) with the design's accent outline and glow.
            "glass shadow-glow outline-2 -outline-offset-2 outline-accent"
          : "bg-surface shadow-soft"
      }`}
    >
      <div className="flex flex-wrap items-center gap-2.5">
        <Heading className="text-[23px] font-semibold tracking-[-0.02em] text-ink">{plan.name}</Heading>
        {plan.badge && (
          <span
            className={`rounded-lg px-[9px] py-[5px] text-[11px] font-extrabold tracking-[0.09em] uppercase ${
              plan.badge.tone === "accent" ? "bg-accent-wash text-accent-ink-strong" : "bg-surface-tint text-ink-muted"
            }`}
          >
            {plan.badge.label}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-baseline gap-[9px]">
        <span className="text-[44px] leading-none font-extrabold tracking-[-0.04em] text-ink">
          <span hidden={yearly}>{plan.monthly}</span>
          <span hidden={!yearly}>{plan.yearly}</span>
        </span>
        <span className="text-[15px] text-ink-muted">
          <span hidden={yearly}>{PER.monthly}</span>
          <span hidden={!yearly}>{PER.yearly}</span>
        </span>
      </div>

      <p className="text-[15.5px] leading-[1.45] text-ink-muted">{plan.blurb}</p>
      <span className="text-[13.5px] font-semibold text-ink">Starts with 14 days free on Max</span>

      {plan.includesLabel ? (
        <p className="mt-1 border-t border-border pt-1 text-[14.5px] font-semibold text-ink">{plan.includesLabel}</p>
      ) : (
        <span aria-hidden="true" className="mt-1 border-t border-border" />
      )}

      <ul className="flex flex-col gap-[11px]">
        {plan.features.map((f) => (
          <li key={f} className="grid grid-cols-[22px_1fr] items-start gap-[11px]">
            <span
              aria-hidden="true"
              className="mt-0.5 flex size-[19px] items-center justify-center rounded-full bg-accent text-[11px] font-extrabold text-on-ink"
            >
              ✓
            </span>
            <span className="text-[15.5px] leading-[1.45] text-ink">{f}</span>
          </li>
        ))}
      </ul>

      <a href={SIGNUP_PATH} className="group mt-auto block pt-[26px]">
        <span
          className={`flex items-center justify-center rounded-[14px] px-5 py-3.5 text-[15.5px] font-semibold transition-transform duration-300 ease-out-soft group-hover:-translate-y-0.5 ${
            plan.highlighted ? "bg-ink text-on-ink" : "border border-border bg-surface text-ink"
          }`}
        >
          Start free trial
        </span>
      </a>
    </div>
  );
}
