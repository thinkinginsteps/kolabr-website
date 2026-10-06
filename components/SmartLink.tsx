import Link from "next/link";
import type { Route } from "next";
import type { ComponentPropsWithoutRef } from "react";
import { isExternal, type Href } from "@/lib/links";

type SmartLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & { href: Href };

/**
 * next/link for internal routes (typed), a plain anchor for the app, the /signup/ redirect and
 * jumps within the page. A "#section" link goes through the browser, not next/link: when the URL
 * already ends in that hash, next/link treats the click as no navigation and does not scroll, so
 * a second press of the same button did nothing.
 */
export function SmartLink({ href, ...props }: SmartLinkProps) {
  if (isExternal(href) || href.startsWith("#")) return <a href={href} {...props} />;
  // Blog slugs come from files on disk, so typedRoutes cannot know them; the routes are
  // generated from the same list, and a missing file fails the build rather than 404ing.
  return <Link href={href as Route} {...props} />;
}
