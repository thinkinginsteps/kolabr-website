import "server-only";
import { readFile, stat, statfs } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { SERVER_PREFIX } from "@/lib/admin/config";

/**
 * What the back office can see of the server without being able to touch it.
 *
 * Everything here is read from the filesystem: the app has no sudo and cannot ask systemd
 * anything. It does not need to for the important question, because the app IS the site: if this
 * page renders, the service is up, and how long this process has been alive is how long it has
 * been up.
 *
 * Nothing here throws. A missing file means "not set up yet", which is a normal answer during
 * local development and should never break the page.
 */

export type ServerHealth = {
  /** Seconds this Node process has been running: the site's uptime. */
  upSeconds: number;
  /** Free space on the volume the site lives on. null when the prefix does not exist (local). */
  diskFreeMb: number | null;
  diskTotalMb: number | null;
  memFreeMb: number;
  memTotalMb: number;
  /** One-minute load average, against the number of cores. */
  load1: number;
  cores: number;
  /** True when a previous build is sitting ready for an instant rollback. */
  rollbackReady: boolean;
  /** When the live build was put in place. */
  liveSince: string | null;
  watchdog: WatchdogState | null;
};

export type WatchdogState = {
  checkedAt: string;
  action: "none" | "started" | "alert";
  detail: string;
  /** The timer runs every minute. Older than five means the timer is not running. */
  stale: boolean;
};

const MB = 1024 * 1024;

async function readWatchdog(): Promise<WatchdogState | null> {
  try {
    const raw = await readFile(path.join(SERVER_PREFIX, "deploy-logs", "watchdog.json"), "utf8");
    const data: unknown = JSON.parse(raw);
    if (!data || typeof data !== "object") return null;
    const r = data as Record<string, unknown>;
    const checkedAt = typeof r.checkedAt === "string" ? r.checkedAt : "";
    const action = r.action === "started" || r.action === "alert" ? r.action : "none";
    const at = Date.parse(checkedAt);
    return {
      checkedAt,
      action,
      detail: typeof r.detail === "string" ? r.detail : "",
      stale: !Number.isFinite(at) || Date.now() - at > 5 * 60 * 1000,
    };
  } catch {
    return null;
  }
}

export async function getServerHealth(): Promise<ServerHealth> {
  const [disk, previous, live, watchdog] = await Promise.all([
    statfs(SERVER_PREFIX).catch(() => null),
    stat(path.join(SERVER_PREFIX, "app.previous"))
      .then((s) => s.isDirectory())
      .catch(() => false),
    stat(path.join(SERVER_PREFIX, "app"))
      .then((s) => s.mtime.toISOString())
      .catch(() => null),
    readWatchdog(),
  ]);

  return {
    upSeconds: Math.round(process.uptime()),
    diskFreeMb: disk ? Math.round((disk.bsize * disk.bavail) / MB) : null,
    diskTotalMb: disk ? Math.round((disk.bsize * disk.blocks) / MB) : null,
    memFreeMb: Math.round(os.freemem() / MB),
    memTotalMb: Math.round(os.totalmem() / MB),
    load1: Math.round(os.loadavg()[0] * 100) / 100,
    cores: os.cpus().length || 1,
    rollbackReady: previous,
    liveSince: live,
    watchdog,
  };
}
