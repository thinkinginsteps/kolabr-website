import "server-only";
import { mkdir, readFile, readdir, rename, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { CONTENT_DIR } from "./config";

/**
 * The back office's view of the blog: the Markdown files themselves, frontmatter and body kept
 * apart so a form can edit them. lib/blog.ts renders those same files for the site; this module
 * never renders, it only reads and writes source.
 *
 * Posts live in CONTENT_DIR, which is outside the app directory on the server, so a deploy cannot
 * overwrite something written here.
 */

const DIR = () => path.join(CONTENT_DIR, "blog");

export type PostSource = {
  slug: string;
  title: string;
  description: string;
  excerpt: string;
  date: string;
  updated: string;
  topic: string;
  draft: boolean;
  body: string;
  /** When the file was last written, for showing whether the site is behind the content. */
  modifiedAt: string;
};

export const isValidSlug = (slug: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length <= 80;

/** A filename from a slug, once it is known to be a slug. Never build a path from raw input. */
const fileFor = (slug: string) => path.join(DIR(), `${slug}.md`);

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
    .replace(/^-|-$/g, "");
}

const str = (v: unknown) => (typeof v === "string" ? v : "");

export async function listPosts(): Promise<PostSource[]> {
  let files: string[];
  try {
    files = (await readdir(DIR())).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
  const posts = await Promise.all(files.map((f) => getPost(f.replace(/\.md$/, ""))));
  return posts
    .filter((p): p is PostSource => p !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string): Promise<PostSource | null> {
  if (!isValidSlug(slug)) return null;
  try {
    const file = fileFor(slug);
    const [raw, info] = await Promise.all([readFile(file, "utf8"), stat(file)]);
    const { data, content } = matter(raw);
    return {
      slug,
      title: str(data.title),
      description: str(data.description),
      excerpt: str(data.excerpt),
      date: str(data.date),
      updated: str(data.updated),
      topic: str(data.topic),
      draft: data.draft === true,
      body: content.replace(/^\n+/, ""),
      modifiedAt: info.mtime.toISOString(),
    };
  } catch {
    return null;
  }
}

/** YAML with quoted strings: titles contain colons, which unquoted YAML reads as structure. */
function frontmatter(post: Omit<PostSource, "slug" | "modifiedAt">): string {
  const q = (v: string) => `"${v.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  const lines = [
    `title: ${q(post.title)}`,
    `description: ${q(post.description)}`,
    `excerpt: ${q(post.excerpt)}`,
    `date: ${q(post.date)}`,
    ...(post.updated ? [`updated: ${q(post.updated)}`] : []),
    `topic: ${q(post.topic)}`,
    ...(post.draft ? ["draft: true"] : []),
  ];
  return `---\n${lines.join("\n")}\n---\n\n`;
}

export async function writePost(slug: string, post: Omit<PostSource, "slug" | "modifiedAt">): Promise<void> {
  if (!isValidSlug(slug)) throw new Error("Invalid slug.");
  await mkdir(DIR(), { recursive: true });
  const file = fileFor(slug);
  // Written through a temporary file: a half-written post is not a post, and the next build
  // would fail on it.
  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(tmp, `${frontmatter(post)}${post.body.trimEnd()}\n`, "utf8");
  await rename(tmp, file);
}

export async function deletePost(slug: string): Promise<void> {
  if (!isValidSlug(slug)) throw new Error("Invalid slug.");
  await unlink(fileFor(slug));
}

export async function postExists(slug: string): Promise<boolean> {
  if (!isValidSlug(slug)) return false;
  try {
    await stat(fileFor(slug));
    return true;
  } catch {
    return false;
  }
}

/**
 * Whether the live site is behind the content. The build stamps .next/BUILD_ID when it runs, so
 * a post modified after that has been saved but not published.
 */
export async function hasUnpublishedChanges(): Promise<boolean> {
  const posts = await listPosts();
  if (posts.length === 0) return false;
  const newest = posts.reduce((max, p) => (p.modifiedAt > max ? p.modifiedAt : max), "");
  try {
    const built = await stat(path.join(process.cwd(), ".next", "BUILD_ID"));
    return Date.parse(newest) > built.mtime.getTime();
  } catch {
    // No build to compare against (dev, or a first install): do not claim it is behind.
    return false;
  }
}
