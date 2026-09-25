import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Everything is crawlable except the contact backend and the back office. Pages that should stay out of search
// (the legal pages) say so with their own noindex tag, which is the reliable signal: a
// disallow here would stop crawlers reading that tag at all.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/admin"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
