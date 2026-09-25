/**
 * Cookie consent, kept deliberately small. Nothing that tracks a visitor loads until they
 * accept, so the only state is one of three values in localStorage. The site targets every
 * market, including the EU, so "no choice yet" must behave exactly like "declined".
 *
 * It is modelled as an external store (useSyncExternalStore in components/analytics), which
 * keeps the banner, the analytics loader and the footer link reading the same value.
 */

export type Consent = "granted" | "denied" | "unset";
/** Server render and first hydration: draw nothing until we know the visitor's choice. */
export type ConsentSnapshot = Consent | "ssr";

export const CONSENT_KEY = "kolabr-analytics-consent";

const listeners = new Set<() => void>();
/** Set when the footer link reopens the banner, so a stored choice can be changed. */
let reopened = false;

function read(): Consent {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : "unset";
  } catch {
    // Private mode, or storage blocked: treat it as no consent given.
    return "unset";
  }
}

/**
 * Some browsers and extensions send a machine-readable "do not sell or share" signal. Treating
 * it as a decline costs us nothing and is the behaviour those visitors asked for.
 */
function signalsOptOut() {
  return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

export function subscribeToConsent(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

export function getConsentSnapshot(): ConsentSnapshot {
  if (reopened) return "unset";
  return signalsOptOut() ? "denied" : read();
}

export const getConsentServerSnapshot = (): ConsentSnapshot => "ssr";

const emit = () => listeners.forEach((l) => l());

export function setConsent(value: Exclude<Consent, "unset">) {
  reopened = false;
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // If we cannot remember the choice, honour it for this page view at least.
  }
  // Withdrawing after accepting: the tags are already running and their cookies are already
  // set, and React cannot unload a script. Clear what they left and reload into a clean page,
  // so withdrawing is as effective as never having accepted.
  if (value === "denied" && "dataLayer" in window) {
    clearAnalyticsCookies();
    window.location.reload();
    return;
  }
  emit();
}

/** Google's analytics cookies, on this host and on the registrable domain. */
function clearAnalyticsCookies() {
  const domains = [location.hostname, `.${location.hostname}`, `.${location.hostname.split(".").slice(-2).join(".")}`];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (!name || !/^(_ga|_gid|_gat|_gcl)/.test(name)) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
}

export function reopenConsent() {
  reopened = true;
  emit();
}
