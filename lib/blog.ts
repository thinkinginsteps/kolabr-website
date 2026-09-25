import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

/**
 * Posts are Markdown files read at build time only: nothing here runs on a request. Each file's
 * name is its slug, so my-post.md is /blog/my-post/.
 *
 * On the server the posts live outside the app directory (so a deploy cannot overwrite what the
 * back office has written) and CONTENT_DIR points at them. They are NOT symlinked in: Turbopack
 * follows a symlink that leaves the project root and fails the build with
 * "FileSystemPath leaves the filesystem root".
 */

const CONTENT_DIR = process.env.CONTENT_DIR ?? path.join(process.cwd(), "content");
const DIR = path.join(CONTENT_DIR, "blog");

export type PostMeta = {
  slug: string;
  title: string;
  /** Meta description, 140 to 155 characters, same rule as the rest of the site. */
  description: string;
  /** Sentence shown on the listing card. */
  excerpt: string;
  date: string;
  updated?: string;
  /** One topic label, shown on the card and used to pick related posts. */
  topic: string;
  /** Posts marked draft are left out of the listing, the sitemap and the feed. */
  draft?: boolean;
  readingMinutes: number;
};

export type Post = PostMeta & { html: string };

const required = ["title", "description", "excerpt", "date", "topic"] as const;

function assertFrontmatter(data: Record<string, unknown>, file: string) {
  for (const key of required) {
    if (typeof data[key] !== "string" || !data[key]) throw new Error(`${file}: frontmatter "${key}" is missing`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data.date))) throw new Error(`${file}: date must be YYYY-MM-DD`);
}

/** Average adult reading speed, rounded up, so the listing can say how long a post takes. */
const readingMinutes = (text: string) => Math.max(1, Math.round(text.trim().split(/\s+/).length / 225));

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  // Heading anchors: a quiet link on each h2/h3 so sections can be linked to and shared.
  .use(rehypeAutolinkHeadings, { behavior: "wrap", properties: { className: ["heading-anchor"] } })
  .use(rehypeStringify);

/** The site's own Markdown pipeline, exposed so the back office preview cannot drift from it. */
export async function renderMarkdown(markdown: string): Promise<string> {
  return String(await processor.process(markdown));
}

async function read(file: string): Promise<Post> {
  const raw = await readFile(path.join(DIR, file), "utf8");
  const { data, content } = matter(raw);
  assertFrontmatter(data, file);
  const html = String(await processor.process(content));
  return {
    slug: file.replace(/\.md$/, ""),
    title: String(data.title),
    description: String(data.description),
    excerpt: String(data.excerpt),
    date: String(data.date),
    ...(data.updated ? { updated: String(data.updated) } : {}),
    topic: String(data.topic),
    ...(data.draft ? { draft: true } : {}),
    readingMinutes: readingMinutes(content),
    html,
  };
}

/** Every published post, newest first. Drafts are only included when explicitly asked for. */
export async function getPosts({ includeDrafts = false } = {}): Promise<Post[]> {
  let files: string[] = [];
  try {
    files = (await readdir(DIR)).filter((f) => f.endsWith(".md"));
  } catch {
    return [];
  }
  const posts = await Promise.all(files.map(read));
  return posts.filter((p) => includeDrafts || !p.draft).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string): Promise<Post | null> {
  const posts = await getPosts({ includeDrafts: true });
  return posts.find((p) => p.slug === slug) ?? null;
}

/** Up to three other posts, preferring the same topic. */
export function relatedPosts(all: Post[], current: Post, count = 3) {
  const others = all.filter((p) => p.slug !== current.slug);
  const sameTopic = others.filter((p) => p.topic === current.topic);
  return [...sameTopic, ...others.filter((p) => p.topic !== current.topic)].slice(0, count);
}

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
