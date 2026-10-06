// The Notion compare page. Its argument is building against working: Notion is a blank canvas
// somebody has to build client work on, connect to a chat tool and a video tool, and keep alive,
// and the client still gets a page. Kolabr is ready the day you open a channel, and the client
// gets a working relationship. The words live in content/pages/compare-notion.json; the shape
// stays here (see lib/content-store.ts).

import { assertCheckedDate } from "./checked-date";
import type { Comparison } from "./compare";
import { loadContent } from "./content-store";
import type { Card, Rich, Shot } from "./use-cases";

/** When Notion's figures were last checked against notion.com/pricing. */
export const NOTION_PRICES_CHECKED = "6 October 2026";

export type NotionComparison = Pick<Comparison, "competitor" | "table" | "faq" | "proof" | "cta"> & {
  hero: { eyebrow: string; title: string; lede: Rich; image: Shot; chip: { title: string; body: string } };
  /** Two checklists: what you build in Notion before client work runs, what a Kolabr channel already has. */
  build: {
    id: string;
    title: string;
    lede: Rich;
    notion: { title: string; items: { text: string; note?: string }[]; footer: string };
    kolabr: { title: string; actions: string[]; includedLabel: string; included: string[]; footer: string };
  };
  /** Two drawn screens: what a guest sees in each. */
  walkIn: {
    id: string;
    title: string;
    lede: Rich;
    notion: { label: string; caption: string; breadcrumb: string; page: string; comment: { name: string; text: string } };
    kolabr: {
      label: string;
      caption: string;
      channel: string;
      incoming: string;
      outgoing: string;
      request: { id: string; title: string; due: string };
      wiki: string;
      event: string;
    };
  };
  owner: { id: string; title: string; lede: Rich; points: Card[] };
  /**
   * The price band, at #cost: two receipts. Notion's lines are written out here; Kolabr's prices
   * come from lib/pricing.ts so they always match /pricing.
   */
  cost: {
    title: string;
    lede: Rich;
    notion: { label: string; lines: { name: string; price: string }[]; total: string };
    kolabr: { label: string; lines: string[] };
    totalLabel: string;
    scale: { title: string; notion: Rich; kolabr: Rich };
    note: Rich;
  };
};

const KEYS = ["competitor", "hero", "build", "walkIn", "owner", "cost", "table", "faq", "proof", "cta"] as const;

function load(): NotionComparison {
  const data = loadContent<NotionComparison>("compare-notion");
  const missing = KEYS.filter((k) => !(k in data));
  if (missing.length) throw new Error(`Content file compare-notion.json is missing: ${missing.join(", ")}`);
  assertCheckedDate(data, NOTION_PRICES_CHECKED, "compare-notion.json", "lib/compare-notion.ts");
  return data;
}

export const notionComparison = load();
