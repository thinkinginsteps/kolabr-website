import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { CopyEditor } from "@/components/admin/CopyEditor";
import { requireAdmin } from "@/lib/admin/guards";
import { COPY_FILES, fields, groups, isCopyFile, readCopy } from "@/lib/admin/copy";

/**
 * One copy document, one section at a time. Whole files are far too long to edit in one form
 * (the use cases alone run to thousands of strings), and a section maps to a page, which is how
 * anyone actually thinks about it.
 */
export default async function EditCopy({ params, searchParams }: PageProps<"/admin/copy/[file]">) {
  await requireAdmin();
  const { file } = await params;
  if (!isCopyFile(file)) notFound();

  const doc = await readCopy(file);
  const sections = groups(doc);
  const requested = String((await searchParams).section ?? "");
  const section = sections.includes(requested) ? requested : (sections[0] ?? "");

  const scoped = section ? (doc as Record<string, never>)[section] : doc;
  const list = fields(scoped, section);

  return (
    <main className="mx-auto flex max-w-[860px] flex-col gap-6 px-5 py-14">
      <AdminHeader current="copy" />

      <section className="rounded-3xl bg-surface p-7 shadow-subtle">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">{COPY_FILES[file].label}</h2>
          <Link href="/admin/copy" className="text-[14.5px] font-semibold text-ink-muted hover:text-ink">
            All copy
          </Link>
        </div>
        {sections.length > 1 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {sections.map((s) => (
              <li key={s}>
                <Link
                  href={`/admin/copy/${file}?section=${encodeURIComponent(s)}`}
                  className={`inline-flex rounded-xl px-3.5 py-2 text-[14.5px] font-semibold ${
                    s === section ? "bg-ink text-on-ink hover:text-on-ink" : "bg-surface-tint text-ink hover:text-ink"
                  }`}
                >
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <CopyEditor file={file} section={section} fields={list} />
    </main>
  );
}
