import "server-only";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { DEPLOY_LOG_DIR, STALE_AFTER_MS } from "@/lib/admin/config";
import { isValidDeployId, type DeployRecord, type DeployStatus } from "./types";

/**
 * Reads the status files deploy.sh leaves behind. The deploy restarts this app, so it can never
 * report back in band: the script writes JSON to disk and the panel polls this.
 */

const isStatus = (v: unknown): v is DeployStatus => v === "running" || v === "succeeded" || v === "failed" || v === "stale";

function parse(raw: string): DeployRecord | null {
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    // The script writes atomically, so this means a corrupt file rather than a half-written one.
    return null;
  }
  if (!data || typeof data !== "object") return null;
  const r = data as Record<string, unknown>;
  // The id has to be a real one: a stray .json in the log directory should not show up as a
  // blank row in the history.
  if (typeof r.id !== "string" || !isValidDeployId(r.id) || !isStatus(r.status)) return null;

  const record: DeployRecord = {
    id: r.id,
    status: r.status,
    step: typeof r.step === "string" ? r.step : "unknown",
    message: typeof r.message === "string" ? r.message : "",
    startedAt: typeof r.startedAt === "string" ? r.startedAt : "",
    updatedAt: typeof r.updatedAt === "string" ? r.updatedAt : "",
    exitCode: typeof r.exitCode === "number" ? r.exitCode : 0,
    rolledBack: r.rolledBack === true,
  };

  // A deploy that has reported nothing for a long time was hard-killed: no verdict is coming, and
  // the panel must be told that rather than left polling "running" for ever.
  if (record.status === "running") {
    const last = Date.parse(record.updatedAt || record.startedAt);
    if (Number.isFinite(last) && Date.now() - last > STALE_AFTER_MS) {
      return { ...record, status: "stale", message: "The deploy stopped reporting. Check the server." };
    }
  }
  return record;
}

export async function getDeployRecord(id: string): Promise<DeployRecord | null> {
  if (!isValidDeployId(id)) return null;
  try {
    return parse(await readFile(path.join(DEPLOY_LOG_DIR, `${id}.json`), "utf8"));
  } catch {
    return null;
  }
}

/** The most recently updated deploy, for a panel that has lost track of its own id. */
export async function getLatestDeployRecord(): Promise<DeployRecord | null> {
  let files: string[];
  try {
    files = (await readdir(DEPLOY_LOG_DIR)).filter((f) => f.endsWith(".json"));
  } catch {
    return null;
  }
  const stamped = await Promise.all(
    files.map(async (f) => {
      try {
        return { f, at: (await stat(path.join(DEPLOY_LOG_DIR, f))).mtimeMs };
      } catch {
        return { f, at: 0 };
      }
    }),
  );
  const newest = stamped.sort((a, b) => b.at - a.at)[0];
  if (!newest) return null;
  try {
    return parse(await readFile(path.join(DEPLOY_LOG_DIR, newest.f), "utf8"));
  } catch {
    return null;
  }
}

/** The last few deploys, newest first, for the history list. */
export async function listDeployRecords(limit = 8): Promise<DeployRecord[]> {
  let files: string[];
  try {
    files = (await readdir(DEPLOY_LOG_DIR)).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
  const records = await Promise.all(
    files.map(async (f) => {
      try {
        return parse(await readFile(path.join(DEPLOY_LOG_DIR, f), "utf8"));
      } catch {
        return null;
      }
    }),
  );
  return records
    .filter((r): r is DeployRecord => r !== null)
    .sort((a, b) => (b.startedAt || "").localeCompare(a.startedAt || ""))
    .slice(0, limit);
}
