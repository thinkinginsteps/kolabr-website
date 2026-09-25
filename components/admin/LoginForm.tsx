"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "@/lib/admin/login-actions";

const FIELD =
  "w-full rounded-[13px] border border-border bg-surface px-[15px] py-[13px] text-[16px] leading-[normal] tracking-normal text-ink transition-[border-color,box-shadow] duration-200 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-ring)] focus:outline-none";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, {});
  return (
    <form action={action} className="flex flex-col gap-[18px]">
      <label className="flex flex-col gap-[7px]">
        <span className="text-[14px] font-semibold tracking-[-0.01em] text-ink">Email</span>
        <input name="email" type="email" autoComplete="username" required className={FIELD} />
      </label>
      <label className="flex flex-col gap-[7px]">
        <span className="text-[14px] font-semibold tracking-[-0.01em] text-ink">Password</span>
        <input name="password" type="password" autoComplete="current-password" required className={FIELD} />
      </label>

      {state.error && (
        <p role="alert" className="rounded-xl bg-accent-wash px-4 py-3 text-[14.5px] text-ink">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="lift mt-1 cursor-pointer rounded-[14px] bg-ink px-[26px] py-[14px] text-[16px] leading-[normal] font-semibold text-on-ink [--lift-y:-2px] disabled:cursor-default disabled:opacity-70"
      >
        {pending ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
