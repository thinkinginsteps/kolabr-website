import type { ReactNode } from "react";
import { Footer } from "./Footer";
import { Nav } from "./Nav";
import { ScrollReveal } from "./ScrollReveal";

/**
 * Nav, main and footer. The design labels the nav and footer CTA "Start free trial" on Home
 * and Pricing and "Get started" everywhere else; route-group layouts pass the right label.
 */
export function SiteChrome({ ctaLabel, children }: { ctaLabel: string; children: ReactNode }) {
  return (
    <div className="overflow-x-clip">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-70 focus:rounded-xl focus:bg-ink focus:px-4 focus:py-3 focus:text-on-ink"
      >
        Skip to content
      </a>
      <Nav ctaLabel={ctaLabel} />
      <main id="main">{children}</main>
      <Footer ctaLabel={ctaLabel} />
      <ScrollReveal />
    </div>
  );
}
