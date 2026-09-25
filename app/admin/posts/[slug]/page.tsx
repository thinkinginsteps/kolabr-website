import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PostEditor } from "@/components/admin/PostEditor";
import { requireAdmin } from "@/lib/admin/guards";
import { getPost } from "@/lib/admin/posts";

/** The editor, for an existing post or, at /admin/posts/new, for one that does not exist yet. */
export default async function EditPost({ params }: PageProps<"/admin/posts/[slug]">) {
  await requireAdmin();
  const { slug } = await params;

  if (slug === "new") {
    const today = new Date().toISOString().slice(0, 10);
    return (
      <main className="mx-auto flex max-w-[860px] flex-col gap-6 px-5 py-14">
        <AdminHeader current="posts" />
        <PostEditor
          post={{ slug: "", title: "", description: "", excerpt: "", date: today, updated: "", topic: "", draft: true, body: "", modifiedAt: "" }}
          isNew
        />
      </main>
    );
  }

  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <main className="mx-auto flex max-w-[860px] flex-col gap-6 px-5 py-14">
      <AdminHeader current="posts" />
      <PostEditor post={post} />
    </main>
  );
}
