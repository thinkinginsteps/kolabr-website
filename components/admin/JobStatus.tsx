"use client";

import { useEffect, useRef, useState } from "react";
import { isTerminal, STEP_LABELS, type DeployRecord } from "@/lib/deploy/types";

/**
 * Watches a deploy or a rebuild. Both restart the app, so this component is talking to a server
 * that disappears halfway through: a failed request means "restarting", not "failed". A 404 is
 * the opposite signal, because the app answered; after a few of those we stop trusting the id we
 * were given and ask for the latest job instead.
 */

const POLL_MS = 3000;
const MAX_POLL_MS = 30 * 60 * 1000;
const UNKNOWN_ID_LIMIT = 4;

export type JobState = { record: DeployRecord | null; restarting: boolean; gaveUp: boolean };

export function useJobStatus(jobId: string | undefined): JobState {
  const [record, setRecord] = useState<DeployRecord | null>(null);
  const [restarting, setRestarting] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const watching = useRef<string | null>(null);

  useEffect(() => {
    if (!jobId || watching.current === jobId) return;
    watching.current = jobId;
    setRecord(null);
    setGaveUp(false);

    let cancelled = false;
    const startedAt = Date.now();
    let unknownIdCount = 0;

    const poll = async () => {
      while (!cancelled) {
        if (Date.now() - startedAt > MAX_POLL_MS) {
          if (!cancelled) setGaveUp(true);
          return;
        }
        try {
          const byLatest = unknownIdCount >= UNKNOWN_ID_LIMIT;
          const url = byLatest ? "/api/admin/deploy/status/" : `/api/admin/deploy/status/?id=${encodeURIComponent(jobId)}`;
          const res = await fetch(url, { cache: "no-store" });
          if (res.status === 404) {
            unknownIdCount += 1;
            if (!cancelled) setRestarting(false);
          } else if (res.ok) {
            const next = (await res.json()) as DeployRecord;
            if (cancelled) return;
            setRestarting(false);
            setRecord(next);
            if (isTerminal(next.status)) return;
          }
        } catch {
          if (!cancelled) setRestarting(true);
        }
        await new Promise((r) => setTimeout(r, POLL_MS));
      }
    };
    void poll();
    return () => {
      cancelled = true;
    };
  }, [jobId]);

  return { record, restarting, gaveUp };
}

export function statusTone(status: DeployRecord["status"]) {
  if (status === "succeeded") return "text-status-ok";
  if (status === "failed" || status === "stale") return "text-status-breached";
  return "text-ink";
}

/** The shared progress block: which step, what it said, and whether it rolled back. */
export function JobProgress({ jobId, state, idLabel }: { jobId: string; state: JobState; idLabel: string }) {
  const { record, restarting, gaveUp } = state;
  const step = record ? (STEP_LABELS[record.step] ?? record.step) : null;

  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-surface-tint p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-[12px] font-semibold tracking-[0.08em] text-ink-muted uppercase">
          {idLabel} {jobId}
        </span>
        {record && <span className={`text-[14px] font-semibold ${statusTone(record.status)}`}>{record.status}</span>}
      </div>
      <p className="text-[15.5px] text-ink">
        {gaveUp
          ? "Still nothing after thirty minutes. Check the server."
          : restarting
            ? "The site is restarting, so it cannot answer yet. Still watching."
            : (step ?? "Starting")}
      </p>
      {record?.message && <p className="text-[14.5px] text-ink-muted">{record.message}</p>}
      {record?.rolledBack && (
        <p className="text-[14.5px] font-semibold text-status-breached">Rolled back: the previous build is live again.</p>
      )}
      {record?.status === "succeeded" && (
        <p className="text-[14.5px] text-ink-muted">
          Live now.{" "}
          <a href="/blog/" target="_blank" rel="noreferrer" className="border-b-2 border-accent pb-px font-semibold text-ink">
            Open the site
          </a>
        </p>
      )}
    </div>
  );
}
