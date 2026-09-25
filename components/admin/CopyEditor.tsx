"use client";

import { useActionState, useState } from "react";
import { saveCopy, type CopySaveState } from "@/lib/admin/copy-actions";
import type { CopyField } from "@/lib/admin/copy";

/**
 * Every editable string in one section of a page, as a labelled box. The label is the path in
 * words ("hero › title"), which is enough to find anything without inventing a name for each of
 * several thousand fields.
 *
 * The field name carries the path, so the server patches exactly the string that was edited.
 */

const BOX =
  "w-full rounded-[12px] border border-border bg-surface px-[13px] py-[9px] text-[15px] leading-[1.55] tracking-normal text-ink transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-ring)] focus:outline-none";

export function CopyEditor({ file, section, fields }: { file: string; section: string; fields: CopyField[] }) {
  const [state, action, pending] = useActionState<CopySaveState, FormData>(saveCopy, {});
  const [filter, setFilter] = useState("");
  const [dirty, setDirty] = useState(false);

  const needle = filter.trim().toLowerCase();
  const shown = needle
    ? fields.filter((f) => f.value.toLowerCase().includes(needle) || f.label.toLowerCase().includes(needle))
    : fields;

  return (
    <form
      action={action}
      onChange={() => setDirty(true)}
      onSubmit={() => setDirty(false)}
      className="flex flex-col gap-5"
    >
      <input type="hidden" name="file" value={file} />

      <section className="flex flex-col gap-4 rounded-3xl bg-surface p-7 shadow-subtle">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-[17.5px] font-semibold tracking-[-0.015em] text-ink">
            {section} <span className="font-normal text-ink-muted">· {fields.length} pieces of text</span>
          </h3>
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Find text"
            className="w-[220px] rounded-xl border border-border bg-surface px-3.5 py-2 text-[14.5px] text-ink focus:border-accent focus:outline-none"
          />
        </div>

        {shown.length === 0 && <p className="text-[15px] text-ink-muted">Nothing matches that.</p>}

        {shown.map((f) => (
          <label key={f.path} className="flex flex-col gap-1.5">
            <span className="text-[12.5px] font-semibold tracking-[0.04em] text-ink-muted uppercase">{f.label}</span>
            {f.multiline ? (
              <textarea name={`f:${f.path}`} defaultValue={f.value} rows={Math.min(8, Math.ceil(f.value.length / 90) + 1)} className={`${BOX} resize-y`} />
            ) : (
              <input type="text" name={`f:${f.path}`} defaultValue={f.value} className={BOX} />
            )}
          </label>
        ))}
      </section>

      {state.error && (
        <p role="alert" className="rounded-xl bg-accent-wash px-4 py-3 text-[14.5px] text-ink">
          {state.error}
        </p>
      )}

      <div className="sticky bottom-4 flex flex-wrap items-center gap-3 rounded-2xl bg-surface p-4 shadow-card">
        <button
          type="submit"
          disabled={pending}
          className="lift cursor-pointer rounded-[14px] bg-ink px-[22px] py-3 text-[15.5px] leading-[normal] font-semibold text-on-ink [--lift-y:-2px] disabled:cursor-default disabled:opacity-70"
        >
          {pending ? "Saving" : "Save changes"}
        </button>
        {!dirty && state.saved !== undefined && (
          <span className="text-[14.5px] text-ink-muted">
            {state.saved === 0
              ? "Nothing had changed."
              : `Saved ${state.saved} change${state.saved === 1 ? "" : "s"}. Publish to put them on the site.`}
          </span>
        )}
        {/* The filter hides fields, and a hidden field is not submitted, so say so plainly. */}
        {needle && <span className="text-[14px] text-ink-muted">Only the fields shown are saved while a filter is on.</span>}
      </div>
    </form>
  );
}
