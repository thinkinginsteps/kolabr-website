import type { Metadata, Viewport } from "next";
import { Analytics } from "@/components/analytics/Analytics";
import { switzer } from "@/lib/fonts";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  // Every page sets its own title, description, canonical and OG image (see docs/metadata-review.md).
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // data-scroll-behavior lets Next turn off our smooth scrolling while it resets the scroll position
  // on page changes. Without it (Next 16 default) a link to another page can stop partway down.
  return (
    <html lang="en" data-scroll-behavior="smooth" className={switzer.variable}>
      <body className="font-sans">
        {children}
        {/* Consent banner, and analytics once it is accepted. Nothing loads before that. */}
        <Analytics />
      </body>
    </html>
  );
}
