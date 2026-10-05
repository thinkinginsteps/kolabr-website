import type { ReactNode } from "react";
import { YEARLY_DISCOUNT } from "@/lib/pricing";

/**
 * The Monthly / Yearly switch. Shared by the pricing plans and the Slack calculator so the two
 * look and behave as one control.
 */
export function BillingToggle({ yearly, onChange }: { yearly: boolean; onChange: (yearly: boolean) => void }) {
  return (
    <div role="group" aria-label="Billing period" className="flex gap-1 rounded-[14px] border border-border bg-surface-tint p-1">
      <ToggleButton active={!yearly} onClick={() => onChange(false)}>
        Monthly
      </ToggleButton>
      <ToggleButton active={yearly} onClick={() => onChange(true)}>
        Yearly
        <span className="rounded-[7px] bg-accent-wash px-[7px] py-[3px] text-[12px] font-extrabold text-accent-ink-strong">{YEARLY_DISCOUNT}</span>
      </ToggleButton>
    </div>
  );
}

export function ToggleButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
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
