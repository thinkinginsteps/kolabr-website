"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { megaMenu, mobileMenu, primaryLinks } from "@/lib/navigation";
import { SIGN_IN_HREF, SIGNUP_PATH } from "@/lib/site";
import { ButtonLink } from "./ButtonLink";
import { Logo } from "./Logo";
import { SmartLink } from "./SmartLink";
import { TrialPromo } from "./TrialPromo";

type Menu = "product" | "cases" | "compare" | null;

// Hover-intent delay before a mega menu closes, as in the design.
const CLOSE_DELAY = 260;

/**
 * Fixed glass nav with three mega menus (hover, or click to toggle) and a full menu sheet
 * below 1080px. Menu panels are always in the DOM and toggled with `hidden`, so their
 * links and copy are in the HTML at build time.
 */
export function Nav({ ctaLabel }: { ctaLabel: string }) {
  const [menu, setMenu] = useState<Menu>(null);
  const [sheet, setSheet] = useState(false);
  // Which group is expanded in the menu sheet. One at a time, so the sheet stays short.
  const [group, setGroup] = useState<Menu>(null);
  const toggleGroup = (g: Menu) => setGroup((cur) => (cur === g ? null : g));
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);
  // A mouse click lands right after the hover that opened the menu. Only a click on a menu
  // that a click opened closes it; otherwise hover-then-click would open and shut at once.
  const openedByClick = useRef(false);

  const open = useCallback((m: Menu) => {
    cancelClose();
    setMenu((cur) => {
      if (cur !== m) openedByClick.current = false;
      return m;
    });
  }, [cancelClose]);
  const toggle = (m: Menu) => {
    cancelClose();
    const close = menu === m && openedByClick.current;
    openedByClick.current = !close;
    setMenu(close ? null : m);
  };
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = setTimeout(() => setMenu(null), CLOSE_DELAY);
  }, [cancelClose]);

  // Close everything on navigation (adjusting state during render, not in an effect) and on Escape.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenu(null);
    setSheet(false);
    setGroup(null);
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setSheet(false);
        setGroup(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      cancelClose();
    };
  }, [cancelClose]);

  const trigger = (m: Exclude<Menu, null>, label: string) => (
    <button
      type="button"
      aria-expanded={menu === m}
      aria-controls={`menu-${m}`}
      onMouseEnter={() => open(m)}
      onClick={() => toggle(m)}
      className="hover-tint flex cursor-pointer items-center gap-1.5 rounded-xl px-[13px] py-[9px] whitespace-nowrap text-ink max-[1200px]:px-3"
    >
      {label}
      <span
        aria-hidden="true"
        className={`-mt-[3px] block size-1.5 border-r-[1.6px] border-b-[1.6px] border-ink-muted transition-transform duration-300 ease-out-soft ${
          menu === m ? "rotate-[225deg]" : "rotate-45"
        }`}
      />
    </button>
  );

  const plainLink = (href: "/" | "/pricing" | "/contact" | "/blog", label: string) => (
    <Link
      href={href}
      onMouseEnter={scheduleClose}
      className="hover-tint rounded-xl px-[13px] py-[9px] whitespace-nowrap text-ink hover:text-ink max-[1200px]:px-3"
    >
      {label}
    </Link>
  );

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[14px] z-60 px-6">
      <div onMouseLeave={scheduleClose} className="pointer-events-auto relative mx-auto max-w-content">
        <nav
          aria-label="Main"
          className="relative flex h-[62px] items-center justify-between gap-5 rounded-[20px] pr-[14px] pl-[22px] shadow-subtle"
        >
          <span aria-hidden="true" className="glass absolute inset-0 z-0 rounded-[20px]" />
          <Link href="/" aria-label="Kolabr home" className="relative z-1 flex flex-none items-center">
            <Logo decorative className="block h-[23px] w-auto text-ink" />
          </Link>

          <div className="relative z-1 hidden gap-0.5 text-[15.5px] font-semibold text-ink desk:flex">
            {plainLink(primaryLinks.home.href, primaryLinks.home.label)}
            {trigger("product", "Product")}
            {plainLink(primaryLinks.pricing.href, primaryLinks.pricing.label)}
            {trigger("cases", "Use cases")}
            {trigger("compare", "Compare")}
            {plainLink(primaryLinks.blog.href, primaryLinks.blog.label)}
            {plainLink(primaryLinks.contact.href, primaryLinks.contact.label)}
          </div>

          <div className="relative z-1 flex flex-none items-center gap-2">
            <button
              type="button"
              aria-expanded={sheet}
              aria-controls="menu-sheet"
              aria-label={sheet ? "Close menu" : "Open menu"}
              onClick={() => {
                setSheet((s) => !s);
                setMenu(null);
                setGroup(null);
              }}
              className="flex size-[42px] cursor-pointer items-center justify-center rounded-xl bg-surface-tint text-ink desk:hidden"
            >
              <Burger open={sheet} />
            </button>
            <ButtonLink href={SIGN_IN_HREF} variant="secondary" size="sm" className="max-tab:hidden">
              Sign in
            </ButtonLink>
            {/* The trial button crowds the phone bar, so below 701px it lives in the sheet instead. */}
            <ButtonLink href={SIGNUP_PATH} size="sm" className="max-tab:hidden">
              {ctaLabel}
            </ButtonLink>
          </div>
        </nav>

        <Panel id="menu-product" open={menu === "product"} onEnter={cancelClose} onLeave={scheduleClose} width="1132px">
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_290px] gap-[26px]">
            {megaMenu.productColumns.map((col, i) => (
              <div key={i} className="flex flex-col gap-1">
                {col.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="hover-tint flex flex-col gap-0.5 rounded-[13px] px-3 py-[11px] hover:text-ink"
                  >
                    <span className="text-[15.5px] font-semibold text-ink">{item.label}</span>
                    <span className="text-[13.5px] leading-[1.4] text-ink-muted">{item.blurb}</span>
                  </Link>
                ))}
              </div>
            ))}
            <TrialPromo />
          </div>
        </Panel>

        <Panel id="menu-cases" open={menu === "cases"} onEnter={cancelClose} onLeave={scheduleClose} width="1132px">
          <div className="grid grid-cols-[minmax(0,2.6fr)_minmax(0,1fr)] gap-[30px]">
            <div className="flex flex-col gap-3">
              <PanelLabel className="px-2.5">By industry</PanelLabel>
              <div className="grid grid-cols-3 gap-0.5 text-[15px] font-semibold">
                {megaMenu.useCases.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="hover-tint rounded-[11px] px-2.5 py-[9px] text-ink hover:text-ink"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <TrialPromo className="mt-2" />
            </div>
          </div>
        </Panel>

        <Panel id="menu-compare" open={menu === "compare"} onEnter={cancelClose} onLeave={scheduleClose} width="872px">
          <div className="flex flex-col gap-4">
            <PanelLabel className="px-0.5">Kolabr compared</PanelLabel>
            <div className="grid grid-cols-3 gap-2.5">
              {megaMenu.compare.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col gap-1 rounded-[14px] bg-surface-tint p-4 hover:text-ink"
                >
                  <span className="text-[15.5px] font-semibold text-ink">vs {item.label}</span>
                  <span className="text-[13px] leading-[1.4] text-ink-muted">{item.blurb}</span>
                </Link>
              ))}
            </div>
          </div>
        </Panel>

        <nav
          id="menu-sheet"
          aria-label="Menu"
          hidden={!sheet}
          className="glass-strong mt-2.5 max-h-[calc(100vh-130px)] animate-sheet flex-col overflow-auto rounded-[22px] p-3.5 shadow-card [&:not([hidden])]:flex"
        >
          <div className="flex flex-col divide-y divide-rule-soft">
            <SheetLink href={primaryLinks.home.href} label={primaryLinks.home.label} />
            <SheetGroup title="Product" links={mobileMenu.product} open={group === "product"} onToggle={() => toggleGroup("product")} />
            <SheetGroup title="Use cases" links={mobileMenu.useCases} open={group === "cases"} onToggle={() => toggleGroup("cases")} />
            <SheetGroup title="Compare" links={mobileMenu.compare} open={group === "compare"} onToggle={() => toggleGroup("compare")} />
            <SheetLink href={primaryLinks.pricing.href} label={primaryLinks.pricing.label} />
            <SheetLink href={primaryLinks.contact.href} label={primaryLinks.contact.label} />
            <SheetLink href={primaryLinks.blog.href} label={primaryLinks.blog.label} />
          </div>
          {/* Below 701px the bar carries no buttons, so the sheet closes with them. */}
          <div className="flex flex-col gap-1.5 pt-3.5 tab:hidden">
            <ButtonLink href={SIGNUP_PATH} size="sm" className="w-full py-3.5">
              {ctaLabel}
            </ButtonLink>
            <SmartLink
              href={SIGN_IN_HREF}
              className="rounded-xl py-2.5 text-center text-[15.5px] font-semibold text-ink-muted hover:text-ink"
            >
              Sign in
            </SmartLink>
          </div>
        </nav>
      </div>
    </div>
  );
}

