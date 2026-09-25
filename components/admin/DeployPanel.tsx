"use client";

import { useActionState } from "react";
import { deployPackage, type DeployResult } from "@/lib/deploy/actions";
import type { DeployRecord } from "@/lib/deploy/types";
import { JobProgress, statusTone, useJobStatus } from "./JobStatus";

/**
 * Upload a package, hand it to the server, then watch it land. The watching lives in
 * useJobStatus, which a content rebuild uses too: both restart the app under the page that
 * started them, so neither can be told the outcome directly.
 */

const card = "rounded-3xl bg-surface p-7 shadow-subtle";

function when(iso: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

export function DeployPanel({ history }: { history: DeployRecord[] }) {
  const [result, action, pending] = useActionState<DeployResult, FormData>(deployPackage, { ok: false });
  const deployId = result.ok ? result.deployId : undefined;
  const state = useJobStatus(deployId);

  return (
    <div className="flex flex-col gap-5">
      <section className={card}>
        <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">Deploy</h2>
        <p className="mt-2 text-[15.5px] leading-[1.6] text-ink-muted">
          New code, not new posts. Build the package locally with <code className="text-ink">npm run publish:prepare</code>, then
          upload it here. The new version is built alongside the live one, so the site keeps serving throughout and is only
          swapped over, for a few seconds, once the build has succeeded. If the new version does not come up, the previous one is
          put back on its own.
        </p>

        <form action={action} className="mt-5 flex flex-wrap items-center gap-3">
          <input
            type="file"
            name="package"
            accept=".zip,application/zip"
            required
            className="max-w-full text-[14.5px] text-ink-muted file:mr-3 file:cursor-pointer file:rounded-xl file:border-0 file:bg-surface-tint file:px-4 file:py-2.5 file:text-[14.5px] file:font-semibold file:text-ink"
          />
          <button
            type="submit"
            disabled={pending}
            className="lift cursor-pointer rounded-[14px] bg-ink px-[22px] py-3 text-[15.5px] leading-[normal] font-semibold text-on-ink [--lift-y:-2px] disabled:cursor-default disabled:opacity-70"
          >
            {pending ? "Uploading" : "Upload and deploy"}
          </button>
        </form>

        {result.error && (
          <p role="alert" className="mt-4 rounded-xl bg-accent-wash px-4 py-3 text-[14.5px] text-ink">
            {result.error}
          </p>
        )}

        {deployId && (
          <div className="mt-5">
            <JobProgress jobId={deployId} state={state} idLabel="Deploy" />
          </div>
        )}
      </section>

      {history.length > 0 && (
        <section className={card}>
          <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">Recent deploys and rebuilds</h2>
          <ul className="mt-4 flex flex-col">
            {history.map((h) => (
              <li
                key={h.id}
                className="flex flex-wrap items-baseline justify-between gap-2 border-t border-border py-3 first:border-0 first:pt-0"
              >
                <span className="text-[15px] text-ink">{h.id}</span>
                <span className="text-[14px] text-ink-muted">{when(h.startedAt)}</span>
                <span className={`text-[14px] font-semibold ${statusTone(h.status)}`}>
                  {h.status}
                  {h.rolledBack ? ", rolled back" : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
