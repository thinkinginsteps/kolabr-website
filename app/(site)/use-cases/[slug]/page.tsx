import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { UseCasePage } from "@/components/use-case/UseCasePage";
import type { MetaRoute } from "@/lib/page-meta";
import { breadcrumbJsonLd, faqJsonLdFromPairs, graph, pageMetadata } from "@/lib/seo";
import { useCaseFaqs } from "@/lib/use-case-faqs";
import { useCaseContent, type UseCaseSlug } from "@/lib/use-cases";

// The twelve industry pages on the shared template. Schools has its own page (a static
// segment, which wins over this dynamic one). Every slug is prerendered; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(useCaseContent).map((slug) => ({ slug }));
}

const isSlug = (s: string): s is UseCaseSlug => s in useCaseContent;
const route = (slug: UseCaseSlug) => `/use-cases/${slug}/` as MetaRoute;

export async function generateMetadata({ params }: PageProps<"/use-cases/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return isSlug(slug) ? pageMetadata(route(slug)) : {};
}

export default async function UseCase({ params }: PageProps<"/use-cases/[slug]">) {
  const { slug } = await params;
  if (!isSlug(slug)) notFound();
  const faqs = useCaseFaqs[slug];
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd(route(slug)), faqJsonLdFromPairs(faqs))} />
      <UseCasePage content={useCaseContent[slug]} faqs={faqs} />
    </>
  );
}
