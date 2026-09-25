"use client";

import { useState, useTransition } from "react";
import { publishContent } from "@/lib/admin/posts-actions";
import { JobProgress, useJobStatus } from "./JobStatus";

/**
 * "Publish changes": rebuilds the site so saved posts appear on it. Every page here is generated
 * at build time, so saving a post changes the file and nothing else until this runs.
 */
export function PublishBar({ behind }: { behind: boolean }) {
  const [jobId, setJobId] = useState<string | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const state = useJobStatus(jobId);

  const publish = () =>
    start(async () => {
      setError(null);
      const result = await publishContent();
      if (result.ok) setJobId(result.jobId);
      else setError(result.error ?? "The rebuild could not be started.");
    });

  return (
    <section className="flex flex-col gap-4 rounded-3xl bg-surface p-7 shadow-subtle">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">Publish</h2>
          <p className="text-[15px] text-ink-muted">
            {behind
              ? "Saved changes are not on the site yet. Publishing rebuilds it, which takes about a minute."
              : "The site matches what is saved here."}
          </p>
        </div>
        <button
          type="button"
          onClick={publish}
          disabled={pending || (state.record !== null && state.record.status === "running")}
          className={`lift cursor-pointer rounded-[14px] px-[22px] py-3 text-[15.5px] leading-[normal] font-semibold [--lift-y:-2px] disabled:cursor-default disabled:opacity-70 ${
            behind ? "bg-ink text-on-ink" : "border border-border bg-surface text-ink"
          }`}
        >
          {pending ? "Starting" : "Publish changes"}
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-accent-wash px-4 py-3 text-[14.5px] text-ink">
          {error}
        </p>
      )}
      {jobId && <JobProgress jobId={jobId} state={state} idLabel="Rebuild" />}
    </section>
  );
}
