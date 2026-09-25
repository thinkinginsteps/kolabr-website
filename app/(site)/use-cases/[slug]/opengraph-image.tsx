// Social share image for this page, drawn at build time by lib/og.tsx.
export { size, contentType } from "@/lib/og";
import { ogImage } from "@/lib/og";
import type { MetaRoute } from "@/lib/page-meta";
import { useCaseContent } from "@/lib/use-cases";

export const alt = "Kolabr";

export function generateStaticParams() {
  return Object.keys(useCaseContent).map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return ogImage(`/use-cases/${slug}/` as MetaRoute);
}
