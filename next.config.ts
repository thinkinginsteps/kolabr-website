import type { NextConfig } from "next";
import { SERVER_ACTION_BODY_LIMIT_BYTES } from "./lib/admin/limits";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

if (!appUrl) {
  console.warn(
    "\n[kolabr] NEXT_PUBLIC_APP_URL is not set. /signup/ will not redirect to the app in this build.\n",
  );
}

const nextConfig: NextConfig = {
  output: "standalone",
  // Publishing a blog post rebuilds the site while the old build is still serving it. The
  // rebuild writes to a separate directory and only swaps it in once it has succeeded, so a
  // broken build can never half-overwrite the live one. Deploys leave this unset.
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  trailingSlash: true,
  typedRoutes: true,
  poweredByHeader: false,
  experimental: {
    // Deployment packages are uploaded through a Server Action, which Next otherwise caps at 1MB.
    serverActions: { bodySizeLimit: SERVER_ACTION_BODY_LIMIT_BYTES },
  },
  images: {
    formats: ["image/webp"],
    qualities: [75, 85],
  },
  async redirects() {
    // Sign-up lives in the Kolabr app. Every "Start free trial" / "Get started" CTA
    // points at /signup/ so the destination is set in one place.
    if (!appUrl) return [];
    return [{ source: "/signup/", destination: appUrl, permanent: false }];
  },
};

export default nextConfig;
