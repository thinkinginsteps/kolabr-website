"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { getConsentServerSnapshot, getConsentSnapshot, setConsent, subscribeToConsent } from "@/lib/consent";
import { GA_ID, GTM_ID } from "@/lib/site";

/**
 * Every analytics tool the site loads goes through here, so pages never mention one and a
 * second tool can be added in one place. Nothing loads until the visitor accepts: no script,
 * no cookie, no request to Google.
 *
 * Google Tag Manager is the normal path: tags are configured in the container rather than in
 * this code. The direct GA4 loader is kept for an environment that has a measurement ID but no
 * container. If both are set, the container wins, because GA4 configured in both places would
 * count every visit twice.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Consent Mode, pushed before the container so tags inside it start in the right state.
 * Analytics storage is granted (the visitor just accepted); advertising stays denied, because
 * the banner does not ask for it and the site does not advertise.
 */
const CONSENT_MODE = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});
gtag('consent','update',{analytics_storage:'granted'});`;

function TagManager({ id }: { id: string }) {
  return (
    <>
      <Script id="consent-mode" strategy="afterInteractive">
        {CONSENT_MODE}
      </Script>
      {/* The standard container snippet. Google's install page also gives a <noscript> iframe;
          it is left out on purpose, because it would load the container for visitors without
          JavaScript, who can never have accepted the banner. */}
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;
j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`}
      </Script>
    </>
  );
}

/**
 * Moving between pages here is a client-side navigation: no new document, so the container
 * only ever sees the first page. This pushes a page_view event for the ones after it, which a
 * GA4 tag in the container can trigger on (see docs/seo.md).
 */
function RouteChanges() {
  const pathname = usePathname();
  const last = useRef(pathname);
  useEffect(() => {
    if (last.current === pathname) return;
    last.current = pathname;
    window.dataLayer?.push({ event: "page_view", page_path: pathname, page_title: document.title });
  }, [pathname]);
  return null;
}

function GoogleAnalytics({ id }: { id: string }) {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`${CONSENT_MODE}
gtag('js',new Date());
gtag('config','${id}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}

export function Analytics() {
  const consent = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, getConsentServerSnapshot);
  const granted = consent === "granted";
  return (
    <>
      {granted && (GTM_ID ? <TagManager id={GTM_ID} /> : GA_ID ? <GoogleAnalytics id={GA_ID} /> : null)}
      {granted && (GTM_ID || GA_ID) && <RouteChanges />}
      {consent === "unset" && <ConsentBanner onChoose={setConsent} />}
    </>
  );
}

function ConsentBanner({ onChoose }: { onChoose: (value: "granted" | "denied") => void }) {
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-h"
      className="glass-strong fixed inset-x-4 bottom-4 z-70 mx-auto flex max-w-[640px] flex-col gap-3.5 rounded-[20px] p-5 shadow-card max-tab:bottom-3"
    >
      <div className="flex flex-col gap-1.5">
        <h2 id="consent-h" className="text-[16px] font-semibold text-ink">
          Analytics cookies
        </h2>
        <p className="text-[14.5px] leading-[1.5] text-pretty text-ink-muted">
          We would like to count visits so we know which pages are worth writing. Nothing loads unless you accept, and we do not
          advertise to you either way. Details in our{" "}
          <a href="/cookies/" className="border-b-2 border-accent pb-px text-ink hover:text-ink">
            cookie policy
          </a>
          .
        </p>
      </div>
      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => onChoose("granted")}
          className="lift cursor-pointer rounded-[13px] bg-ink px-[18px] py-[11px] text-[15px] leading-[normal] font-semibold text-on-ink"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => onChoose("denied")}
          className="lift glass-soft cursor-pointer rounded-[13px] border border-border px-[18px] py-[11px] text-[15px] leading-[normal] font-semibold text-ink [--lift-shadow:var(--shadow-sm)]"
        >
          Decline
        </button>
      </div>
    </div>
  );
}
