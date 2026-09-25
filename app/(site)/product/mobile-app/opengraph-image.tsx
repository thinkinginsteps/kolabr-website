// Social share image for this page, drawn at build time by lib/og.tsx.
export { size, contentType } from "@/lib/og";
import { ogImage } from "@/lib/og";
import { pageMeta } from "@/lib/page-meta";

export const alt = pageMeta["/product/mobile-app/"].title;

export default function Image() {
  return ogImage("/product/mobile-app/");
}
