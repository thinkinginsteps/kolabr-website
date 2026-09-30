import { JsonLd } from "@/components/JsonLd";
import { LegalPage } from "@/components/legal/LegalPage";
import { legalPages } from "@/lib/legal";
import { breadcrumbJsonLd, graph, pageMetadata } from "@/lib/seo";

// noindex until the legal entity replaces [COMPANY NAME] (set in lib/page-meta.ts).
export const metadata = pageMetadata("/dpa/");

export default function DpaPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd("/dpa/"))} />
      <LegalPage content={legalPages.dpa} />
    </>
  );
}
