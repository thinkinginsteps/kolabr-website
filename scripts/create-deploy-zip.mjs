// Builds the deployment package: a source zip you upload in the back office.
//
// The server builds from this, so the package is source plus committed assets, never a build.
// The file list comes from git: everything tracked, plus new files not yet committed, minus
// everything .gitignore excludes. So .gitignore is the one list of what is local (node_modules,
// .next, .local-state, server notes, .env*); a stray file ignored there can never ship. On top of
// that, PACKAGE_EXCLUDE drops what is committed but the server does not need: design/, 74MB of
// mockups only `npm run assets` reads, and the agent and editor folders.
// The images the pages import live in assets/ and do ship.
//
// Usage: npm run publish:package   (or npm run publish:prepare to check it first)

import { execFileSync } from "node:child_process";
import { createWriteStream, existsSync, mkdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";
import archiver from "archiver";

const root = process.cwd();
const publishDir = join(root, "publish");
mkdirSync(publishDir, { recursive: true });

const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "-");
const outPath = join(publishDir, `kolabr-${stamp}.zip`);
if (existsSync(outPath)) rmSync(outPath);

// The server checks for these after extracting; failing here is a clearer error than failing there.
const REQUIRED = ["package.json", "package-lock.json", "next.config.ts", "app", "components", "lib", "assets"];
const missing = REQUIRED.filter((f) => !existsSync(join(root, f)));
if (missing.length) {
  console.error(`Cannot package: missing ${missing.join(", ")}. Run this from the project root.`);
  process.exit(1);
}

// Committed, but not needed to build the site on the server.
const PACKAGE_EXCLUDE = [/^design\//, /^\.claude\//, /^Brain\//, /^\.vscode\//];

// Never ship these, whatever git thinks. .gitignore already covers them; this is the check that
// it held, run before a single byte is written.
const SECRET = [
  { test: (f) => /(^|\/)\.env(\.|$)/.test(f) && f !== ".env.example", why: "it may hold secrets" },
  { test: (f) => /\.(key|pem|p12|pfx)$/i.test(f), why: "it looks like a key or certificate" },
  { test: (f) => /(^|\/)server\.md$/i.test(f), why: "it holds server access details" },
  { test: (f) => /(^|\/)creds\.md$/i.test(f), why: "it holds credentials" },
];

const NUL = String.fromCharCode(0);

function listFiles() {
  let out;
  try {
    // -z: NUL separated, so no quoting or escaping of unusual file names.
    out = execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch (err) {
    console.error(`Cannot package: git could not list the project's files (${err.message.trim()}).`);
    console.error("The package is built from git's view of the project, so run this inside the repository.");
    process.exit(1);
  }
  const names = [...new Set(out.split(NUL).filter(Boolean))];
  // A file deleted but not yet committed is still listed as tracked; it is gone, so it does not ship.
  return names.filter((f) => !PACKAGE_EXCLUDE.some((re) => re.test(f)) && existsSync(join(root, f)));
}

const files = listFiles();

const refused = files.flatMap((f) => SECRET.filter((s) => s.test(f)).map((s) => `  ${f}: ${s.why}`));
if (refused.length) {
  console.error(`Refusing to package:\n${refused.join("\n")}\nAdd them to .gitignore, or move them out of the project.`);
  process.exit(1);
}
if (!files.includes(".env.example")) {
  console.warn("Warning: .env.example is not in the package, so the server has no template to check against.");
}

const output = createWriteStream(outPath);
const zip = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
  const mb = (zip.pointer() / (1024 * 1024)).toFixed(2);
  console.log(`\nCreated ${outPath} (${files.length} files, ${mb} MB)`);
  console.log("Upload it in the back office (/admin/) under Deploy.");
});

zip.on("warning", (err) => {
  throw err;
});
zip.on("error", (err) => {
  throw err;
});

zip.pipe(output);
for (const f of files) zip.file(join(root, f), { name: f });

await zip.finalize();

const size = statSync(outPath).size;
if (size < 1024 * 1024) {
  console.warn(`\nWarning: the package is only ${(size / 1024).toFixed(0)} KB, which looks too small.`);
}
