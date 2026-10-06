// The Basecamp compare page. Its argument: Basecamp keeps a to-do list per project, Kolabr runs
// the client relationship live. It shows one ordinary day in each, then what a to-do list was
// never built to do, then what each plan pays for. The words live in
// content/pages/compare-basecamp.json; the shape stays here (see lib/content-store.ts).

import { BASECAMP_PRICES_CHECKED } from "./basecamp-cost";
import { assertCheckedDate } from "./checked-date";
import type { Comparison } from "./compare";
import { loadContent } from "./content-store";
import type { Card, Rich, Shot } from "./use-cases";

/** A small drawing on a "beyond" tile, built from the shared sketch pieces. */
export type TileSketch =
  | { kind: "call"; heading: string; chips: string[] }
  | { kind: "rows"; heading: string; rows: { label: string; value: string }[] }
  | { kind: "wiki"; heading: string; articles: { title: string; meta: string; suggested?: boolean }[] }
  | { kind: "playbook"; heading: string; steps: { text: string; owner: string; due: string; done: boolean }[] }
  | { kind: "channels"; heading: string; items: string[]; more: string };

/** One moment of the day: what happens in Basecamp, and what happens in Kolabr. */
export type DayStep = {
  time: string;
  basecamp: Rich;
  kolabr: { title: string; text: Rich; chip: { label: string; tone: "accent" | "risk" } };
};

export type BasecampComparison = Pick<Comparison, "competitor" | "statement" | "table" | "faq" | "proof" | "cta"> & {
  hero: { eyebrow: string; title: string; lede: Rich; image: Shot; chip: { title: string; body: string } };
  tuesday: { id: string; title: string; lede: Rich; steps: DayStep[] };
  beyond: { id: string; title: string; lede: Rich; tiles: (Card & { sketch: TileSketch })[] };
  /**
   * The price band, at #cost: each product's plans side by side. Basecamp's plans are written out
   * here; Kolabr's prices and features come from lib/pricing.ts, so they always match /pricing.
   */
  cost: {
    title: string;
    lede: Rich;
    basecamp: {
      tag: string;
      unit: string;
      plans: { name: string; price: string; terms?: string; limits: string[] }[];
      same: { title: string; text: Rich };
    };
    kolabr: { tag: string; unit: string; same: { title: string; text: Rich } };
    note: Rich;
  };
};

const KEYS = ["competitor", "hero", "tuesday", "beyond", "statement", "cost", "table", "faq", "proof", "cta"] as const;

function load(): BasecampComparison {
  const data = loadContent<BasecampComparison>("compare-basecamp");
  const missing = KEYS.filter((k) => !(k in data));
  if (missing.length) throw new Error(`Content file compare-basecamp.json is missing: ${missing.join(", ")}`);
  if (data.beyond.tiles.length !== 6) throw new Error("compare-basecamp.json: the beyond grid is laid out for exactly six tiles");
  assertCheckedDate(data, BASECAMP_PRICES_CHECKED, "compare-basecamp.json", "lib/basecamp-cost.ts");
  return data;
}

export const basecampComparison = load();
