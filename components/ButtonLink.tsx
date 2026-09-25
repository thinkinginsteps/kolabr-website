import type { ReactNode } from "react";
import type { Href } from "@/lib/links";
import { SmartLink } from "./SmartLink";

type Variant = "primary" | "secondary" | "onDeep" | "tint";
type Size = "sm" | "md" | "lg";

// Values from the design: nav buttons 15.5px / 11px 18px / r13, footer 15px, large CTAs 17px / 16px 28px / r15.
const sizes: Record<Size, string> = {
  sm: "text-[15.5px] px-[18px] py-[11px] rounded-[13px]",
  md: "text-[15px] px-[18px] py-[11px] rounded-[13px]",
  lg: "text-[17px] px-7 py-4 rounded-[15px] [--lift-y:-3px]",
};

const variants: Record<Variant, string> = {
  primary: "bg-ink text-on-ink hover:text-on-ink",
  secondary: "glass-soft border border-border text-ink hover:text-ink [--lift-shadow:var(--shadow-sm)]",
  onDeep: "bg-on-deep text-footer hover:text-footer [--lift-shadow:none]",
  tint: "bg-surface-tint text-ink hover:text-ink",
};

type ButtonLinkProps = {
  href: Href;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

/** A link styled as a button. Hover lifts it and fades in a shadow (transform and opacity only). */
export function ButtonLink({ href, children, variant = "primary", size = "md", className = "" }: ButtonLinkProps) {
  return (
    <SmartLink
      href={href}
      className={`lift inline-flex items-center justify-center font-semibold whitespace-nowrap ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </SmartLink>
  );
}
