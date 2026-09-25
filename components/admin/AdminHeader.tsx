import Link from "next/link";
import { Logo } from "@/components/Logo";
import { signOut } from "@/lib/admin/login-actions";
import { messageSummary } from "@/lib/admin/messages";

const tab = "flex items-center gap-2 rounded-xl px-3.5 py-2 text-[15px] font-semibold";

export async function AdminHeader({ current }: { current: "deploy" | "posts" | "copy" | "messages" }) {
  const { total, failed } = await messageSummary();

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-5">
        <Link href="/admin" className="flex items-center hover:text-ink">
          <Logo decorative className="h-[21px] w-auto text-ink" />
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/admin" className={`${tab} ${current === "deploy" ? "bg-surface text-ink shadow-subtle" : "text-ink-muted hover:text-ink"}`}>
            Deploy
          </Link>
          <Link href="/admin/posts" className={`${tab} ${current === "posts" ? "bg-surface text-ink shadow-subtle" : "text-ink-muted hover:text-ink"}`}>
            Blog
          </Link>
          <Link href="/admin/copy" className={`${tab} ${current === "copy" ? "bg-surface text-ink shadow-subtle" : "text-ink-muted hover:text-ink"}`}>
            Copy
          </Link>
          <Link
            href="/admin/messages"
            className={`${tab} ${current === "messages" ? "bg-surface text-ink shadow-subtle" : "text-ink-muted hover:text-ink"}`}
          >
            Messages
            {total > 0 && (
              // A count that turns red when something did not reach the inbox: the one thing
              // worth noticing from any page in here.
              <span
                className={`rounded-full px-2 py-0.5 text-[12px] font-semibold ${
                  failed > 0 ? "bg-accent-wash text-status-breached" : "bg-surface-tint text-ink-muted"
                }`}
              >
                {failed > 0 ? `${failed} failed` : total}
              </span>
            )}
          </Link>
        </nav>
      </div>
      <form action={signOut}>
        <button type="submit" className="cursor-pointer rounded-xl border border-border bg-surface px-4 py-2.5 text-[14.5px] font-semibold text-ink">
          Sign out
        </button>
      </form>
    </header>
  );
}
