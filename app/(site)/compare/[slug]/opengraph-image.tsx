// Social share image for this page, drawn at build time by lib/og.tsx.
export { size, contentType } from "@/lib/og";
import { ogImage } from "@/lib/og";
import type { MetaRoute } from "@/lib/page-meta";
import { COMPARE_SLUGS } from "@/lib/compare";

export const alt = "Kolabr";

export function generateStaticParams() {
  return COMPARE_SLUGS.map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return ogImage(`/compare/${slug}/` as MetaRoute);
}
