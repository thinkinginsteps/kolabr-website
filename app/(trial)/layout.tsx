import { SiteChrome } from "@/components/SiteChrome";

// Home and Pricing: the design's nav and footer CTA read "Start free trial" here.
export default function TrialLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome ctaLabel="Start free trial">{children}</SiteChrome>;
}
