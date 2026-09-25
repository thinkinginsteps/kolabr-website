import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComparePage } from "@/components/compare/ComparePage";
import { JsonLd } from "@/components/JsonLd";
import { comparisons, type CompareSlug } from "@/lib/compare";
import type { MetaRoute } from "@/lib/page-meta";
import { breadcrumbJsonLd, faqJsonLd, graph, pageMetadata } from "@/lib/seo";

// The six compare pages. Every slug is prerendered; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(comparisons).map((slug) => ({ slug }));
}

const isSlug = (s: string): s is CompareSlug => s in comparisons;
const route = (slug: CompareSlug) => `/compare/${slug}/` as MetaRoute;

export async function generateMetadata({ params }: PageProps<"/compare/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return isSlug(slug) ? pageMetadata(route(slug)) : {};
}

export default async function Compare({ params }: PageProps<"/compare/[slug]">) {
  const { slug } = await params;
  if (!isSlug(slug)) notFound();
  const content = comparisons[slug];
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd(route(slug)), faqJsonLd(content.faq.items))} />
      <ComparePage content={content} />
    </>
  );
}
