import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";

/** Inline text link with the 2px accent underline used across the site. */
export function UnderlineLink({
  href,
  children,
  onDark = false,
  inline = false,
  className = "",
}: {
  href: Route;
  children: ReactNode;
  onDark?: boolean;
  /** Inside running text: normal weight, as the design styles links in paragraphs. */
  inline?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`self-start border-b-2 border-accent ${inline ? "font-normal" : "font-semibold"} ${onDark ? "pb-0.5 text-on-deep hover:text-accent" : "pb-px text-ink hover:text-ink"} ${className}`}
    >
      {children}
    </Link>
  );
}
