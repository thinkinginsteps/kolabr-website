import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { PublishBar } from "@/components/admin/PublishBar";
import { requireAdmin } from "@/lib/admin/guards";
import { COPY_FILES, groups, readCopy, type CopyFile } from "@/lib/admin/copy";
import { hasUnpublishedChanges } from "@/lib/admin/posts";

/** The copy documents, and what is inside each, as the way in to editing a page. */
export default async function AdminCopy() {
  await requireAdmin();
  const behind = await hasUnpublishedChanges();

  const files = await Promise.all(
    (Object.keys(COPY_FILES) as CopyFile[]).map(async (name) => ({
      name,
      ...COPY_FILES[name],
      sections: groups(await readCopy(name)),
    })),
  );

  return (
    <main className="mx-auto flex max-w-[860px] flex-col gap-6 px-5 py-14">
      <AdminHeader current="copy" />
      <PublishBar behind={behind} />

      <section className="rounded-3xl bg-surface p-7 shadow-subtle">
        <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">Page copy</h2>
        <p className="mt-2 text-[15.5px] leading-[1.6] text-ink-muted">
          The words on the marketing pages. You can change any of them; you cannot change the structure, so an edit here can never
          break a page. Links, image names and section ids are not editable for the same reason.
        </p>
      </section>

      {files.map((f) => (
        <section key={f.name} className="rounded-3xl bg-surface p-7 shadow-subtle">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="text-[17.5px] font-semibold tracking-[-0.015em] text-ink">{f.label}</h3>
            <span className="text-[14px] text-ink-muted">{f.note}</span>
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {f.sections.map((section) => (
              <li key={section}>
                <Link
                  href={`/admin/copy/${f.name}?section=${encodeURIComponent(section)}`}
                  className="inline-flex rounded-xl bg-surface-tint px-3.5 py-2 text-[14.5px] font-semibold text-ink hover:text-ink"
                >
                  {section}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
