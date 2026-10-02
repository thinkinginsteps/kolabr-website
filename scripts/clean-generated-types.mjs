// Deletes the TypeScript files Next generates for routes, before `next typegen` writes them fresh.
// Runs first in `npm run verify:package` (and so `publish:prepare`).
//
// Why: tsconfig.json includes every folder Next generates route types into, and `next typegen` only
// rewrites .next/types. .next/dev/types (written by `npm run dev`) and .next-build/**/types (written
// by a rebuild build) are left as they were, so once a route is deleted their validator.ts still
// imports the old page and `tsc --noEmit` fails on a route that no longer exists. That happened
// when the back office Copy section was removed (2026-10-02): a real-looking failure that wasn't.
//
// Only the `types` folders go. The rest of .next/dev is a running dev server's output, and deleting
// it from under `next dev` would break that server.

import { rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const generated = [
  ".next/types",
  ".next/dev/types",
  ".next-build/types",
  ".next-build/dev/types",
];

for (const dir of generated) {
  // force: a folder that does not exist (a fresh clone, no dev server ever run) is not an error.
  rmSync(join(root, dir), { recursive: true, force: true });
}
console.log(`cleared generated route types: ${generated.join(", ")}`);
