import { SmartLink } from "@/components/SmartLink";
import type { Href } from "@/lib/links";
import { formatDate, type PostMeta } from "@/lib/blog";

// The blog has its own visual language: an editorial index rather than the cards the rest of
// the site uses, so a visitor can see at a glance that these are articles.

const postHref = (slug: string) => `/blog/${slug}` as Href;

/** Topic, date and reading time: the line that marks a page as an article. */
export function PostMetaLine({ post, stacked = false, onDeep = false }: { post: PostMeta; stacked?: boolean; onDeep?: boolean }) {
  const dot = stacked ? "tab:hidden" : "";
  return (
    // Stacked is the row layout from tablet up; on a phone it reads better on one wrapped line.
    <p
      className={`flex flex-wrap items-center gap-2 text-[14px] ${onDeep ? "text-on-deep-muted" : "text-ink-muted"} ${
        stacked ? "tab:flex-col tab:items-start tab:gap-1.5" : ""
      }`}
    >
      <span className={`text-[12px] font-semibold tracking-[0.08em] uppercase ${onDeep ? "text-accent-on-deep" : "text-accent-ink"}`}>
        {post.topic}
      </span>
      <span aria-hidden="true" className={dot}>
        ·
      </span>
      <time dateTime={post.date}>{formatDate(post.date)}</time>
      <span aria-hidden="true" className={dot}>
        ·
      </span>
      <span>{post.readingMinutes} min read</span>
      {post.updated && (
        <>
          <span aria-hidden="true" className={dot}>
            ·
          </span>
          <span>
            Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>
          </span>
        </>
      )}
    </p>
  );
}

export function TopicTag({ topic }: { topic: string }) {
  return (
    <span className="w-fit rounded-full bg-surface-tint px-3.5 py-1.5 text-[12.5px] font-semibold tracking-[0.06em] text-ink-muted uppercase">
      {topic}
    </span>
  );
}

/**
 * A post on the listing: one full-width card per article, stacked. The newest sits on the deep
 * panel so the latest piece is obvious before you read a word; the rest are tinted.
 */
export function PostEntry({ post, latest = false }: { post: PostMeta; latest?: boolean }) {
  return (
    <article data-rise="">
      <SmartLink
        href={postHref(post.slug)}
        className={`lift group flex flex-col gap-3.5 rounded-[22px] p-9 [--lift-y:-3px] max-tab:gap-3 max-tab:p-6 ${
          latest
            ? "bg-deep text-on-deep-muted hover:text-on-deep-muted [--lift-shadow:var(--shadow)]"
            : "bg-surface-tint text-ink hover:text-ink [--lift-shadow:var(--shadow-sm)]"
        }`}
      >
        <span className="flex flex-wrap items-center gap-3">
          {latest && (
            <span className="rounded-full bg-on-deep-card px-2.5 py-1 text-[11.5px] font-semibold tracking-[0.1em] text-on-deep uppercase">
              Latest
            </span>
          )}
          <PostMetaLine post={post} onDeep={latest} />
        </span>
        <h2
          className={`font-semibold tracking-[-0.03em] text-balance ${
            latest ? "text-[clamp(28px,2.6vw,36px)] leading-[1.08] text-on-deep" : "text-[24px] leading-[1.2] text-ink"
          }`}
        >
          {post.title}
        </h2>
        <p className={`text-pretty ${latest ? "text-[18px] leading-[1.6]" : "text-[16.5px] leading-[1.6] text-ink-muted"}`}>
          {post.excerpt}
        </p>
        <span
          className={`mt-1 flex items-center gap-2.5 text-[15.5px] font-semibold ${latest ? "text-on-deep" : "text-ink"}`}
        >
          Read the article
          <span aria-hidden="true" className="text-accent transition-transform duration-300 ease-out-soft group-hover:translate-x-1">
            →
          </span>
        </span>
      </SmartLink>
    </article>
  );
}

/** Used under an article, where a compact entry reads better than a full-width row. */
export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article data-rise="" className="flex flex-col gap-3 border-t border-border pt-5">
      <PostMetaLine post={post} />
      <h3 className="text-[20px] leading-[1.25] font-semibold tracking-[-0.02em] text-balance text-ink">
        <SmartLink href={postHref(post.slug)} className="text-ink hover:text-ink">
          {post.title}
        </SmartLink>
      </h3>
      <p className="text-[16px] text-pretty text-ink-muted">{post.excerpt}</p>
    </article>
  );
}

/** Home > Blog > Post, visible above the title as well as in the page's schema. */
export function Breadcrumbs({ trail }: { trail: { label: string; href?: Href }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-[14.5px] text-ink-muted">
        {trail.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {item.href ? (
              <SmartLink href={item.href} className="text-ink-muted hover:text-ink">
                {item.label}
              </SmartLink>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
            {i < trail.length - 1 && <span aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
