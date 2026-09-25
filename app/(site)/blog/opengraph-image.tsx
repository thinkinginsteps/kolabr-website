// Social share image for the blog listing, drawn at build time by lib/og.tsx.
export { size, contentType } from "@/lib/og";
import { ogImage } from "@/lib/og";
import { pageMeta } from "@/lib/page-meta";

export const alt = pageMeta["/blog/"].title;

export default function Image() {
  return ogImage("/blog/");
}
