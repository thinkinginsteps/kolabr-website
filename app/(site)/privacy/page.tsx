import { JsonLd } from "@/components/JsonLd";
import { LegalPage } from "@/components/legal/LegalPage";
import { legalPages } from "@/lib/legal";
import { breadcrumbJsonLd, graph, pageMetadata } from "@/lib/seo";

// noindex until the legal entity replaces [COMPANY NAME] (set in lib/page-meta.ts).
export const metadata = pageMetadata("/privacy/");

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd("/privacy/"))} />
      <LegalPage content={legalPages.privacy} />
    </>
  );
}
