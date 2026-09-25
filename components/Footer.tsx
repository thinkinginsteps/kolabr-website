import { footer } from "@/lib/navigation";
import { SIGNUP_PATH } from "@/lib/site";
import { ButtonLink } from "./ButtonLink";
import { Logo } from "./Logo";
import { CookieSettingsButton } from "./analytics/CookieSettingsButton";
import { SmartLink } from "./SmartLink";

export function Footer({ ctaLabel }: { ctaLabel: string }) {
  return (
    <footer className="bg-footer px-5 py-[86px] text-on-deep-muted tab:px-10 tab:pt-[76px] tab:pb-10">
      <div className="mx-auto grid max-w-content grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-10 text-[15px] desk:grid-cols-[2fr_repeat(4,minmax(0,1fr))]">
        <div className="flex max-w-[300px] flex-col gap-[18px]">
          <Logo className="h-6 w-auto self-start text-on-deep" />
          <p className="leading-[1.55]">
            One shared channel for your team and the clients, partners and suppliers you work with.
          </p>
          <p className="leading-[1.55]">You pay for your team. Guests you invite join free.</p>
          <ButtonLink href={SIGNUP_PATH} variant="onDeep" className="self-start">
            {ctaLabel}
          </ButtonLink>
        </div>

        {footer.columns.map((col) => (
          <nav key={col.title} aria-label={col.title} className="flex flex-col gap-[11px]">
            <span className="font-semibold text-on-deep">{col.title}</span>
            {col.links.map((link) => (
              <SmartLink key={link.label} href={link.href} className="text-on-deep-muted hover:text-on-deep">
                {link.label}
              </SmartLink>
            ))}
          </nav>
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-content flex-wrap justify-between gap-3 border-t border-footer-rule pt-6 text-[14px]">
        <span>© 2026 Kolabr</span>
        <nav aria-label="Legal" className="flex flex-wrap gap-6">
          {footer.legal.map((link) => (
            <SmartLink key={link.href} href={link.href} className="text-on-deep-muted hover:text-on-deep">
              {link.label}
            </SmartLink>
          ))}
          <CookieSettingsButton className="text-on-deep-muted hover:text-on-deep" />
        </nav>
      </div>
    </footer>
  );
}
