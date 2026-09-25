import Image, { type StaticImageData } from "next/image";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/site";

/** A phone screenshot with rounded corners. `raised` lifts it 34px (the middle phone in the hero). */
export function PhoneShot({ image, alt, raised = false, preload = false }: { image: StaticImageData; alt: string; raised?: boolean; preload?: boolean }) {
  return (
    <div className={`w-[min(268px,72vw)] flex-none overflow-hidden rounded-[26px] bg-surface shadow-float ${raised ? "mb-[34px]" : ""}`}>
      <Image src={image} alt={alt} preload={preload} sizes="268px" className="block h-auto w-full" />
    </div>
  );
}

const STORES = [
  { top: "Download on", bottom: "the App Store", href: APP_STORE_URL },
  { top: "Get it on", bottom: "Google Play", href: PLAY_STORE_URL },
];

/**
 * App Store and Google Play buttons. Until the store URLs exist they are badges rather than
 * links, with a "Coming soon" note underneath so the page does not promise a download it cannot
 * deliver. Setting APP_STORE_URL and PLAY_STORE_URL turns them into links and drops the note.
 */
export function StoreButtons({ className = "", align = "start" }: { className?: string; align?: "start" | "center" }) {
  const live = STORES.some((s) => s.href);
  return (
    <div className={`flex flex-col gap-2.5 ${align === "center" ? "items-center" : "items-start"} ${className}`}>
      <div className="flex flex-wrap gap-3">
      {STORES.map((s) => {
        const inner = (
          <>
            <span className="text-[12px] tracking-[0.06em] uppercase opacity-72">{s.top}</span>
            <span className="text-[17px] font-semibold tracking-[-0.01em]">{s.bottom}</span>
          </>
        );
        const cls = "flex flex-col rounded-[15px] bg-ink px-[22px] py-3 text-left text-on-ink";
        return s.href ? (
          <a key={s.bottom} href={s.href} className={`lift ${cls} [--lift-y:-3px] hover:text-on-ink`}>
            {inner}
          </a>
        ) : (
          <span key={s.bottom} className={cls}>
            {inner}
          </span>
        );
      })}
      </div>
      {!live && (
        <p className="text-[14px] font-semibold tracking-[0.02em] text-ink-muted">Coming soon to the App Store and Google Play</p>
      )}
    </div>
  );
}

/** Push notification cards (Mobile app page). */
export function NotificationList({
  items,
}: {
  items: { icon: string; tone: "alert" | "accent" | "ink"; title: string; body: string; smallBody?: boolean }[];
}) {
  const tone = { alert: "bg-status-breached", accent: "bg-accent", ink: "bg-ink" };
  return (
    <div className="flex flex-col gap-[11px] text-[14px]">
      {items.map((n) => (
        <span key={n.title} className="flex items-start gap-[11px] rounded-[14px] bg-surface px-4 py-3.5 shadow-subtle">
          <span
            aria-hidden="true"
            className={`flex size-[26px] flex-none items-center justify-center rounded-lg text-[12px] font-semibold text-on-ink ${tone[n.tone]}`}
          >
            {n.icon}
          </span>
          <span className="flex flex-col">
            <span className="font-semibold text-ink">{n.title}</span>
            <span className={`text-ink-muted ${n.smallBody ? "text-[13px]" : ""}`}>{n.body}</span>
          </span>
        </span>
      ))}
    </div>
  );
}
