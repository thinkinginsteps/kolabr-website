"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The design's scroll reveal. Elements marked `data-rise` that start below the fold fade and
 * rise 26px into place when they scroll into view; siblings inside a `data-rise-group`
 * stagger by 75ms (capped at six steps). Anything already on screen at load is left alone,
 * and nothing happens under prefers-reduced-motion. Transform and opacity only, so it never
 * moves layout, and the content is fully visible without JavaScript.
 *
 * Which elements start hidden is decided by the observer's own first callback rather than by
 * measuring each one: reading positions here forced a full layout of the page during
 * hydration, which on the long home page cost more than half a second of blocking time.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const TRANSITION = "opacity .6s cubic-bezier(.2,.7,.2,1), transform .6s cubic-bezier(.2,.7,.2,1)";
    // Elements the observer has already reported on once, so we can tell "was below the fold
    // at load" from "has just scrolled into view".
    const seen = new WeakSet<Element>();

    const reveal = (el: HTMLElement) => {
      const group = el.closest("[data-rise-group]");
      const i = group ? [...group.querySelectorAll("[data-rise]")].indexOf(el) : 0;
      el.style.transitionDelay = `${Math.min(i, 6) * 75}ms`;
      el.style.opacity = "1";
      el.style.transform = "none";
      // Hand the element back to its own CSS once revealed, so hover transitions are not
      // slowed by the reveal's duration and stagger delay.
      el.addEventListener(
        "transitionend",
        () => {
          el.style.removeProperty("transition");
          el.style.removeProperty("transition-delay");
          el.style.removeProperty("transform");
          el.style.removeProperty("opacity");
        },
        { once: true },
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const el = entry.target as HTMLElement;
          const first = !seen.has(el);
          seen.add(el);

          if (entry.isIntersecting) {
            // On screen at load: leave it exactly as rendered. Later: animate it in.
            if (!first) reveal(el);
            io.unobserve(el);
            continue;
          }
          // Below the fold at load: hide it now so it has somewhere to rise from.
          if (first) {
            el.style.opacity = "0";
            el.style.transform = "translateY(26px)";
            el.style.transition = TRANSITION;
          }
        }
      },
      // The design starts a reveal slightly before the element's top edge reaches the fold.
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" },
    );

    for (const el of document.querySelectorAll<HTMLElement>("[data-rise]")) io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
