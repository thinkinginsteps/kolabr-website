// Builds the deployment package: a source zip you upload in the back office.
//
// The server builds from this, so the package is source plus committed assets, never a build.
// Left out: anything local (node_modules, .next), anything secret (.env*), anything the server
// owns (publish/, deploy state), and design/, which is 74MB of mockups only `npm run assets`
// needs. The images the pages import live in assets/ and do ship.
//
// Usage: npm run publish:package   (or npm run publish:prepare to check it first)

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

const IGNORE = [
  ".git/**",
  ".next/**",
  "node_modules/**",
  "publish/**",
  "design/**",
  ".design-backup/**",
  ".visual-diff/**",
  "*.log",
  // No negation patterns here: readdir-glob treats one as "exclude everything", which silently
  // produced an empty package. .env.example is added back explicitly below.
  ".env",
  ".env.*",
  ".DS_Store",
  "**/.DS_Store",
];

const output = createWriteStream(outPath);
const zip = archiver("zip", { zlib: { level: 9 } });

output.on("close", () => {
  const mb = (zip.pointer() / (1024 * 1024)).toFixed(2);
  console.log(`\nCreated ${outPath} (${mb} MB)`);
  console.log("Upload it at https://kolabr.com/admin/ under Deploy.");
});

zip.on("warning", (err) => {
  if (err.code === "ENOENT") return;
  throw err;
});
zip.on("error", (err) => {
  throw err;
});

zip.pipe(output);
zip.glob("**/*", { cwd: root, dot: true, ignore: IGNORE });
zip.file(join(root, ".env.example"), { name: ".env.example" });

// A last look for secrets: the ignore list is a rule, this is the check that it held.
zip.on("entry", (entry) => {
  if (/^\.env(\.|$)/.test(entry.name) && entry.name !== ".env.example") {
    throw new Error(`Refusing to package ${entry.name}: it may contain secrets.`);
  }
});

await zip.finalize();

const size = statSync(outPath).size;
if (size < 1024 * 1024) {
  console.warn(`\nWarning: the package is only ${(size / 1024).toFixed(0)} KB, which looks too small.`);
}
