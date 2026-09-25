import { PostEntry } from "@/components/blog/BlogParts";
import { TrialPromo } from "@/components/TrialPromo";
import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { getPosts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbJsonLd, graph, organizationJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/blog/");

// Static: the posts are read from content/blog/ at build time.
export default async function BlogIndex() {
  const posts = await getPosts();
  const [featured, ...rest] = posts;

  const listJsonLd = {
    "@type": "Blog",
    "@id": `${absoluteUrl("/blog/")}#blog`,
    name: "The Kolabr blog",
    url: absoluteUrl("/blog/"),
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      dateModified: p.updated ?? p.date,
      url: absoluteUrl(`/blog/${p.slug}/`),
    })),
  };

  return (
    <>
      <JsonLd data={graph(organizationJsonLd, breadcrumbJsonLd("/blog/"), listJsonLd)} />

      <section aria-labelledby="blog-h" className="relative bg-hero-glow px-10 pt-[196px] pb-[70px] max-tab:!px-5 max-tab:!pt-[124px] max-tab:!pb-0">
        <div className="mx-auto w-full max-w-[1236px]">
          <div data-rise="" className="flex max-w-[820px] flex-col gap-5">
            <span className="text-[12px] font-semibold tracking-[0.12em] text-accent-ink uppercase">Blog</span>
            <h1 id="blog-h" className="text-[clamp(38px,4.6vw,66px)] leading-none font-extrabold tracking-[-0.04em] text-balance text-ink">
              Working with clients, not around them
            </h1>
            <p className="max-w-[700px] text-[20.5px] leading-normal text-pretty text-ink-muted">
              What we have learned about work that crosses company lines: shared channels, requests that are actually tracked, and the
              things worth writing down before somebody leaves.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Posts" className="px-10 pt-14 pb-[150px] max-tab:!px-5 max-tab:!py-[86px]">
        {/* A reading column plus a rail: full width makes the lines too long to scan. */}
        <div className="mx-auto grid w-full max-w-[1236px] grid-cols-[minmax(0,880px)_minmax(0,300px)] items-start gap-14 max-desk:grid-cols-1">
          {posts.length === 0 ? (
            <p className="text-[18px] text-ink-muted">The first posts are on their way.</p>
          ) : (
            <div data-rise-group="" className="flex flex-col gap-3.5">
              <PostEntry post={featured} latest />
              {rest.map((post) => (
                <PostEntry key={post.slug} post={post} />
              ))}
            </div>
          )}

          {/* Below 1081px the closing band already carries the trial, so the rail steps aside. */}
          <aside data-rise="" className="sticky top-[110px] flex flex-col gap-5 max-desk:hidden">
            <TrialPromo />
            <div className="flex flex-col gap-2 rounded-[18px] bg-surface-tint p-[22px]">
              <span className="text-[11.5px] font-semibold tracking-[0.1em] text-ink-muted uppercase">Follow along</span>
              <p className="text-[14px] leading-[1.5] text-ink-muted">
                New writing every few weeks on work that crosses company lines.
              </p>
              <a href="/blog/rss.xml" className="w-fit border-b-2 border-accent pb-px text-[14.5px] font-semibold text-ink hover:text-ink">
                RSS feed
              </a>
            </div>
          </aside>
        </div>
      </section>

      <CtaBand
        title="See it on one of your own clients."
        body="Fourteen days free on Max, every option included, no card. Open a channel, invite the people you currently email, and judge it from there."
      />
    </>
  );
}
