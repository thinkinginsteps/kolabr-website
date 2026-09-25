"use server";

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { REBUILD_SCRIPT } from "./config";
import { requireAdmin } from "./guards";
import { deletePost as removePost, getPost, isValidSlug, postExists, slugify, writePost } from "./posts";
import { isValidDeployId, newDeployId } from "@/lib/deploy/types";
import { renderMarkdown } from "@/lib/blog";

/**
 * Editing the blog from the back office. Saving writes the Markdown file; the site only shows the
 * change after a rebuild, because every page here is generated at build time. Publish does that.
 */

const execFileAsync = promisify(execFile);
const USE_SUDO = process.env.DEPLOY_SUDO !== "0";

export type PostFormState = {
  error?: string;
  /** Field-level problems, keyed by field name. */
  fieldErrors?: Record<string, string>;
  saved?: boolean;
  slug?: string;
};

// The hard rules only. Length guidance (titles 50 to 60, descriptions 140 to 155) is shown as a
// counter in the editor rather than enforced here: a warning teaches, a blocked save annoys.
const PostSchema = z.object({
  title: z.string().trim().min(1, "A title is needed.").max(200),
  description: z.string().trim().min(1, "A description is needed.").max(400),
  excerpt: z.string().trim().min(1, "An excerpt is needed.").max(400),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD."),
  updated: z.union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD."), z.literal("")]),
  topic: z.string().trim().min(1, "A topic is needed.").max(60),
  body: z.string().min(1, "The post is empty."),
});

function readForm(formData: FormData) {
  const get = (k: string) => String(formData.get(k) ?? "");
  return {
    title: get("title"),
    description: get("description"),
    excerpt: get("excerpt"),
    date: get("date"),
    updated: get("updated"),
    topic: get("topic"),
    body: get("body").replace(/\r\n/g, "\n"),
    draft: formData.get("draft") === "on",
  };
}

export async function savePost(_prev: PostFormState, formData: FormData): Promise<PostFormState> {
  await requireAdmin();

  const existingSlug = String(formData.get("slug") ?? "");
  const values = readForm(formData);
  const parsed = PostSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { fieldErrors, error: "Some fields need attention." };
  }

  const isNew = existingSlug === "";
  const requested = String(formData.get("newSlug") ?? "").trim() || slugify(values.title);
  const slug = isNew ? requested : existingSlug;

  if (!isValidSlug(slug)) {
    return { fieldErrors: { newSlug: "Use lower-case letters, numbers and hyphens." }, error: "That address will not work." };
  }
  if (isNew && (await postExists(slug))) {
    return { fieldErrors: { newSlug: "A post already lives at that address." }, error: "That address is taken." };
  }

  await writePost(slug, { ...parsed.data, draft: values.draft });
  revalidatePath("/admin/posts");

  if (isNew) redirect(`/admin/posts/${slug}`);
  return { saved: true, slug };
}

export async function deletePostAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "");
  if (!isValidSlug(slug)) return;
  await removePost(slug);
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

/** Renders the body exactly as the site will, so the preview cannot drift from the real page. */
export async function previewPost(markdown: string): Promise<string> {
  await requireAdmin();
  return renderMarkdown(markdown.slice(0, 200_000));
}

export type PublishResult = { ok: boolean; jobId?: string; error?: string };

/**
 * Rebuild the site so saved posts go live. Like a deploy this restarts the service, so it cannot
 * be awaited: the script detaches and the panel polls for the outcome.
 */
export async function publishContent(): Promise<PublishResult> {
  await requireAdmin();
  const requestedId = `rebuild-${newDeployId()}`;
  try {
    const args = [REBUILD_SCRIPT, "--deploy-id", requestedId];
    const { stdout, stderr } = await execFileAsync(USE_SUDO ? "sudo" : args[0], USE_SUDO ? args : args.slice(1), {
      timeout: 60_000,
      maxBuffer: 1024 * 1024,
    });
    const output = `${stdout}${stderr ? `\n${stderr}` : ""}`.trim();
    const echoed = /deploy-id:\s*([A-Za-z0-9._-]{1,64})/.exec(output)?.[1];
    return { ok: true, jobId: echoed && isValidDeployId(echoed) ? echoed : requestedId };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error("[publish] could not start the rebuild:", message);
    return { ok: false, error: `Could not start the rebuild: ${message}` };
  }
}

/** Used by the editor's "discard" button to reload what is actually on disk. */
export async function loadPost(slug: string) {
  await requireAdmin();
  return getPost(slug);
}
