import { SIGNUP_PATH } from "@/lib/site";
import { SmartLink } from "./SmartLink";

/**
 * The free trial card from the design's Product menu, reused in the blog's sidebar. The label
 * uses the lighter accent: plain accent on the deep panel is 4.03:1, which fails for small text.
 */
export function TrialPromo({ className = "" }: { className?: string }) {
  return (
    <SmartLink
      href={SIGNUP_PATH}
      className={`relative flex flex-col gap-2.5 overflow-hidden rounded-[18px] bg-deep p-[22px] text-on-deep hover:text-on-deep ${className}`}
    >
      <span aria-hidden="true" className="absolute inset-0 bg-promo-glow" />
      <span className="relative text-[11.5px] font-semibold tracking-[0.1em] text-accent-on-deep uppercase">Free trial</span>
      <span className="relative text-[20px] leading-[1.15] font-semibold tracking-[-0.02em]">Want to see it at work?</span>
      <span className="relative text-[13.5px] leading-[1.45] text-on-deep-muted">
        Two weeks of the whole channel: chat, requests, events and the Wiki. No card required.
      </span>
      <span className="relative mt-auto self-start rounded-xl bg-on-deep px-4 py-2.5 text-[14px] font-semibold text-footer">
        Start your free trial
      </span>
    </SmartLink>
  );
}
