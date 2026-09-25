"use client";

import { useState, type FormEvent } from "react";
import { CONTACT_SIZES, CONTACT_TOPICS, type ContactSize, type ContactTopic } from "@/lib/contact";

type Status = "idle" | "invalid" | "sending" | "sent" | "error";

// Form controls keep the browser's own line height, letter-spacing and placeholder colour, as
// in the design (controls do not inherit them there). The select is pinned to the 18px line the
// design renders it at, and the textarea sets 1.5.
const FIELD_BOX =
  "w-full rounded-[13px] border border-border bg-surface px-[15px] py-[13px] text-[16px] tracking-normal text-ink transition-[border-color,box-shadow] placeholder:text-field-placeholder duration-200 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-ring)] focus:outline-none aria-[invalid=true]:border-status-breached";
const FIELD = `${FIELD_BOX} leading-[normal]`;
const LABEL = "text-[14px] font-semibold tracking-[-0.01em] text-ink";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NOTES: Record<Status, string> = {
  idle: "No newsletter, and we will not pass your details on.",
  invalid: "Please add your name and a work email we can reply to.",
  sending: "No newsletter, and we will not pass your details on.",
  sent: "We reply within one working day, to the address you gave us.",
  error: "Your message did not send. Please try again in a moment.",
};

/**
 * The contact form. Posts JSON to the /api/contact/ route handler (trailing slash, as the site
 * uses, to skip a redirect), which validates again on the server; the checks here only catch
 * mistakes before a round trip.
 */
export function ContactForm() {
  const [topic, setTopic] = useState<ContactTopic>("A trial");
  const [size, setSize] = useState<ContactSize>("6 to 20");
  const [status, setStatus] = useState<Status>("idle");
  const [invalid, setInvalid] = useState<{ name?: boolean; email?: boolean }>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Editing after a send or a failure starts a fresh message.
  const touch = () => {
    if (status !== "idle" && status !== "sending") setStatus("idle");
    setServerError(null);
  };

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const data = new FormData(form);
    const value = (k: string) => String(data.get(k) ?? "").trim();

    const nextInvalid = { name: !value("name"), email: !EMAIL.test(value("email")) };
    setInvalid(nextInvalid);
    if (nextInvalid.name || nextInvalid.email) {
      setStatus("invalid");
      form.querySelector<HTMLInputElement>(nextInvalid.name ? "#ct-name" : "#ct-email")?.focus();
      return;
    }

    setStatus("sending");
    setServerError(null);
    try {
      const res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: value("name"),
          email: value("email"),
          company: value("company"),
          size,
          topic,
          message: value("message"),
          website: value("website"),
        }),
      });
      const json = (await res.json().catch(() => null)) as { ok: boolean; error?: string } | null;
      if (!res.ok || !json?.ok) {
        setServerError(json?.error ?? null);
        setStatus("error");
        return;
      }
      form.reset();
      setTopic("A trial");
      setSize("6 to 20");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const buttonLabel = status === "sending" ? "Sending" : status === "sent" ? "Thank you, we have it" : "Send message";
  const note = status === "error" && serverError ? serverError : NOTES[status];

  return (
    <form noValidate onSubmit={submit} onChange={touch} className="flex flex-col gap-[18px]">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[18px] max-tab:grid-cols-1">
        <label className="flex flex-col gap-[7px]">
          <span className={LABEL}>Your name</span>
          <input
            id="ct-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Nadia Fourie"
            required
            maxLength={120}
            aria-invalid={invalid.name || undefined}
            onInput={() => invalid.name && setInvalid((v) => ({ ...v, name: false }))}
            className={FIELD}
          />
        </label>
        <label className="flex flex-col gap-[7px]">
          <span className={LABEL}>Work email</span>
          <input
            id="ct-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            maxLength={254}
            aria-invalid={invalid.email || undefined}
            onInput={() => invalid.email && setInvalid((v) => ({ ...v, email: false }))}
            className={FIELD}
          />
        </label>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[18px] max-tab:grid-cols-1">
        <label className="flex flex-col gap-[7px]">
          <span className={LABEL}>Company</span>
          <input name="company" type="text" autoComplete="organization" placeholder="Reyes + Malan" maxLength={160} className={FIELD} />
        </label>
        <label className="flex flex-col gap-[7px]">
          <span className={LABEL}>People on your team</span>
          <select
            name="size"
            value={size}
            onChange={(e) => setSize(e.target.value as ContactSize)}
            className={`${FIELD_BOX} cursor-pointer appearance-none leading-[18px]`}
          >
            {CONTACT_SIZES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <fieldset className="flex flex-col gap-[9px]">
        <legend className={`${LABEL} mb-[9px] p-0`}>What is this about?</legend>
        <div className="flex flex-wrap gap-2">
          {CONTACT_TOPICS.map((t) => {
            const active = topic === t;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setTopic(t);
                  touch();
                }}
                className={`cursor-pointer rounded-[11px] border px-[15px] py-[9px] text-[14.5px] leading-[normal] font-semibold tracking-normal text-ink transition-[background-color,border-color] duration-200 ${
                  active ? "border-accent-line bg-accent-soft" : "border-border bg-surface-tint"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </fieldset>
      <label className="flex flex-col gap-[7px]">
        <span className={LABEL}>How do you work with people outside your company?</span>
        <textarea
          name="message"
          rows={5}
          maxLength={5000}
          placeholder="We are an eleven-person practice with about forty clients. Most of the work arrives by email and nobody can tell what is outstanding."
          className={`${FIELD_BOX} resize-y leading-normal`}
        />
      </label>
      {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-4 pt-0.5">
        <button
          type="submit"
          disabled={status === "sending" || status === "sent"}
          className="lift cursor-pointer rounded-[14px] bg-ink px-[26px] py-[15px] text-[16.5px] leading-[normal] font-semibold tracking-normal text-on-ink [--lift-y:-2px] disabled:cursor-default"
        >
          {buttonLabel}
        </button>
        <span role="status" aria-live="polite" className="max-w-[280px] text-[14px] text-pretty text-ink-muted">
          {note}
        </span>
      </div>
    </form>
  );
}
