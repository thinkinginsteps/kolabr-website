"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

/**
 * Light / dark comparison: drag anywhere on the image (or use the arrow keys when focused)
 * to move the divider. The dark image is revealed from the divider rightwards, as in the design.
 */
export function RevealSlider({
  light,
  dark,
  lightAlt,
  darkAlt,
  initial = 58,
}: {
  light: StaticImageData;
  dark: StaticImageData;
  lightAlt: string;
  darkAlt: string;
  initial?: number;
}) {
  const [pct, setPct] = useState(initial);
  const wrap = useRef<HTMLDivElement>(null);

  const fromPointer = (clientX: number) => {
    const el = wrap.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPct(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    fromPointer(e.clientX);
    const move = (ev: globalThis.PointerEvent) => fromPointer(ev.clientX);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 20 : 5;
    if (e.key === "ArrowLeft") setPct((p) => Math.max(0, p - step));
    else if (e.key === "ArrowRight") setPct((p) => Math.min(100, p + step));
    else if (e.key === "Home") setPct(0);
    else if (e.key === "End") setPct(100);
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={wrap}
      role="slider"
      tabIndex={0}
      aria-label="Compare light and dark mode"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      aria-valuetext={`${Math.round(100 - pct)}% dark mode showing`}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      className="relative cursor-ew-resize touch-none overflow-hidden rounded-[20px] bg-surface shadow-shot select-none"
    >
      <Image src={light} alt={lightAlt} preload sizes="(max-width: 1480px) 100vw, 1400px" className="pointer-events-none block h-auto w-full" />
      <Image
        src={dark}
        alt={darkAlt}
        sizes="(max-width: 1480px) 100vw, 1400px"
        className="pointer-events-none absolute inset-0 block size-full object-cover"
        style={{ clipPath: `inset(0 0 0 ${pct}%)` }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 w-0.5 bg-[rgba(255,255,255,.9)] shadow-[0_0_0_1px_rgba(51,80,91,.25)]"
        style={{ left: `${pct}%` }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 flex size-[46px] -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-[5px] rounded-full bg-surface shadow-[0_10px_30px_-8px_rgba(51,80,91,.5)]"
        style={{ left: `${pct}%` }}
      >
        <span className="size-[7px] rotate-45 border-b-2 border-l-2 border-deep" />
        <span className="size-[7px] rotate-45 border-t-2 border-r-2 border-deep" />
      </span>
    </div>
  );
}
