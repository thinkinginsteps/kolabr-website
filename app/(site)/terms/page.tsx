import { JsonLd } from "@/components/JsonLd";
import { LegalPage } from "@/components/legal/LegalPage";
import { legalPages } from "@/lib/legal";
import { breadcrumbJsonLd, graph, pageMetadata } from "@/lib/seo";

// noindex until the legal entity replaces [COMPANY NAME] (set in lib/page-meta.ts).
export const metadata = pageMetadata("/terms/");

export default function TermsPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd("/terms/"))} />
      <LegalPage content={legalPages.terms} />
    </>
  );
}
