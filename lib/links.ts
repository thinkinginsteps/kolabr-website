import type { Route } from "next";
import type { CompareSlug } from "./compare";
import type { UseCaseSlug } from "./use-cases";

/** Links that leave the Next.js router: the app, and the /signup/ redirect to it. */
export type ExternalHref = `https://${string}` | `http://${string}` | "/signup/";

/**
 * The use case pages come from a dynamic segment, which Next's generic `Route` type cannot
 * match outside a literal at the call site, so they are listed from the content keys.
 */
export type UseCaseRoute = `/use-cases/${UseCaseSlug | "schools"}`;
export type CompareRoute = `/compare/${CompareSlug}`;
/** Blog posts come from files in content/blog/, so their slugs are not known to the type system. */
export type BlogRoute = `/blog/${string}`;

/** Any link on the site. Internal routes are type-checked against real pages (typedRoutes). */
export type Href = Route | UseCaseRoute | CompareRoute | BlogRoute | ExternalHref;

export const isExternal = (href: string): href is ExternalHref =>
  /^https?:\/\//.test(href) || href === "/signup/";
