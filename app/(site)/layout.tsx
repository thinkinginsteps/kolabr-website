import { SiteChrome } from "@/components/SiteChrome";

// Every other page: the design's nav and footer CTA read "Get started".
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome ctaLabel="Get started">{children}</SiteChrome>;
}
