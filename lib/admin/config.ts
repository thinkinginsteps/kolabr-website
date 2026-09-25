import "server-only";
import path from "node:path";

/**
 * Where the back office reads and writes. Everything it owns lives outside the app directory,
 * because a deploy wipes and replaces that directory: state written inside it would not survive
 * the deploy that produced it. The paths are absolute and come from the environment rather than
 * symlinks, since Turbopack refuses to build a project whose symlink leaves the project root.
 *
 * The defaults are the local ones, so `npm run dev` works with no environment set.
 */

const local = (...parts: string[]) => path.join(process.cwd(), ...parts);

/** Sessions, and later the contact form's own record of what it received. */
export const STATE_DIR = process.env.STATE_DIR ?? local(".local-state");

/** Blog posts, and later the editable page copy. Read at build time, written by the back office. */
export const CONTENT_DIR = process.env.CONTENT_DIR ?? local("content");

/** Uploaded deployment packages. The deploy script reads them from here as root. */
export const UPLOAD_DIR = process.env.UPLOAD_DIR ?? local(".local-state", "uploads");

/** The root-owned script that actually performs a deploy. */
export const DEPLOY_SCRIPT = process.env.DEPLOY_SCRIPT ?? "/opt/kolabr/deploy.sh";

/** The script that rebuilds the site after a content change, so posts go live. */
export const REBUILD_SCRIPT = process.env.REBUILD_SCRIPT ?? "/opt/kolabr/rebuild.sh";

/** Where those scripts write their log and status files. Outside the app for the same reason. */
export const DEPLOY_LOG_DIR = process.env.DEPLOY_LOG_DIR ?? "/opt/kolabr/deploy-logs";

/** A package is ~15MB today; the ceiling is for a mistake, not a limit to work to. */
export const MAX_UPLOAD_BYTES = 200 * 1024 * 1024;

/**
 * A deploy that has said nothing for this long is stalled, not running: deploy.sh writes a
 * terminal status on every exit path it can see, so silence means it was hard-killed and no
 * verdict is coming. Without this the panel would poll "running" forever.
 */
export const STALE_AFTER_MS = 25 * 60 * 1000;

/** The single admin account. Both must be set for the back office to let anyone in. */
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "";
export const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH ?? "";
