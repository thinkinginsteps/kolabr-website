// Brings the server's content in line with the code a deploy is installing: adds the copy new code
// needs, retires entries the code removed, and never changes words already there.
//
// Why this exists: a deploy never overwrites /opt/kolabr/content, because that copy may have been
// edited in the back office. But when code adds a page or a field, its words live in
// content/pages/*.json, and the build refuses to run without them ("Content file page-meta.json
// is missing: /dpa/"). So deploy.sh runs this before every build, with the package's copy as the
// source of anything new.
//
// The rule, applied recursively to every JSON object:
//   - a key the package has and the server does not   -> added, with the package's value
//   - a key both have, both values plain objects       -> merged by the same rule
//   - a key both have, anything else                   -> the server's value stays, untouched
//   - a TOP-LEVEL key only the server has              -> removed: top-level keys are routes and
//                                                         slugs, owned by the code, and the site
//                                                         builds pages from them (a leftover "teams"
//                                                         failed the 2026-10-02 deploy)
//   - a nested key only the server has                 -> stays (just words; harmless)
// A package file with no keys at all removes nothing. Files the package does not have are left
// alone. deploy.sh backs the whole content directory up before running this.
// Lists are values, not merged item by item: a FAQ list edited on the server stays whole.
// A whole file the server lacks is copied. A server file that is not valid JSON stops the sync
// (and so the deploy) with the file named, rather than being replaced.
//
// Lives in deploy/ because it is part of the server, not the site: install-server.sh installs it
// root-owned at /opt/kolabr/content-sync.mjs, and deploy.sh runs that copy, so a package from any
// version of the repo gets its new copy added.
//
// Usage (deploy.sh): node /opt/kolabr/content-sync.mjs <package content/pages> <server content/pages>

import { existsSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const isPlainObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const kind = (v) => (v === null ? "null" : Array.isArray(v) ? "list" : typeof v);

/** Adds keys from `from` missing in `into`, in place. Returns the dotted paths it added. */
function addMissing(into, from, path, added, warnings, file) {
  for (const [key, value] of Object.entries(from)) {
    const here = path ? `${path}.${key}` : key;
    if (!(key in into)) {
      into[key] = structuredClone(value);
      added.push(`${file}: ${here}`);
    } else if (isPlainObject(into[key]) && isPlainObject(value)) {
      addMissing(into[key], value, here, added, warnings, file);
    } else if (kind(into[key]) !== kind(value) && (isPlainObject(into[key]) || isPlainObject(value))) {
      // The code changed the shape of this entry. Keeping the server's value is the only safe
      // choice here, but the build may now fail on it: say so in the deploy log.
      warnings.push(`${file}: ${here} is a ${kind(into[key])} on the server but a ${kind(value)} in the package; kept the server's`);
    }
  }
}

function readJson(file, label) {
  const text = readFileSync(file, "utf8");
  try {
    return JSON.parse(text);
  } catch (err) {
    throw new Error(`${label} is not valid JSON (${err.message}); fix it before deploying`);
  }
}

/** Same format and method as the back office (lib/admin/copy.ts): temp file, then rename. */
function writeJson(file, data) {
  const tmp = `${file}.tmp`;
  writeFileSync(tmp, `${JSON.stringify(data, null, 2)}\n`, { encoding: "utf8", mode: 0o644 });
  renameSync(tmp, file);
}

export function syncContent(packageDir, serverDir) {
  const added = [];
  const removed = [];
  const warnings = [];
  if (!existsSync(packageDir)) return { added, removed, warnings };

  for (const name of readdirSync(packageDir).filter((n) => n.endsWith(".json")).sort()) {
    const source = readJson(join(packageDir, name), `package ${name}`);
    const target = join(serverDir, name);

    if (!existsSync(target)) {
      writeJson(target, source);
      added.push(`${name} (new file)`);
      continue;
    }

    const current = readJson(target, `server ${name}`);
    if (!isPlainObject(current) || !isPlainObject(source)) {
      if (kind(current) !== kind(source)) warnings.push(`${name}: top level differs in shape; kept the server's`);
      continue;
    }
    const before = added.length + removed.length;
    addMissing(current, source, "", added, warnings, name);
    // Retire whole entries the code no longer has. Never from an empty package file: that is far
    // more likely a mistake than the code removing every page in it.
    if (Object.keys(source).length > 0) {
      for (const key of Object.keys(current)) {
        if (!(key in source)) {
          delete current[key];
          removed.push(`${name}: ${key}`);
        }
      }
    }
    // Only rewrite a file that changed: an untouched file keeps its bytes and its mtime.
    if (added.length + removed.length > before) writeJson(target, current);
  }
  return { added, removed, warnings };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [packageDir, serverDir] = process.argv.slice(2);
  if (!packageDir || !serverDir) {
    console.error("usage: node content-sync.mjs <package content/pages> <server content/pages>");
    process.exit(2);
  }
  try {
    const { added, removed, warnings } = syncContent(packageDir, serverDir);
    if (added.length + removed.length === 0) console.log("content: nothing to add or retire; server copy unchanged");
    for (const a of added) console.log(`content: added ${a}`);
    for (const r of removed) console.log(`content: retired ${r} (no longer in the code)`);
    for (const w of warnings) console.log(`content: WARNING ${w}`);
  } catch (err) {
    console.error(`content: ${err.message}`);
    process.exit(1);
  }
}
