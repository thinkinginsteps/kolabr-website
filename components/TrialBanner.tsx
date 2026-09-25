import type { ReactNode } from "react";
import { SIGNUP_PATH } from "@/lib/site";
import { ButtonLink } from "./ButtonLink";

/** "Start your 14-day free trial" strip under the plan cards (#buy). */
export function TrialBanner({ children }: { children?: ReactNode }) {
  return (
    <div data-rise="" id="buy" className="mt-10 flex flex-wrap items-center justify-between gap-5 rounded-[22px] bg-surface px-8 py-7">
      <div className="flex max-w-[620px] flex-col gap-1.5">
        <span className="text-[19px] font-semibold text-ink">Start your 14-day free trial</span>
        <span className="text-[16px] text-pretty text-ink-muted">
          Create an account and get 14 days free on Max, with every option included. No card needed. Pick the plan that
          fits when the trial ends.
          {children}
        </span>
      </div>
      <TrialButton className="flex-none" />
    </div>
  );
}

/** The mid-size "Start free trial" button used under the plans and the feature table. */
export function TrialButton({ className = "" }: { className?: string }) {
  return (
    <ButtonLink href={SIGNUP_PATH} className={`!rounded-[14px] !px-[26px] !py-[15px] !text-[16.5px] ${className}`}>
      Start free trial
    </ButtonLink>
  );
}
