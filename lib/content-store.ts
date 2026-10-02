import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * The editable copy: JSON files the back office writes and the build reads.
 *
 * The split is deliberate. **Code owns the shape, content owns the words.** Every key, route and
 * slug stays in TypeScript, so the compiler still checks that /use-cases/law-firms/ exists and
 * that a page reads a field that is really there. The JSON holds only the strings.
 *
 * That is also what makes editing safe: the back office patches string values by path and cannot
 * add, remove or rename anything, so no edit can change the shape the pages rely on.
 *
 * Read synchronously at module load, which happens once per build. These modules are server-only
 * (the copy is rendered into static pages), so nothing here reaches the browser.
 */

const CONTENT_DIR = process.env.CONTENT_DIR ?? path.join(process.cwd(), "content");

export const PAGES_DIR = path.join(CONTENT_DIR, "pages");

export function loadContent<T>(name: string): T {
  const file = path.join(PAGES_DIR, `${name}.json`);
  try {
    return JSON.parse(readFileSync(file, "utf8")) as T;
  } catch (e) {
    // Failing the build is right: a page with missing copy is worse than no deploy, and the
    // rebuild keeps the previous build live when this happens.
    throw new Error(`Could not read content file ${file}: ${e instanceof Error ? e.message : e}`);
  }
}

/**
 * Checks that the content file still has every key the code expects, and returns only those keys.
 *
 * Missing is an error: a bad hand edit or a half-finished migration can lose one, and the message
 * should name the file rather than surface as "cannot read properties of undefined" inside a page.
 *
 * Extra is dropped, silently and on purpose. The server's content outlives the code and a deploy
 * never rewrites words already there, so a page retired in code can leave its entry behind. On
 * 2026-10-02 a leftover "teams" in compare.json was prerendered as /compare/teams, which no longer
 * had the fields the page needs, and the deploy failed. The code's list is the only list: routes
 * come from COMPARE_SLUGS, USE_CASE_SLUGS and META_ROUTES, never from the keys of a content file.
 */
export function requireKeys<T extends Record<string, unknown>>(data: T, keys: readonly string[], name: string): T {
  const missing = keys.filter((k) => !(k in data));
  if (missing.length) throw new Error(`Content file ${name}.json is missing: ${missing.join(", ")}`);
  return Object.fromEntries(keys.map((k) => [k, data[k]])) as T;
}
