import { AdminHeader } from "@/components/admin/AdminHeader";
import { requireAdmin } from "@/lib/admin/guards";
import { deleteMessageAction } from "@/lib/admin/messages-actions";
import { listMessages, type ContactMessage } from "@/lib/admin/messages";

/**
 * Everything the contact form has received. The site emails each one as well; this is the copy
 * that survives a failed send, which is why a failure is called out rather than hidden.
 */

function when(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });
}

function DeliveryTag({ message }: { message: ContactMessage }) {
  if (message.delivery === "sent") return <span className="text-[13.5px] text-ink-muted">Emailed</span>;
  if (message.delivery === "pending") return <span className="text-[13.5px] text-status-risk">Send not confirmed</span>;
  return (
    <span className="rounded-full bg-accent-wash px-3 py-1 text-[12.5px] font-semibold text-status-breached">
      Email not sent
    </span>
  );
}

export default async function AdminMessages() {
  await requireAdmin();
  const messages = await listMessages();
  const failed = messages.filter((m) => m.delivery !== "sent").length;

  return (
    <main className="mx-auto flex max-w-[860px] flex-col gap-6 px-5 py-14">
      <AdminHeader current="messages" />

      <section className="rounded-3xl bg-surface p-7 shadow-subtle">
        <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-ink">Contact form</h2>
        <p className="mt-2 text-[15.5px] text-ink-muted">
          {messages.length === 0
            ? "Nothing yet. Messages appear here the moment the form is used, whether or not the email goes out."
            : failed > 0
              ? `${messages.length} message${messages.length === 1 ? "" : "s"}, and ${failed} did not reach the inbox. Reply from here.`
              : `${messages.length} message${messages.length === 1 ? "" : "s"}, all emailed as well.`}
        </p>
      </section>

      {messages.map((m) => (
        <article key={m.id} className="flex flex-col gap-3.5 rounded-3xl bg-surface p-7 shadow-subtle">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="text-[17.5px] font-semibold tracking-[-0.015em] text-ink">
              {m.name}
              <span className="ml-2 text-[15px] font-normal text-ink-muted">{m.company || "no company given"}</span>
            </h3>
            <span className="text-[14px] text-ink-muted">{when(m.receivedAt)}</span>
          </div>

          <dl className="flex flex-wrap gap-x-6 gap-y-1 text-[14.5px] text-ink-muted">
            <div className="flex gap-2">
              <dt className="font-semibold text-ink">Email</dt>
              <dd>
                <a href={`mailto:${m.email}`} className="border-b-2 border-accent pb-px text-ink hover:text-ink">
                  {m.email}
                </a>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold text-ink">Team</dt>
              <dd>{m.size}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold text-ink">About</dt>
              <dd>{m.topic}</dd>
            </div>
          </dl>

          {m.message && (
            <p className="rounded-2xl bg-surface-tint p-5 text-[15.5px] leading-[1.6] whitespace-pre-wrap text-ink">{m.message}</p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <DeliveryTag message={m} />
              {m.deliveryError && <span className="text-[13.5px] text-ink-muted">{m.deliveryError}</span>}
            </div>
            <form action={deleteMessageAction}>
              <input type="hidden" name="id" value={m.id} />
              <button
                type="submit"
                className="cursor-pointer rounded-xl border border-border bg-surface px-3.5 py-2 text-[14px] font-semibold text-ink-muted hover:text-ink"
              >
                Delete
              </button>
            </form>
          </div>
        </article>
      ))}
    </main>
  );
}
