// Tests for deploy/content-sync.mjs. Run with: npm run test:content-sync
//
// The rule under test: a deploy may ADD page copy the new code needs, and must never change copy
// that is already on the server, because that copy may have been edited in the back office.

import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { syncContent } from "./content-sync.mjs";

function scratch() {
  const root = mkdtempSync(join(tmpdir(), "content-sync-test-"));
  const pkg = join(root, "package-pages");
  const server = join(root, "server-pages");
  mkdirSync(pkg);
  mkdirSync(server);
  return {
    pkg,
    server,
    put: (dir, name, data) => writeFileSync(join(dir, name), typeof data === "string" ? data : `${JSON.stringify(data, null, 2)}\n`),
    read: (name) => JSON.parse(readFileSync(join(server, name), "utf8")),
    raw: (name) => readFileSync(join(server, name), "utf8"),
    done: () => rmSync(root, { recursive: true, force: true }),
  };
}

test("should_add_a_page_the_new_code_needs_when_the_server_copy_lacks_it", () => {
  const t = scratch();
  try {
    t.put(t.server, "page-meta.json", { "/": { title: "Home" } });
    t.put(t.pkg, "page-meta.json", { "/": { title: "Home" }, "/dpa/": { title: "DPA" } });
    const report = syncContent(t.pkg, t.server);
    assert.deepEqual(t.read("page-meta.json"), { "/": { title: "Home" }, "/dpa/": { title: "DPA" } });
    assert.deepEqual(report.added, ["page-meta.json: /dpa/"]);
  } finally {
    t.done();
  }
});

test("should_keep_copy_edited_in_the_back_office_when_the_package_has_different_words", () => {
  const t = scratch();
  try {
    t.put(t.server, "page-meta.json", { "/": { title: "Edited on the server" } });
    t.put(t.pkg, "page-meta.json", { "/": { title: "Original from the repo" } });
    const report = syncContent(t.pkg, t.server);
    assert.equal(t.read("page-meta.json")["/"].title, "Edited on the server");
    assert.deepEqual(report.added, []);
  } finally {
    t.done();
  }
});

test("should_add_a_new_field_inside_an_existing_entry_without_touching_its_siblings", () => {
  const t = scratch();
  try {
    t.put(t.server, "use-cases.json", { clinics: { hero: "Edited hero", intro: "Edited intro" } });
    t.put(t.pkg, "use-cases.json", { clinics: { hero: "Repo hero", intro: "Repo intro", outro: "New outro" } });
    const report = syncContent(t.pkg, t.server);
    assert.deepEqual(t.read("use-cases.json"), { clinics: { hero: "Edited hero", intro: "Edited intro", outro: "New outro" } });
    assert.deepEqual(report.added, ["use-cases.json: clinics.outro"]);
  } finally {
    t.done();
  }
});

test("should_keep_the_server_list_whole_when_the_package_list_differs", () => {
  // Lists (FAQs) are edited as a whole; merging item by item would mix two versions.
  const t = scratch();
  try {
    t.put(t.server, "use-case-faqs.json", { clinics: [{ q: "Edited?", a: "Yes" }] });
    t.put(t.pkg, "use-case-faqs.json", { clinics: [{ q: "Repo?", a: "No" }, { q: "Second?", a: "Maybe" }] });
    syncContent(t.pkg, t.server);
    assert.deepEqual(t.read("use-case-faqs.json"), { clinics: [{ q: "Edited?", a: "Yes" }] });
  } finally {
    t.done();
  }
});

test("should_copy_a_whole_new_content_file_when_the_server_has_none", () => {
  const t = scratch();
  try {
    t.put(t.pkg, "security.json", { heading: "Security" });
    const report = syncContent(t.pkg, t.server);
    assert.deepEqual(t.read("security.json"), { heading: "Security" });
    assert.deepEqual(report.added, ["security.json (new file)"]);
  } finally {
    t.done();
  }
});

test("should_remove_a_page_entry_the_new_code_has_retired", () => {
  // Top-level keys are routes and slugs, owned by the code. A leftover "teams" made the site build
  // /compare/teams without the fields it needs, and the 2026-10-02 deploy failed on it.
  const t = scratch();
  try {
    t.put(t.server, "compare.json", { slack: { name: "Edited Slack" }, teams: { name: "Teams" } });
    t.put(t.pkg, "compare.json", { slack: { name: "Slack" } });
    const report = syncContent(t.pkg, t.server);
    assert.deepEqual(t.read("compare.json"), { slack: { name: "Edited Slack" } });
    assert.deepEqual(report.removed, ["compare.json: teams"]);
  } finally {
    t.done();
  }
});

