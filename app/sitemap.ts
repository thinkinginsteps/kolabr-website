import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/blog";
import { pageMeta, type MetaRoute, type PageMeta } from "@/lib/page-meta";
import { absoluteUrl } from "@/lib/site";

// Every indexable page, generated at build from the same map the pages take their metadata
// from, so a new route cannot be forgotten here. noindex pages (the legal pages) are left out:
// listing a page we ask search engines to ignore is a contradictory signal.

// Rough importance within the site. Search engines treat this as a hint at most.
function priority(route: MetaRoute) {
  if (route === "/") return 1;
  if (route === "/pricing/" || route === "/product/channels/") return 0.9;
  if (route.startsWith("/product/")) return 0.8;
  if (route.startsWith("/use-cases/") || route.startsWith("/compare/")) return 0.7;
  return 0.6;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date();
  const posts = (await getPosts()).map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}/`),
    lastModified: new Date(`${post.updated ?? post.date}T00:00:00Z`),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));
  const pages = (Object.keys(pageMeta) as MetaRoute[])
    .filter((route) => !(pageMeta[route] as PageMeta).noindex)
    .map((route) => ({
      url: absoluteUrl(route),
      lastModified,
      changeFrequency: route === "/" ? ("weekly" as const) : ("monthly" as const),
      priority: priority(route),
    }));
  return [...pages, ...posts];
}
