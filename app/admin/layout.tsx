import type { Metadata } from "next";

/**
 * The back office. Everything under /admin is dynamic and private, which is the one deliberate
 * exception to the rule that this site is entirely static: see docs/build-report.md. It is
 * noindex here, disallowed in robots.ts, absent from the sitemap and unlinked from the site.
 */
export const metadata: Metadata = {
  title: "Kolabr admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-screen bg-surface-tint">{children}</div>;
}
