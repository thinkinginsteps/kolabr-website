import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs, PostCard, PostMetaLine, TopicTag } from "@/components/blog/BlogParts";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { getPost, getPosts, relatedPosts } from "@/lib/blog";
import { graph, organizationJsonLd, postMetadata, postJsonLd, postBreadcrumbJsonLd } from "@/lib/seo";

// One page per file in content/blog/. Drafts are built but marked noindex, so they can be
// read at their URL and reviewed without turning up in search.
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts = await getPosts({ includeDrafts: true });
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return post ? postMetadata(post) : {};
}

export default async function BlogPost({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const all = await getPosts();
  const related = relatedPosts(all, post);

  return (
    <>
      <JsonLd data={graph(organizationJsonLd, postBreadcrumbJsonLd(post), postJsonLd(post))} />

      <article>
        <header className="relative bg-hero-glow px-10 pt-[180px] pb-16 max-tab:!px-5 max-tab:!pt-[124px] max-tab:!pb-0">
          <div className="mx-auto flex max-w-[780px] flex-col gap-5">
            <Breadcrumbs trail={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]} />
            <TopicTag topic={post.topic} />
            <h1 className="text-[clamp(34px,4vw,54px)] leading-[1.05] font-extrabold tracking-[-0.035em] text-balance text-ink">
              {post.title}
            </h1>
            <p className="text-[20px] leading-normal text-pretty text-ink-muted">{post.excerpt}</p>
            <PostMetaLine post={post} />
          </div>
        </header>

        <div className="px-10 pt-12 pb-[120px] max-tab:!px-5 max-tab:!py-[86px]">
          {/* The Markdown pipeline runs at build time on our own files in content/blog/. */}
          <div className="prose mx-auto max-w-[780px]" dangerouslySetInnerHTML={{ __html: post.html }} />
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="more-h" className="px-10 pb-[140px] max-tab:!px-5 max-tab:!py-[86px]">
          <div className="mx-auto max-w-content">
            <h2 id="more-h" className="mb-8 text-[28px] font-semibold tracking-[-0.025em] text-ink">
              More on this
            </h2>
            <div data-rise-group="" className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-[18px] max-tab:grid-cols-1">
              {related.map((item) => (
                <PostCard key={item.slug} post={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title="Try it on one client."
        body="Fourteen days free on Max, every option included, no card. Open one channel, invite the people you currently email, and see whether it holds up."
      />
    </>
  );
}
