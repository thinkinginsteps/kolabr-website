import "server-only";
import { redirect } from "next/navigation";
import { ADMIN_EMAIL, ADMIN_PASSWORD_HASH } from "./config";
import { isSignedIn } from "./session";

/** The back office is unusable until both halves of the single account are configured. */
export const adminConfigured = () => Boolean(ADMIN_EMAIL && ADMIN_PASSWORD_HASH);

/**
 * For pages and server actions. Redirects rather than throwing, so a signed-out visitor lands on
 * the login page instead of an error. Route handlers should check `isSignedIn()` themselves and
 * answer 401: a redirect to an HTML page is unparseable to something expecting JSON.
 */
export async function requireAdmin(): Promise<void> {
  if (!(await isSignedIn())) redirect("/admin/login");
}