/** Three bars that fold into a cross when the sheet opens. Transform and opacity only. */
function Burger({ open }: { open: boolean }) {
  const bar = "absolute left-0 h-0.5 w-full rounded-full bg-current transition-[transform,opacity] duration-300 ease-out-soft";
  return (
    <span aria-hidden="true" className="relative block h-[14px] w-[18px]">
      <span className={`${bar} top-0 ${open ? "translate-y-1.5 rotate-45" : ""}`} />
      <span className={`${bar} top-1.5 ${open ? "opacity-0" : ""}`} />
      <span className={`${bar} top-3 ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
    </span>
  );
}

// Widths are the design's rendered size: it has no border-box reset, so its 26px padding sits
// outside min(1080px, 100%) / min(820px, 100%). Here the padding is inside and capped at 100%.
function Panel({
  id,
  open,
  onEnter,
  onLeave,
  width,
  children,
}: {
  id: string;
  open: boolean;
  onEnter: () => void;
  onLeave: () => void;
  width: string;
  children: ReactNode;
}) {
  return (
    <div
      id={id}
      hidden={!open}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{ width: `min(${width}, 100%)` }}
      className="glass-strong mx-auto mt-2.5 animate-sheet rounded-3xl p-[26px] shadow-card"
    >
      {children}
    </div>
  );
}

function PanelLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`text-[11.5px] font-semibold tracking-[0.1em] text-ink-muted uppercase ${className}`}>{children}</span>
  );
}

// Every top-level entry in the sheet is the same 52px row, so the list reads as one column.
const SHEET_ROW = "flex w-full items-center justify-between rounded-[14px] px-3.5 py-[15px] text-[17px] font-semibold text-ink";

type SheetHref = Parameters<typeof SmartLink>[0]["href"];

function SheetLink({ href, label }: { href: SheetHref; label: string }) {
  return (
    <SmartLink href={href} className={`hover-tint ${SHEET_ROW} hover:text-ink`}>
      {label}
    </SmartLink>
  );
}

/**
 * An expanding group in the menu sheet (Product, Use cases, Compare). The heading is a row like
 * any other; its links sit indented behind a rule and stay in the DOM whether it is open or not.
 */
function SheetGroup({
  title,
  links,
  open,
  onToggle,
}: {
  title: string;
  links: { label: string; href: SheetHref }[];
  open: boolean;
  onToggle: () => void;
}) {
  const id = `sheet-${title.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div className="flex flex-col">
      <button type="button" aria-expanded={open} aria-controls={id} onClick={onToggle} className={`hover-tint cursor-pointer ${SHEET_ROW}`}>
        {title}
        <span
          aria-hidden="true"
          className={`-mt-[3px] block size-2 border-r-[1.6px] border-b-[1.6px] border-ink-muted transition-transform duration-300 ease-out-soft ${
            open ? "rotate-[225deg]" : "rotate-45"
          }`}
        />
      </button>
      <div id={id} hidden={!open} className="mb-1.5 ml-3.5 flex-col border-l border-rule-soft pl-2 [&:not([hidden])]:flex">
        {links.map((l) => (
          <SmartLink
            key={l.label}
            href={l.href}
            className="hover-tint rounded-xl px-3 py-2.5 text-[15.5px] text-ink-muted hover:text-ink"
          >
            {l.label}
          </SmartLink>
        ))}
      </div>
    </div>
  );
}
