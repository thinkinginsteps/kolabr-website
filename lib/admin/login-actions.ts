"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_EMAIL, ADMIN_PASSWORD_HASH } from "./config";
import { verifyPassword } from "./password";
import { createSession, destroySession } from "./session";

/**
 * Sign in to the back office. There is one account, so this is a comparison rather than a lookup.
 *
 * Every failure says the same thing. Naming which half was wrong would tell an attacker when they
 * have found the address, and with a single account the address is half the secret.
 */

export type LoginState = { error?: string };

// Rate limit by IP, in this process's memory. One instance serves the site, so that is enough;
// a second would need a shared store, exactly as with the contact form.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, number[]>();

function tooManyAttempts(ip: string, now = Date.now()): boolean {
  const recent = (attempts.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  attempts.set(ip, recent);
  if (attempts.size > 1000) for (const [key, times] of attempts) if (times.length === 0) attempts.delete(key);
  return recent.length >= MAX_ATTEMPTS;
}

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const head = await headers();
  const ip = head.get("x-real-ip") ?? head.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
    return { error: "No admin account is configured on this server." };
  }
  if (tooManyAttempts(ip)) {
    return { error: "Too many attempts. Try again in fifteen minutes." };
  }

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  // The password is verified whether or not the address matched, so a wrong address cannot be
  // spotted by answering faster than a wrong password does.
  const passwordOk = await verifyPassword(password, ADMIN_PASSWORD_HASH);
  const emailOk = email === ADMIN_EMAIL.trim().toLowerCase();

  if (!passwordOk || !emailOk) {
    attempts.set(ip, [...(attempts.get(ip) ?? []), Date.now()]);
    return { error: "That email address and password do not match." };
  }

  attempts.delete(ip);
  await createSession();
  redirect("/admin");
}

export async function signOut(): Promise<void> {
  await destroySession();
  redirect("/admin/login");
}
