"use server";

import { execFile } from "node:child_process";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { randomUUID } from "node:crypto";
import { DEPLOY_SCRIPT, MAX_UPLOAD_BYTES, UPLOAD_DIR } from "@/lib/admin/config";
import { requireAdmin } from "@/lib/admin/guards";
import { isValidDeployId, newDeployId } from "./types";

/**
 * Starts a deploy from an uploaded package.
 *
 * This action CANNOT wait for the deploy to finish and must not try. The deploy stops and starts
 * the very service running this code, so the process awaiting it is killed partway through by
 * design. It hands the package to the script, which re-execs itself into a transient systemd
 * unit, and returns the deploy id immediately; the panel then polls for the outcome.
 */

const execFileAsync = promisify(execFile);

// The script is root-owned and manages the service, so it runs under sudo. Set DEPLOY_SUDO=0 to
// call it directly: that is for exercising the pipeline locally against a stub, never on the
// server, where the app user must not be able to do any of this without sudo.
const USE_SUDO = process.env.DEPLOY_SUDO !== "0";

export type DeployResult = {
  ok: boolean;
  /** Present when the deploy was handed off. Poll the status endpoint with it. */
  deployId?: string;
  error?: string;
  /** What the launch printed. Never the deploy's own output, which only reaches the log file. */
  output?: string;
};

// The script forks a transient unit and returns in well under a second. Anything slower is
// systemd-run misbehaving, not a slow deploy.
const LAUNCH_TIMEOUT_MS = 60_000;

export async function deployPackage(_prev: DeployResult, formData: FormData): Promise<DeployResult> {
  await requireAdmin();

  const file = formData.get("package");
  if (!(file instanceof File)) return { ok: false, error: "Choose a deployment package first." };
  if (file.size <= 0) return { ok: false, error: "That package is empty." };
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, error: "That package is too large (200MB maximum)." };
  if (path.extname(file.name).toLowerCase() !== ".zip") return { ok: false, error: "Only .zip packages can be deployed." };

  const requestedId = newDeployId();
  // Not /tmp: the service may run with a private /tmp, and the root deploy script would then not
  // see the file this process just wrote.
  const target = path.join(UPLOAD_DIR, `kolabr-${requestedId}-${randomUUID()}.zip`);

  let written = false;
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(target, new Uint8Array(await file.arrayBuffer()), { mode: 0o640 });
    written = true;

    // sudo, because the script is root-owned and manages the service. Everything it needs is a
    // FLAG, never an environment variable: sudoers sets `Defaults env_reset`, so an env var set
    // here is stripped before the script sees it, and the script would invent its own id while
    // this page polled for one that never appears.
    //
    // --owns-package lets the script delete the upload once the deploy succeeds. It cannot be
    // cleaned up here: this process will not be alive to do it, and a failed deploy is far
    // easier to diagnose with the package still on disk.
    const args = [DEPLOY_SCRIPT, target, "--deploy-id", requestedId, "--owns-package"];
    const { stdout, stderr } = await execFileAsync(
      USE_SUDO ? "sudo" : args[0],
      USE_SUDO ? args : args.slice(1),
      { timeout: LAUNCH_TIMEOUT_MS, maxBuffer: 1024 * 1024 },
    );
    const output = `${stdout}${stderr ? `\n${stderr}` : ""}`.trim();

    // The script echoes back the id it adopted. Trust that over the one we asked for, so an older
    // script that generates its own still leaves the panel polling the right file.
    const echoed = /deploy-id:\s*([A-Za-z0-9._-]{1,64})/.exec(output)?.[1];
    const deployId = echoed && isValidDeployId(echoed) ? echoed : requestedId;

    return { ok: true, deployId, output };
  } catch (e) {
    // The launch failed, so the deploy never started and nothing will clean the upload up.
    if (written) await unlink(target).catch(() => {});
    const message = e instanceof Error ? e.message : String(e);
    console.error("[deploy] could not start the deploy:", message);
    return { ok: false, error: `Could not start the deploy: ${message}` };
  }
}
