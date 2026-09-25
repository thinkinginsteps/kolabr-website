"use client";

import { reopenConsent } from "@/lib/consent";

/** Reopens the consent banner, so a choice can be changed at any time. */
export function CookieSettingsButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" onClick={reopenConsent} className={`cursor-pointer ${className}`}>
      Cookie settings
    </button>
  );
}
