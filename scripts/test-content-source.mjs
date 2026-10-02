// Proves where the build takes its words from. Run with: npm run test:content-source (a full build).
//
//   Page text  (content/pages/*.json)  -> always the code's own copy, never CONTENT_DIR.
//   Blog posts (content/blog/*.md)     -> CONTENT_DIR, the server's directory the back office writes.
//
// It builds with CONTENT_DIR pointing at a scratch directory that holds DECOY page text (different
// words, plus an entry the code does not know) and one extra blog post, then checks the pages show
// the repo's words and the blog shows the scratch post.
//
// Why: until 2026-10-02 page text was read from the server's content directory, which deploys never
// overwrote, so 246 text changes made in the repo were deployed and never appeared on the site.

import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = process.cwd();
const scratch = mkdtempSync(join(tmpdir(), "kolabr-content-source-"));
const content = join(scratch, "content");
// A build directory tsconfig.json already lists (rebuild.sh uses it on the server): Next adds every
// new one it sees to tsconfig.json's includes, which would leave a test's footprint in the repo.
const distDir = ".next-build";
const DECOY = "DECOY server text that must never be published";
const POST = "server-only-test-post";
const fail = [];

const repoMeta = JSON.parse(readFileSync(join(root, "content", "pages", "page-meta.json"), "utf8"));
const repoTitle = repoMeta["/pricing/"].title;

try {
  cpSync(join(root, "content"), content, { recursive: true });

  // Decoy page text: every title replaced, and an entry the code has never heard of.
  const metaFile = join(content, "pages", "page-meta.json");
  const decoy = JSON.parse(readFileSync(metaFile, "utf8"));
  for (const entry of Object.values(decoy)) entry.title = DECOY;
  decoy["/compare/retired-tool/"] = { title: DECOY, description: DECOY, name: DECOY };
  writeFileSync(metaFile, `${JSON.stringify(decoy, null, 2)}\n`);

  // A post that exists only in the server's directory, as one written in the back office would.
  writeFileSync(
    join(content, "blog", `${POST}.md`),
    [
      "---",
      'title: "A post written in the back office"',
      'description: "Only in CONTENT_DIR, so it proves the blog is read from the server directory and not from the code."',
      'excerpt: "Only in CONTENT_DIR."',
      'date: "2026-10-02"',
      'topic: "Client work"',
      "---",
      "",
      "Written in the back office.",
      "",
    ].join("\n"),
  );

  try {
    execFileSync(process.platform === "win32" ? "npx.cmd" : "npx", ["next", "build"], {
      cwd: root,
      env: { ...process.env, CONTENT_DIR: content, NEXT_DIST_DIR: distDir },
      stdio: ["ignore", "pipe", "pipe"],
      encoding: "utf8",
      shell: process.platform === "win32",
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch (err) {
    const out = `${err.stdout ?? ""}${err.stderr ?? ""}`;
    fail.push(`the build failed:\n${out.split("\n").filter((l) => /Error|error/.test(l)).slice(0, 8).join("\n")}`);
  }

  if (fail.length === 0) {
    const app = join(root, distDir, "server", "app");
    const pricing = readFileSync(join(app, "pricing.html"), "utf8");
    if (pricing.includes(DECOY)) fail.push("a page shows page text from CONTENT_DIR instead of the code");
    if (!pricing.includes(repoTitle.replace(/&/g, "&amp;"))) fail.push("the pricing page does not show the repo's title");
    if (existsSync(join(app, "compare", "retired-tool.html"))) fail.push("an entry only in CONTENT_DIR became a page");
    if (!existsSync(join(app, "blog", `${POST}.html`))) fail.push("the blog post from CONTENT_DIR was not built");
  }
} finally {
  rmSync(scratch, { recursive: true, force: true });
  rmSync(join(root, distDir), { recursive: true, force: true });
}

if (fail.length) {
  console.error(`content source: FAIL\n- ${fail.join("\n- ")}`);
  process.exit(1);
}
console.log("content source: ok (page text from the code, blog posts from CONTENT_DIR)");
