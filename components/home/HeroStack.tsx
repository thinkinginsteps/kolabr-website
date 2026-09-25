"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";

export type HeroShot = { label: string; image: StaticImageData; alt: string };

// Positions in the stack, straight from the design: the front card leads the move and comes
// up to full opacity fast; the cards behind step back and to the right, then rotate round.
const BASE = "rotateY(-19deg) rotateX(5deg) rotate(.8deg)";
const EASE = "cubic-bezier(.16,.84,.28,1)";
const STEPS = [
  { t: `translateY(-50%) ${BASE} translate3d(0,0,0) scale(1)`, o: 1, z: 4, tr: `transform .95s ${EASE}, opacity .4s ease` },
  { t: `translateY(-44%) ${BASE} translate3d(3%,0,-110px) scale(.975)`, o: 0.6, z: 3, tr: `transform .95s ${EASE} .12s, opacity .5s ease .25s` },
  { t: `translateY(-40%) ${BASE} translate3d(5%,0,-200px) scale(.955)`, o: 0.42, z: 2, tr: `transform .95s ${EASE} .18s, opacity .5s ease .3s` },
  { t: `translateY(-36%) ${BASE} translate3d(7%,0,-300px) scale(.935)`, o: 0.24, z: 1, tr: `transform .8s ${EASE} .34s, opacity .3s ease` },
];
const INTERVAL = 4200;

/**
 * The Home hero's rotating stack of app screenshots. Below 1080px it becomes a single flat
 * frame showing whichever shot is in front. Rotation stops under prefers-reduced-motion.
 */
export function HeroStack({ shots }: { shots: HeroShot[] }) {
  const [front, setFront] = useState(0);
  const n = shots.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setFront((f) => (f + 1) % n), INTERVAL);
    return () => clearInterval(id);
  }, [n]);

  return (
    <figure className="relative m-0 min-h-[min(600px,56svh)] self-center perspective-[1800px] max-desk:min-h-0 max-desk:perspective-none">
      {shots.map((shot, i) => {
        const pos = (i - front + n) % n;
        const step = STEPS[Math.min(pos, STEPS.length - 1)];
        return (
          <div
            key={shot.label}
            aria-hidden={pos !== 0}
            style={{ transform: step.t, opacity: step.o, zIndex: step.z, transition: step.tr }}
            className={`absolute top-[calc(50%-30px)] left-[18px] w-[min(940px,calc(52svh*1.662))] origin-left overflow-hidden rounded-3xl bg-surface shadow-float will-change-transform max-desk:!static max-desk:!w-full max-desk:!transform-none max-desk:!opacity-100 ${
              pos === 0 ? "" : "max-desk:hidden"
            }`}
          >
            <div className="flex h-[34px] items-center gap-[7px] border-b border-border bg-surface-tint px-3.5">
              <span className="size-[9px] rounded-full bg-border" />
              <span className="size-[9px] rounded-full bg-border" />
              <span className="size-[9px] rounded-full bg-border" />
              <span className="ml-3 text-[11.5px] tracking-[0.01em] text-ink-muted">
                Northwind Trading · Payments · {shot.label}
              </span>
            </div>
            <Image
              src={shot.image}
              alt={shot.alt}
              sizes="(max-width: 1080px) 100vw, 940px"
              preload={i === 0}
              className="block h-auto w-full"
            />
          </div>
        );
      })}
    </figure>
  );
}
