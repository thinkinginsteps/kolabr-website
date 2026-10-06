import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { BasecampComparePage } from "@/components/compare/BasecampComparePage";
import { ClickUpComparePage } from "@/components/compare/ClickUpComparePage";
import { NotionComparePage } from "@/components/compare/NotionComparePage";
import { SlackComparePage } from "@/components/compare/SlackComparePage";
import { ZendeskComparePage } from "@/components/compare/ZendeskComparePage";
import { JsonLd } from "@/components/JsonLd";
import { COMPARE_SLUGS, type CompareSlug } from "@/lib/compare";
import { basecampComparison } from "@/lib/compare-basecamp";
import { clickupComparison } from "@/lib/compare-clickup";
import { notionComparison } from "@/lib/compare-notion";
import { slackComparison } from "@/lib/compare-slack";
import { zendeskComparison } from "@/lib/compare-zendesk";
import type { MetaRoute } from "@/lib/page-meta";
import type { Card } from "@/lib/use-cases";
import { breadcrumbJsonLd, faqJsonLd, graph, pageMetadata } from "@/lib/seo";

// The five compare pages. Every slug is prerendered; anything else 404s. Each page has its own
// content file and layout, because each makes its own argument against its own competitor.
export const dynamicParams = false;

export function generateStaticParams() {
  return COMPARE_SLUGS.map((slug) => ({ slug }));
}

/** Each page's layout, and the FAQ its structured data is built from. */
const PAGES: Record<CompareSlug, { page: ReactNode; faq: Card[] }> = {
  slack: { page: <SlackComparePage content={slackComparison} />, faq: slackComparison.faq.items },
  basecamp: { page: <BasecampComparePage content={basecampComparison} />, faq: basecampComparison.faq.items },
  notion: { page: <NotionComparePage content={notionComparison} />, faq: notionComparison.faq.items },
  clickup: { page: <ClickUpComparePage content={clickupComparison} />, faq: clickupComparison.faq.items },
  zendesk: { page: <ZendeskComparePage content={zendeskComparison} />, faq: zendeskComparison.faq.items },
};

const isSlug = (s: string): s is CompareSlug => (COMPARE_SLUGS as readonly string[]).includes(s);
const route = (slug: CompareSlug) => `/compare/${slug}/` as MetaRoute;

export async function generateMetadata({ params }: PageProps<"/compare/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  return isSlug(slug) ? pageMetadata(route(slug)) : {};
}

export default async function Compare({ params }: PageProps<"/compare/[slug]">) {
  const { slug } = await params;
  if (!isSlug(slug)) notFound();
  const { page, faq } = PAGES[slug];
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd(route(slug)), faqJsonLd(faq))} />
      {page}
    </>
  );
}
