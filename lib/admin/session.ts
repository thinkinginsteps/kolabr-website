import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { STATE_DIR } from "./config";

/**
 * Sessions for the single admin account. The token is a 32-byte random value in an httpOnly
 * cookie; the server keeps the list of live tokens, so signing out or wiping the file ends every
 * session immediately. Nothing is signed, because nothing needs to be: a token that is not in
 * the file is not a session.
 *
 * One JSON file is the right size of tool here. There is one user, sessions are counted in tens,
 * and a database would be a service to run, back up and keep alive through a deploy.
 */

const COOKIE = "kolabr_admin";
const SESSION_DAYS = 14;
const FILE = () => path.join(STATE_DIR, "sessions.json");

type Store = Record<string, { createdAt: string; expiresAt: string }>;

async function read(): Promise<Store> {
  try {
    const raw = await readFile(FILE(), "utf8");
    const parsed: unknown = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Store) : {};
  } catch {
    // No file yet, or it is unreadable: no sessions, which fails closed.
    return {};
  }
}

/** Written through a temporary file: a half-written store read by the next request is no store. */
async function write(store: Store): Promise<void> {
  await mkdir(STATE_DIR, { recursive: true });
  const tmp = `${FILE()}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(store, null, 2), { mode: 0o600 });
  await rename(tmp, FILE());
}

const live = (store: Store, now = Date.now()): Store =>
  Object.fromEntries(Object.entries(store).filter(([, s]) => Date.parse(s.expiresAt) > now));

export async function createSession(): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 86_400_000);

  const store = live(await read());
  store[token] = { createdAt: new Date().toISOString(), expiresAt: expiresAt.toISOString() };
  await write(store);

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function isSignedIn(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  const store = await read();
  const session = store[token];
  return Boolean(session && Date.parse(session.expiresAt) > Date.now());
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    const store = live(await read());
    delete store[token];
    await write(store);
  }
  jar.delete(COOKIE);
}
