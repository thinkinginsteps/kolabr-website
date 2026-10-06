import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ComparePage } from "@/components/compare/ComparePage";
import { BasecampComparePage } from "@/components/compare/BasecampComparePage";
import { SlackComparePage } from "@/components/compare/SlackComparePage";
import { JsonLd } from "@/components/JsonLd";
import { comparisons, COMPARE_SLUGS, type CompareSlug } from "@/lib/compare";
import { basecampComparison } from "@/lib/compare-basecamp";
import { slackComparison } from "@/lib/compare-slack";
import type { MetaRoute } from "@/lib/page-meta";
import { breadcrumbJsonLd, faqJsonLd, graph, pageMetadata } from "@/lib/seo";

// The five compare pages. Every slug is prerendered; anything else 404s. Slack has its own layout
// and content file, as does Basecamp; the other three share ComparePage.
export const dynamicParams = false;

export function generateStaticParams() {
  return COMPARE_SLUGS.map((slug) => ({ slug }));
}

const isSlug = (s: string): s is CompareSlug => (COMPARE_SLUGS as readonly string[]).includes(s);
const route = (slug: CompareSlug) => `/compare/${slug}/` as MetaRoute;

export async function generateMetadata({ params }: PageProps<"/compare/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return isSlug(slug) ? pageMetadata(route(slug)) : {};
}

export default async function Compare({ params }: PageProps<"/compare/[slug]">) {
  const { slug } = await params;
  if (!isSlug(slug)) notFound();
  if (slug === "slack") {
    return (
      <>
        <JsonLd data={graph(breadcrumbJsonLd(route(slug)), faqJsonLd(slackComparison.faq.items))} />
        <SlackComparePage content={slackComparison} />
      </>
    );
  }
  if (slug === "basecamp") {
    return (
      <>
        <JsonLd data={graph(breadcrumbJsonLd(route(slug)), faqJsonLd(basecampComparison.faq.items))} />
        <BasecampComparePage content={basecampComparison} />
      </>
    );
  }
  const content = comparisons[slug];
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd(route(slug)), faqJsonLd(content.faq.items))} />
      <ComparePage content={content} slug={slug} />
    </>
  );
}
