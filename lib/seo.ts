import type { Metadata } from "next";
import { pageMeta, type MetaRoute } from "./page-meta";
import { plans } from "./pricing";
import { SITE_NAME, SITE_URL, absoluteUrl } from "./site";
import type { PostMeta } from "./blog";
import type { Card, Rich } from "./use-cases";

/**
 * Metadata for a page: its reviewed title and description, a trailing-slash canonical on
 * kolabr.com, and matching Open Graph / Twitter tags. OG images come from the route's
 * opengraph-image file (generated at build), which Next adds to both automatically.
 */
export function pageMetadata(route: MetaRoute): Metadata {
  const meta: { title: string; description: string; noindex?: boolean } = pageMeta[route];
  const url = absoluteUrl(route);
  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      url,
      title: meta.title,
      description: meta.description,
      locale: "en",
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
    ...(meta.noindex && { robots: { index: false, follow: true } }),
  };
}

/**
 * BreadcrumbList for a page. There are no /product, /use-cases or /compare index pages yet,
 * so trails are Home > Page; add the middle level when those pages exist.
 */
export function breadcrumbJsonLd(route: MetaRoute) {
  const items = [{ name: "Home", url: absoluteUrl("/") }];
  if (route !== "/") items.push({ name: pageMeta[route].name, url: absoluteUrl(route) });
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
  };
}

export const organizationJsonLd = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: absoluteUrl("/logo.svg"),
};

export const websiteJsonLd = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  publisher: { "@id": `${SITE_URL}/#organization` },
};

/**
 * Offers from the plans on the pricing page. Prices are not final, so they live in one place
 * (lib/pricing.ts) and this reads them rather than repeating them: what search engines are
 * told always matches what the page shows.
 */
const offers = plans.map((plan) => ({
  "@type": "Offer",
  name: plan.name,
  price: plan.monthly.replace(/[^0-9.]/g, ""),
  priceCurrency: "USD",
  category: "SaaS subscription",
  url: `${SITE_URL}/pricing/`,
  description: plan.blurb,
  eligibleQuantity: { "@type": "QuantitativeValue", unitText: "user" },
}));

/** Product schema for /pricing and the product pages. */
export const softwareApplicationJsonLd = {
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/#software`,
  name: SITE_NAME,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android",
  url: `${SITE_URL}/`,
  description:
    "A collaboration app that puts your team and the clients, partners and suppliers you work with in one shared channel, with chat, requests, meetings and a wiki.",
  publisher: { "@id": `${SITE_URL}/#organization` },
  offers,
  // A free trial is a real, checkable claim; ratings and review counts are not invented here.
  isAccessibleForFree: false,
};

const plain = (r: Rich) => (typeof r === "string" ? r : r.map((p) => (typeof p === "string" ? p : p.label)).join(""));

/** FAQPage from question cards (answers flattened to plain text; links become their label). */
export function faqJsonLd(items: Card[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({
      "@type": "Question",
      name: q.title,
      acceptedAnswer: { "@type": "Answer", text: plain(q.body) },
    })),
  };
}

/* ---------- Blog posts ---------- */

/** Metadata for a post, from its own frontmatter. Drafts are noindex so they can be reviewed. */
export function postMetadata(post: PostMeta): Metadata {
  const url = absoluteUrl(`/blog/${post.slug}/`);
  // Post titles are already 50 to 60 characters on their own, so the brand is not appended:
  // Google adds the site name to the result itself, and a longer title would be truncated.
  return {
    title: { absolute: post.title },
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: SITE_NAME,
      url,
      title: post.title,
      description: post.description,
      locale: "en",
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.description },
    ...(post.draft && { robots: { index: false, follow: false } }),
  };
}

/** BlogPosting for a post. Kolabr itself is the author: no individual bylines yet. */
export function postJsonLd(post: PostMeta) {
  const url = absoluteUrl(`/blog/${post.slug}/`);
  return {
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${absoluteUrl("/blog/")}#blog` },
    inLanguage: "en",
  };
}

/** Home > Blog > Post. */
export function postBreadcrumbJsonLd(post: PostMeta) {
  const items = [
    { name: "Home", url: absoluteUrl("/") },
    { name: "Blog", url: absoluteUrl("/blog/") },
    { name: post.title, url: absoluteUrl(`/blog/${post.slug}/`) },
  ];
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
  };
}

/** FAQPage from plain question and answer pairs (the use case pages). */
export function faqJsonLdFromPairs(items: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/** Wraps nodes in one @graph document. */
export function graph(...nodes: Record<string, unknown>[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
