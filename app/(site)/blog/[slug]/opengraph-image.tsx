// Social share image for a post, drawn at build time from its own frontmatter.
export { size, contentType } from "@/lib/og";
import { getPost, getPosts } from "@/lib/blog";
import { ogCard } from "@/lib/og";

export const alt = "Kolabr blog";

export async function generateStaticParams() {
  const posts = await getPosts({ includeDrafts: true });
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return ogCard(post?.title ?? "Kolabr", post?.description ?? "");
}
