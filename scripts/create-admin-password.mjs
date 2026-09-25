// Prints the ADMIN_PASSWORD_HASH line for /opt/kolabr/.env.production.
//
//   npm run admin:password -- 'the password'
//
// Through npm, because this imports lib/admin/password.ts directly: the script adds
// --experimental-strip-types, which Node 22 before 22.18 needs to load a .ts file.
//
// The password is an argument rather than a prompt so it can be piped; clear your shell history
// afterwards, or pass it on stdin: echo -n 'pw' | npm run -s admin:password -- -

import { readFileSync } from "node:fs";
import { hashPassword } from "../lib/admin/password.ts";

let password = process.argv[2];
if (password === "-") password = readFileSync(0, "utf8").replace(/\n$/, "");

if (!password) {
  console.error("usage: npm run admin:password -- 'password'   (or - to read stdin)");
  process.exit(2);
}
if (password.length < 12) {
  console.error("Use at least 12 characters: this is the only lock on the back office.");
  process.exit(1);
}

console.log(`ADMIN_PASSWORD_HASH=${await hashPassword(password)}`);
