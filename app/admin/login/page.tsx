import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/Logo";
import { adminConfigured } from "@/lib/admin/guards";
import { isSignedIn } from "@/lib/admin/session";

export default async function AdminLogin() {
  if (await isSignedIn()) redirect("/admin");

  return (
    <main className="mx-auto flex min-h-screen max-w-[420px] flex-col justify-center gap-7 px-5 py-16">
      <div className="flex flex-col gap-2">
        <Logo decorative className="h-[23px] w-auto text-ink" />
        <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-ink">Back office</h1>
        <p className="text-[15.5px] text-ink-muted">Sign in to publish changes to kolabr.com.</p>
      </div>

      <div className="rounded-3xl bg-surface p-7 shadow-subtle">
        {adminConfigured() ? (
          <LoginForm />
        ) : (
          <p className="text-[15px] leading-[1.6] text-ink-muted">
            No admin account is configured on this server. Set <code className="text-ink">ADMIN_EMAIL</code> and{" "}
            <code className="text-ink">ADMIN_PASSWORD_HASH</code> in <code className="text-ink">/opt/kolabr/.env.production</code>,
            then restart the service. Generate the hash with{" "}
            <code className="text-ink">npm run admin:password</code>.
          </p>
        )}
      </div>
    </main>
  );
}
