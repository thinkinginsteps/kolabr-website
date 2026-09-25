import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { PAGES_DIR } from "@/lib/content-store";

/**
 * Editing the page copy. The back office never sends back a whole document: it sends patches,
 * each naming a path and a new string. Applying them can only ever replace a string that is
 * already there, so an edit cannot add, remove, rename or retype anything the pages depend on.
 * That is what keeps a typo from becoming a broken build.
 */

/** The files that hold editable copy, and what to call them in the interface. */
export const COPY_FILES = {
  "page-meta": { label: "Search titles and descriptions", note: "What Google shows for each page." },
  "use-cases": { label: "Use case pages", note: "The twelve industry pages." },
  "use-case-schools": { label: "Schools page", note: "The schools use case, which has its own layout." },
  "use-case-faqs": { label: "Use case questions", note: "The FAQ shown on each use case page." },
  compare: { label: "Compare pages", note: "Kolabr against Slack, Teams, Basecamp, Notion, ClickUp and Zendesk." },
  legal: { label: "Legal pages", note: "Privacy, terms, cookies and refunds." },
} as const;

export type CopyFile = keyof typeof COPY_FILES;

export const isCopyFile = (name: string): name is CopyFile => name in COPY_FILES;

export type CopyField = {
  /** Dotted path into the document, for example use-cases.law-firms.hero.title */
  path: string;
  /** Where it sits, in words: "Law firms › hero › title". */
  label: string;
  value: string;
  /** Long values get a taller box. */
  multiline: boolean;
};

type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

const file = (name: CopyFile) => path.join(PAGES_DIR, `${name}.json`);

export async function readCopy(name: CopyFile): Promise<Json> {
  return JSON.parse(await readFile(file(name), "utf8")) as Json;
}

/**
 * Flattens a document to its editable strings. Keys that are structure rather than copy are
 * skipped: an href, an image filename or a section id is not something to type prose into, and
 * changing one silently breaks a link or a picture.
 */
const STRUCTURAL = new Set(["href", "file", "id", "type", "slug", "name", "icon"]);

export function fields(value: Json, prefix = "", trail: string[] = []): CopyField[] {
  if (typeof value === "string") {
    const key = trail[trail.length - 1] ?? "";
    return [
      {
        path: prefix,
        label: trail.join(" › "),
        value,
        multiline: value.length > 90 || key === "body" || key === "a" || key === "text",
      },
    ];
  }
  if (Array.isArray(value)) {
    return value.flatMap((v, i) => fields(v, `${prefix}.${i}`, [...trail, `${i + 1}`]));
  }
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) =>
      STRUCTURAL.has(k) && typeof v === "string" ? [] : fields(v, prefix ? `${prefix}.${k}` : k, [...trail, k]),
    );
  }
  // Numbers and booleans (noindex, a table flag) are structure, not copy.
  return [];
}

/** The top-level sections of a document, so the editor can show one page at a time. */
export function groups(value: Json): string[] {
  return value && typeof value === "object" && !Array.isArray(value) ? Object.keys(value) : [];
}

export type Patch = { path: string; value: string };

/**
 * Applies patches in place. Every path must already resolve to a string; anything else is
 * rejected rather than created, so the document keeps exactly the shape the code expects.
 */
export function applyPatches(doc: Json, patches: Patch[]): { applied: number; rejected: string[] } {
  const rejected: string[] = [];
  let applied = 0;

  for (const patch of patches) {
    const parts = patch.path.split(".");
    const last = parts.pop();
    if (!last) {
      rejected.push(patch.path);
      continue;
    }
    let node: Json = doc;
    for (const part of parts) {
      if (Array.isArray(node)) node = node[Number(part)] as Json;
      else if (node && typeof node === "object") node = (node as Record<string, Json>)[part];
      else {
        node = null as unknown as Json;
        break;
      }
      if (node === undefined || node === null) break;
    }
    const container = node as Record<string, Json> | Json[] | null;
    if (!container || typeof container !== "object") {
      rejected.push(patch.path);
      continue;
    }
    const key = Array.isArray(container) ? Number(last) : last;
    const current = (container as Record<string | number, Json>)[key];
    if (typeof current !== "string") {
      rejected.push(patch.path);
      continue;
    }
    if (current !== patch.value) {
      (container as Record<string | number, Json>)[key] = patch.value;
      applied += 1;
    }
  }
  return { applied, rejected };
}

export async function writeCopy(name: CopyFile, doc: Json): Promise<void> {
  await mkdir(PAGES_DIR, { recursive: true });
  const target = file(name);
  const tmp = `${target}.${process.pid}.tmp`;
  await writeFile(tmp, `${JSON.stringify(doc, null, 2)}\n`, "utf8");
  await rename(tmp, target);
}
