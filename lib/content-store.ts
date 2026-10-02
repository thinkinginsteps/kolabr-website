import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * The page text: content/pages/*.json, part of the code. Edit it in the repo and deploy.
 *
 * The split is deliberate. **Code owns the shape, content owns the words.** Every key, route and
 * slug stays in TypeScript, so the compiler still checks that /use-cases/law-firms/ exists and
 * that a page reads a field that is really there. The JSON holds only the strings.
 *
 * Always read from the code being built (process.cwd()), never from CONTENT_DIR. CONTENT_DIR is
 * the server's own content directory, and holds only what the back office writes: blog posts
 * (lib/blog.ts). Page text used to live there too, edited by a back office Copy editor, and a
 * deploy kept the server's words: text changed in the repo never reached the live site (246
 * changes on 2026-10-02). The editor is gone and page text ships with every deploy.
 *
 * Read synchronously at module load, which happens once per build. These modules are server-only
 * (the text is rendered into static pages), so nothing here reaches the browser.
 */

export const PAGES_DIR = path.join(process.cwd(), "content", "pages");

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
 * Extra is dropped, silently and on purpose. On 2026-10-02 a leftover "teams" in compare.json (from
 * when page text lived on the server) was prerendered as /compare/teams, which no longer had the
 * fields the page needs, and the deploy failed. The text now ships with the code, but the rule
 * stands: the code's list is the only list. Routes come from COMPARE_SLUGS, USE_CASE_SLUGS and
 * META_ROUTES, never from the keys of a content file.
 */
export function requireKeys<T extends Record<string, unknown>>(data: T, keys: readonly string[], name: string): T {
  const missing = keys.filter((k) => !(k in data));
  if (missing.length) throw new Error(`Content file ${name}.json is missing: ${missing.join(", ")}`);
  return Object.fromEntries(keys.map((k) => [k, data[k]])) as T;
}
