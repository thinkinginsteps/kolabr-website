// Content for the compare pages that share one layout. Slack, Basecamp and Notion have their own
// shapes (lib/compare-slack.ts, lib/compare-basecamp.ts, lib/compare-notion.ts).
// Originally extracted from design/Compare - *.dc.html and since rewritten: the structure below
// is ours, not the design's. Competitor prices date quickly, so re-check every figure before launch.

import type { Card, Rich, Shot } from "./use-cases";

/** A labelled line: the lead is set in bold, the text follows it. */
export type Step = { lead: string; text: Rich };

export type CompareSection =
  | { type: "reasons"; id: string; title: string; paragraphs: Rich[]; image: Shot; reasons: { lead: string; text: string }[] }
  | { type: "shotCards"; id: string; title: string; lede: Rich; image: Shot; cards: Card[] }
  | { type: "cards"; id: string; title: string; lede: Rich; cards: Card[] };

export type Comparison = {
  competitor: string;
  /**
   * The two cards under the headline. `note` is the fine print beneath one of them: where a
   * card quotes money, it says which terms the figures are on, so a reader who has seen the
   * competitor's own advertised annual price does not think we inflated it.
   */
  hero: { eyebrow: string; title: string; lede: Rich; summary: (Card & { note?: string })[] };
  statement: { id: string; title: string; paragraphs: Rich[]; image: Shot };
  table: { title: string; lede: Rich; groups: { title: string; rows: [Rich, Rich, Rich][] }[] };
  sections: CompareSection[];
  /**
   * What the reader has by the end of the first month. It sits immediately above the price so
   * that the price is read against something, rather than on its own.
   */
  outcome: { title: string; lede: Rich; items: Step[] };
  cost: {
    title: string;
    paragraphs: Rich[];
    note: Rich;
    kolabr: { name: string; price: string; text: string };
    other: { name: string; price: string; text: string };
  };
  faq: { title: string; items: Card[] };
  /** One week, three checkpoints. The last thing before the call to action. */
  proof: { title: string; lede: Rich; steps: Step[] };
  cta: { title: string; body: string; disclaimer: string };
};

// The words live in content/pages/compare.json, which the back office edits. The types and the
// key list below stay here on purpose: code owns the shape, content owns the words, so an edit
// can change what a page says but never what a page expects.

import { loadContent, requireKeys } from "./content-store";

export const COMPARE_SLUGS = [
  "slack",
  "basecamp",
  "notion",
  "clickup",
  "zendesk",
] as const;

export type CompareSlug = (typeof COMPARE_SLUGS)[number];

/** The compare pages on the shared layout. Slack, Basecamp and Notion have their own content files. */
const OWN_LAYOUT = ["slack", "basecamp", "notion"] as const;
export type SharedCompareSlug = Exclude<CompareSlug, (typeof OWN_LAYOUT)[number]>;
const SHARED_SLUGS = COMPARE_SLUGS.filter((s): s is SharedCompareSlug => !(OWN_LAYOUT as readonly string[]).includes(s));

export const comparisons = requireKeys(
  loadContent<Record<SharedCompareSlug, Comparison>>("compare"),
  SHARED_SLUGS,
  "compare",
);
