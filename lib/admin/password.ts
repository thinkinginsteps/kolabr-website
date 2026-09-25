// Deliberately not marked "server-only": scripts/create-admin-password.mjs imports it from the
// command line. It is pure node:crypto, so a client bundle could not include it anyway.
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

/**
 * Password hashing with scrypt, which is in Node itself: one account does not justify a native
 * dependency that has to compile on the server. The parameters below are the OWASP scrypt
 * baseline and take roughly 100ms per verification on a small VPS, which is the point.
 *
 * Format: scrypt.N.r.p.salt.hash, salt and hash base64url. Everything needed to verify travels
 * with the hash, so the cost can be raised later without invalidating the existing password.
 *
 * The separator is a dot, not the conventional dollar: .env files expand $NAME, so a dollar
 * separated hash arrives at the app with its fields replaced by empty strings and every login
 * fails with no visible reason.
 */

const scrypt = promisify(scryptCb) as (p: string | Buffer, s: string | Buffer, k: number, o?: { N: number; r: number; p: number; maxmem: number }) => Promise<Buffer>;

const N = 2 ** 16;
const r = 8;
const p = 1;
const KEY_LENGTH = 32;
// scrypt needs roughly 128 * N * r bytes; Node's default cap is below that at this N.
const maxmem = 256 * N * r;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(password.normalize("NFKC"), salt, KEY_LENGTH, { N, r, p, maxmem });
  return ["scrypt", N, r, p, salt.toString("base64url"), key.toString("base64url")].join(".");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split(".");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, nRaw, rRaw, pRaw, saltRaw, keyRaw] = parts;
  const params = { N: Number(nRaw), r: Number(rRaw), p: Number(pRaw), maxmem: 256 * Number(nRaw) * Number(rRaw) };
  if (!Number.isFinite(params.N) || !Number.isFinite(params.r) || !Number.isFinite(params.p)) return false;

  const expected = Buffer.from(keyRaw, "base64url");
  let actual: Buffer;
  try {
    actual = await scrypt(password.normalize("NFKC"), Buffer.from(saltRaw, "base64url"), expected.length, params);
  } catch {
    return false;
  }
  // Constant time: a length check first, because timingSafeEqual throws on a mismatch.
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
