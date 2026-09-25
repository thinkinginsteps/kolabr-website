import type { ServerHealth as Health } from "@/lib/deploy/health";

/**
 * The state of the machine, in the words someone would use to decide whether to deploy right now.
 * Numbers only where a number is the answer; otherwise a sentence.
 */

function duration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 48) return `${h}h ${m % 60}m`;
  return `${Math.floor(h / 24)} days`;
}

function when(iso: string | null) {
  if (!iso) return "unknown";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "unknown" : d.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

function Item({ label, value, note, warn }: { label: string; value: string; note?: string; warn?: boolean }) {
  return (
    <div className="flex flex-col gap-1 border-t border-border py-3.5 first:border-0 first:pt-0">
      <span className="text-[12.5px] font-semibold tracking-[0.04em] text-ink-muted uppercase">{label}</span>
      <span className={`text-[16px] font-semibold ${warn ? "text-status-breached" : "text-ink"}`}>{value}</span>
      {note && <span className="text-[14px] leading-[1.5] text-ink-muted">{note}</span>}
    </div>
  );
}

export function ServerHealth({ health }: { health: Health }) {
  const {
    upSeconds,
    diskFreeMb,
    diskTotalMb,
    memFreeMb,
    memTotalMb,
    load1,
    cores,
    rollbackReady,
    liveSince,
    watchdog,
  } = health;

  // A deploy needs about 1.2GB for node_modules and the build, and refuses to start under 3GB.
  const diskLow = diskFreeMb !== null && diskFreeMb < 3000;
  const gb = (mb: number) => `${(mb / 1024).toFixed(1)}GB`;

  return (
    <section className="rounded-3xl bg-surface p-7 shadow-subtle">
      <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">The server</h2>
      <p className="mt-2 text-[15.5px] leading-[1.6] text-ink-muted">
        You are reading this from the site itself, so the site is up. The rest is what a deploy would find if you started one now.
      </p>

      <div className="mt-5 grid gap-x-8 sm:grid-cols-2">
        <Item
          label="Site up for"
          value={duration(upSeconds)}
          note={liveSince ? `Live build in place since ${when(liveSince)}` : undefined}
        />

        <Item
          label="Disk"
          value={diskFreeMb === null ? "not on this machine" : `${gb(diskFreeMb)} free`}
          note={
            diskFreeMb === null
              ? "Local development: there is no server prefix here."
              : diskLow
                ? `Of ${gb(diskTotalMb ?? 0)}. A deploy needs 3GB free and will refuse to start below that.`
                : `Of ${gb(diskTotalMb ?? 0)}. Enough for a deploy.`
          }
          warn={diskLow}
        />

        <Item
          label="Memory and load"
          value={`${gb(memFreeMb)} free, load ${load1}`}
          note={`Of ${gb(memTotalMb)} across ${cores} core${cores === 1 ? "" : "s"}. A build is capped at 70% CPU and 3GB so the other sites on this machine keep running.`}
        />

        <Item
          label="Rollback"
          value={rollbackReady ? "one click away" : "not available"}
          note={
            rollbackReady
              ? "The previous build is still on disk, so a failed deploy swaps back in seconds."
              : "No previous build yet. The next deploy will leave one behind."
          }
        />
      </div>

      <div className="mt-2">
        {watchdog === null ? (
          <Item
            label="Watchdog"
            value="no reports"
            note="Nothing has been written yet. On the server this means the timer is not installed; locally it is normal."
          />
        ) : (
          <Item
            label="Watchdog"
            value={
              watchdog.stale
                ? "not reporting"
                : watchdog.action === "alert"
                  ? "needs a person"
                  : watchdog.action === "started"
                    ? "put the site back up"
                    : "all quiet"
            }
            note={
              watchdog.stale
                ? `Last check ${when(watchdog.checkedAt)}. It should run every minute: check kolabr-watchdog.timer.`
                : `Checked ${when(watchdog.checkedAt)}. ${watchdog.detail || "Nothing to do."}`
            }
            warn={watchdog.stale || watchdog.action === "alert"}
          />
        )}
      </div>
    </section>
  );
}
