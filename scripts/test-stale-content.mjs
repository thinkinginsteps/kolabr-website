// Builds the site against content that still holds entries the code has removed, and checks the
// build neither fails nor publishes them. Run with: npm run test:stale-content (a full build).
//
// Why: the server's content outlives the code. Deploys never delete copy (deploy/content-sync.mjs
// only adds), so when a page is retired in code its words stay on the server. On 2026-10-02 a
// leftover "teams" entry in compare.json made the build prerender /compare/teams, which no longer
// had the fields the page needs, and the deploy failed. Routes must come from the code's lists
// (COMPARE_SLUGS, USE_CASE_SLUGS, META_ROUTES), never from the keys of a content file.

import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const root = process.cwd();
const scratch = mkdtempSync(join(tmpdir(), "kolabr-stale-content-"));
const content = join(scratch, "content");
const distDir = ".next-stale-test";
const fail = [];

try {
  cpSync(join(root, "content"), content, { recursive: true });
  const edit = (name, change) => {
    const file = join(content, "pages", `${name}.json`);
    const data = JSON.parse(readFileSync(file, "utf8"));
    change(data);
    writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  };
  // Leftovers shaped like old copy: present on the server, unknown to the code, missing new fields.
  edit("compare", (d) => { d["retired-tool"] = { name: "Retired tool" }; });
  edit("use-cases", (d) => { d["retired-industry"] = { hero: { title: "Retired" } }; });
  edit("page-meta", (d) => {
    d["/compare/retired-tool/"] = { title: "Retired", description: "Retired", name: "Retired" };
  });

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
    fail.push(`the build failed on stale content:\n${out.split("\n").filter((l) => /Error|error|retired/i.test(l)).slice(0, 8).join("\n")}`);
  }

  if (fail.length === 0) {
    const app = join(root, distDir, "server", "app");
    for (const page of ["compare/retired-tool.html", "use-cases/retired-industry.html"]) {
      if (existsSync(join(app, page))) fail.push(`a retired page was generated: ${page}`);
    }
    const sitemap = join(app, "sitemap.xml.body");
    if (existsSync(sitemap) && readFileSync(sitemap, "utf8").includes("retired-tool")) {
      fail.push("the sitemap lists a retired page");
    }
  }
} finally {
  rmSync(scratch, { recursive: true, force: true });
  rmSync(join(root, distDir), { recursive: true, force: true });
}

if (fail.length) {
  console.error(`stale content: FAIL\n- ${fail.join("\n- ")}`);
  process.exit(1);
}
console.log("stale content: ok (build passes; retired entries are not published)");
