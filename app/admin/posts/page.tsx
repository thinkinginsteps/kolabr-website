import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PublishBar } from "@/components/admin/PublishBar";
import { requireAdmin } from "@/lib/admin/guards";
import { hasUnpublishedChanges, listPosts } from "@/lib/admin/posts";

export default async function AdminPosts() {
  await requireAdmin();
  const [posts, behind] = await Promise.all([listPosts(), hasUnpublishedChanges()]);

  return (
    <main className="mx-auto flex max-w-[860px] flex-col gap-6 px-5 py-14">
      <AdminHeader current="posts" />
      <PublishBar behind={behind} />

      <section className="rounded-3xl bg-surface p-7 shadow-subtle">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">Posts</h2>
          <Link
            href="/admin/posts/new"
            className="lift rounded-[14px] bg-ink px-[18px] py-2.5 text-[15px] font-semibold text-on-ink [--lift-y:-2px] hover:text-on-ink"
          >
            New post
          </Link>
        </div>

        {posts.length === 0 ? (
          <p className="mt-5 text-[15.5px] text-ink-muted">No posts yet.</p>
        ) : (
          <ul className="mt-5 flex flex-col">
            {posts.map((post) => (
              <li key={post.slug} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-t border-border py-4 first:border-0 first:pt-0">
                <Link href={`/admin/posts/${post.slug}`} className="text-[16.5px] font-semibold text-ink hover:text-ink">
                  {post.title || post.slug}
                </Link>
                {post.draft && (
                  <span className="rounded-full bg-surface-tint px-2.5 py-1 text-[11.5px] font-semibold tracking-[0.08em] text-ink-muted uppercase">
                    Draft
                  </span>
                )}
                <span className="ml-auto text-[14px] text-ink-muted">
                  {post.topic} · {post.date}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
