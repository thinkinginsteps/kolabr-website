"use client";

import Link from "next/link";
import { useActionState, useState, useTransition } from "react";
import { deletePostAction, previewPost, savePost, type PostFormState } from "@/lib/admin/posts-actions";
import type { PostSource } from "@/lib/admin/posts";

/**
 * The post editor. Saving writes the Markdown file; it does not touch the live site, which is
 * rebuilt by "Publish changes" on the Blog page. The two are kept separate on purpose: writing
 * should be quick and safe, publishing is the deliberate act.
 */

const FIELD =
  "w-full rounded-[13px] border border-border bg-surface px-[15px] py-[11px] text-[15.5px] leading-[normal] tracking-normal text-ink transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-ring)] focus:outline-none";
const LABEL = "text-[13.5px] font-semibold tracking-[-0.01em] text-ink";

/** The site's own rules. Shown as guidance: a counter teaches, a blocked save annoys. */
function Counter({ value, min, max }: { value: string; min: number; max: number }) {
  const n = value.trim().length;
  const ok = n >= min && n <= max;
  return (
    <span className={`text-[12.5px] ${ok ? "text-ink-muted" : "text-status-risk"}`}>
      {n} characters, aim for {min} to {max}
    </span>
  );
}

function Field({
  name,
  label,
  defaultValue,
  error,
  hint,
  onChange,
  type = "text",
}: {
  name: string;
  label: string;
  defaultValue?: string;
  error?: string;
  hint?: React.ReactNode;
  onChange?: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className={LABEL}>{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        aria-invalid={error ? true : undefined}
        className={`${FIELD} ${error ? "border-status-breached" : ""}`}
      />
      {hint}
      {error && <span className="text-[12.5px] font-semibold text-status-breached">{error}</span>}
    </label>
  );
}

export function PostEditor({ post, isNew = false }: { post: PostSource; isNew?: boolean }) {
  const [state, action, pending] = useActionState<PostFormState, FormData>(savePost, {});
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [body, setBody] = useState(post.body);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewing, startPreview] = useTransition();
  const errors = state.fieldErrors ?? {};

  // "Saved" shows after a save and disappears as soon as anything is typed again. Typing sets the
  // flag, submitting clears it; no effect, and no comparing action results, which loops because
  // useActionState hands back a fresh object on every render.
  const [dirty, setDirty] = useState(false);
  const showSaved = Boolean(state.saved) && !dirty;

  const togglePreview = () => {
    if (preview !== null) {
      setPreview(null);
      return;
    }
    startPreview(async () => setPreview(await previewPost(body)));
  };

  return (
    <div className="flex flex-col gap-5">
      <form
        action={action}
        onChange={() => setDirty(true)}
        onSubmit={() => setDirty(false)}
        className="flex flex-col gap-5"
      >
        <input type="hidden" name="slug" value={isNew ? "" : post.slug} />

        <section className="flex flex-col gap-4 rounded-3xl bg-surface p-7 shadow-subtle">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">{isNew ? "New post" : "Edit post"}</h2>
            {!isNew && (
              <a
                href={`/blog/${post.slug}/`}
                target="_blank"
                rel="noreferrer"
                className="text-[14.5px] font-semibold text-ink-muted hover:text-ink"
              >
                View on the site
              </a>
            )}
          </div>

          <Field
            name="title"
            label="Title"
            defaultValue={post.title}
            error={errors.title}
            onChange={setTitle}
            hint={<Counter value={title} min={50} max={60} />}
          />

          {isNew && (
            <Field
              name="newSlug"
              label="Address"
              defaultValue=""
              error={errors.newSlug}
              hint={<span className="text-[12.5px] text-ink-muted">Leave blank to use the title. Becomes /blog/your-address/</span>}
            />
          )}

          <label className="flex flex-col gap-1.5">
            <span className={LABEL}>Search description</span>
            <textarea
              name="description"
              rows={2}
              defaultValue={post.description}
              onChange={(e) => setDescription(e.target.value)}
              aria-invalid={errors.description ? true : undefined}
              className={`${FIELD} resize-y leading-[1.5]`}
            />
            <Counter value={description} min={140} max={155} />
            {errors.description && <span className="text-[12.5px] font-semibold text-status-breached">{errors.description}</span>}
          </label>

          <label className="flex flex-col gap-1.5">
            <span className={LABEL}>Excerpt</span>
            <textarea
              name="excerpt"
              rows={2}
              defaultValue={post.excerpt}
              aria-invalid={errors.excerpt ? true : undefined}
              className={`${FIELD} resize-y leading-[1.5]`}
            />
            <span className="text-[12.5px] text-ink-muted">The line shown on the blog listing.</span>
            {errors.excerpt && <span className="text-[12.5px] font-semibold text-status-breached">{errors.excerpt}</span>}
          </label>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
            <Field name="topic" label="Topic" defaultValue={post.topic} error={errors.topic} />
            <Field name="date" label="Published" type="date" defaultValue={post.date} error={errors.date} />
            <Field name="updated" label="Updated (optional)" type="date" defaultValue={post.updated} error={errors.updated} />
          </div>

          <label className="flex w-fit items-center gap-2.5">
            <input type="checkbox" name="draft" defaultChecked={post.draft} className="size-4 accent-ink" />
            <span className="text-[15px] text-ink">Draft: keep it off the blog and out of search</span>
          </label>
        </section>

        <section className="flex flex-col gap-3 rounded-3xl bg-surface p-7 shadow-subtle">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">The post</h2>
            <button
              type="button"
              onClick={togglePreview}
              disabled={previewing}
              className="cursor-pointer rounded-xl border border-border bg-surface px-3.5 py-2 text-[14px] font-semibold text-ink"
            >
              {previewing ? "Rendering" : preview !== null ? "Back to writing" : "Preview"}
            </button>
          </div>

          {preview !== null ? (
            <div className="prose max-w-none rounded-2xl bg-surface-tint p-6" dangerouslySetInnerHTML={{ __html: preview }} />
          ) : (
            <textarea
              name="body"
              rows={26}
              defaultValue={post.body}
              onChange={(e) => setBody(e.target.value)}
              spellCheck
              className={`${FIELD} resize-y font-mono text-[14px] leading-[1.7]`}
            />
          )}
          {errors.body && <span className="text-[12.5px] font-semibold text-status-breached">{errors.body}</span>}
          <span className="text-[12.5px] text-ink-muted">
            Markdown. Use ## for a heading, **bold**, and [text](/product/channels/) for a link.
          </span>
        </section>

        {state.error && (
          <p role="alert" className="rounded-xl bg-accent-wash px-4 py-3 text-[14.5px] text-ink">
            {state.error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="lift cursor-pointer rounded-[14px] bg-ink px-[22px] py-3 text-[15.5px] leading-[normal] font-semibold text-on-ink [--lift-y:-2px] disabled:cursor-default disabled:opacity-70"
          >
            {pending ? "Saving" : isNew ? "Create post" : "Save"}
          </button>
          <Link href="/admin/posts" className="rounded-xl px-3 py-2 text-[15px] font-semibold text-ink-muted hover:text-ink">
            Back to posts
          </Link>
          {showSaved && <span className="text-[14.5px] text-ink-muted">Saved. Publish on the Blog page to put it on the site.</span>}
        </div>
      </form>

      {!isNew && (
        <form
          action={deletePostAction}
          onSubmit={(e) => {
            if (!confirm(`Delete "${post.title || post.slug}"? This cannot be undone.`)) e.preventDefault();
          }}
          className="flex items-center justify-between gap-4 rounded-3xl bg-surface p-6 shadow-subtle"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[15.5px] font-semibold text-ink">Delete this post</span>
            <span className="text-[14px] text-ink-muted">It disappears from the site at the next publish.</span>
          </div>
          <input type="hidden" name="slug" value={post.slug} />
          <button
            type="submit"
            className="cursor-pointer rounded-xl border border-border bg-surface px-4 py-2.5 text-[14.5px] font-semibold text-status-breached"
          >
            Delete
          </button>
        </form>
      )}
    </div>
  );
}