test("should_keep_a_field_inside_an_entry_when_the_package_no_longer_has_it", () => {
  // Only whole entries are retired. A nested field is just words; an old one does no harm.
  const t = scratch();
  try {
    t.put(t.server, "use-cases.json", { clinics: { hero: "Edited", legacy: "Old field" } });
    t.put(t.pkg, "use-cases.json", { clinics: { hero: "Repo" } });
    const report = syncContent(t.pkg, t.server);
    assert.deepEqual(t.read("use-cases.json"), { clinics: { hero: "Edited", legacy: "Old field" } });
    assert.deepEqual(report.removed, []);
  } finally {
    t.done();
  }
});

test("should_not_remove_anything_when_the_package_file_is_empty", () => {
  // An empty or truncated file in a package must never wipe the server's copy.
  const t = scratch();
  try {
    t.put(t.server, "compare.json", { slack: { name: "Slack" } });
    t.put(t.pkg, "compare.json", {});
    const report = syncContent(t.pkg, t.server);
    assert.deepEqual(t.read("compare.json"), { slack: { name: "Slack" } });
    assert.deepEqual(report.removed, []);
  } finally {
    t.done();
  }
});

test("should_leave_a_server_file_alone_when_the_package_does_not_have_it", () => {
  const t = scratch();
  try {
    t.put(t.server, "legal.json", { privacy: { body: "Edited" } });
    const report = syncContent(t.pkg, t.server);
    assert.deepEqual(t.read("legal.json"), { privacy: { body: "Edited" } });
    assert.deepEqual(report, { added: [], removed: [], warnings: [] });
  } finally {
    t.done();
  }
});

test("should_keep_the_server_value_and_warn_when_the_package_changed_its_type", () => {
  const t = scratch();
  try {
    t.put(t.server, "legal.json", { privacy: "plain string" });
    t.put(t.pkg, "legal.json", { privacy: { body: "now an object" } });
    const report = syncContent(t.pkg, t.server);
    assert.equal(t.read("legal.json").privacy, "plain string");
    assert.deepEqual(report.added, []);
    assert.equal(report.warnings.length, 1);
    assert.match(report.warnings[0], /legal\.json: privacy/);
  } finally {
    t.done();
  }
});

test("should_refuse_and_leave_the_file_alone_when_the_server_copy_is_not_valid_json", () => {
  const t = scratch();
  try {
    t.put(t.server, "page-meta.json", "{ not json");
    t.put(t.pkg, "page-meta.json", { "/dpa/": { title: "DPA" } });
    assert.throws(() => syncContent(t.pkg, t.server), /page-meta\.json.*not valid JSON/);
    assert.equal(t.raw("page-meta.json"), "{ not json");
  } finally {
    t.done();
  }
});

test("should_change_nothing_and_not_rewrite_files_when_run_a_second_time", () => {
  const t = scratch();
  try {
    t.put(t.server, "page-meta.json", { "/": { title: "Home" } });
    t.put(t.pkg, "page-meta.json", { "/": { title: "Home" }, "/dpa/": { title: "DPA" } });
    syncContent(t.pkg, t.server);
    const before = statSync(join(t.server, "page-meta.json")).mtimeMs;
    const report = syncContent(t.pkg, t.server);
    assert.deepEqual(report.added, []);
    assert.equal(statSync(join(t.server, "page-meta.json")).mtimeMs, before);
  } finally {
    t.done();
  }
});

test("should_write_in_the_back_office_format_and_without_world_write_permission", () => {
  const t = scratch();
  try {
    t.put(t.server, "page-meta.json", { "/": { title: "Home" } });
    t.put(t.pkg, "page-meta.json", { "/": { title: "Home" }, "/dpa/": { title: "DPA" } });
    syncContent(t.pkg, t.server);
    assert.equal(t.raw("page-meta.json"), `${JSON.stringify({ "/": { title: "Home" }, "/dpa/": { title: "DPA" } }, null, 2)}\n`);
    if (process.platform !== "win32") {
      assert.equal(statSync(join(t.server, "page-meta.json")).mode & 0o022, 0);
    }
    assert.equal(existsSync(join(t.server, "page-meta.json.tmp")), false);
  } finally {
    t.done();
  }
});

test("should_do_nothing_when_the_package_has_no_content_files", () => {
  const t = scratch();
  try {
    t.put(t.server, "page-meta.json", { "/": { title: "Home" } });
    const report = syncContent(t.pkg, t.server);
    assert.deepEqual(report, { added: [], removed: [], warnings: [] });
  } finally {
    t.done();
  }
});
