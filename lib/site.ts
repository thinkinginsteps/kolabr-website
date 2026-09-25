import type { ExternalHref } from "./links";

export const SITE_URL = "https://kolabr.com";
export const SITE_NAME = "Kolabr";

/** Base URL of the Kolabr app (sign in / sign up). Not yet decided, so it comes from the env. */
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";

/** Every trial CTA points here; next.config redirects it to the app. */
export const SIGNUP_PATH = "/signup/" satisfies ExternalHref;

/** Sign in goes straight to the app. Until the URL is known it falls back to the signup route. */
export const SIGN_IN_HREF = (APP_URL || SIGNUP_PATH) as ExternalHref;

/**
 * Google Tag Manager container. Public, not a secret, and the same in every environment, so it
 * is here rather than in the env; set NEXT_PUBLIC_GTM_ID to point a staging build somewhere
 * else, or to an empty string to switch the container off. Nothing loads without consent.
 */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-M37PVG29";

/** Direct GA4, for an environment with a measurement ID but no container. GTM wins if both exist. */
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}

/**
 * App store links for the Mobile app page. Not known yet: until they are set, the store
 * buttons render as plain (non-link) badges so nothing points at "#".
 */
export const APP_STORE_URL: `https://${string}` | null = null;
export const PLAY_STORE_URL: `https://${string}` | null = null;
