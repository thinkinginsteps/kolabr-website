// Shapes shared by the compare pages. Each page builds its own type from these
// (lib/compare-slack.ts, compare-basecamp.ts, compare-notion.ts, compare-clickup.ts, compare-zendesk.ts).
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

// Every compare page has its own content file and layout (lib/compare-<slug>.ts). The types above
// are the pieces they share; the list below is the only list of compare routes.

export const COMPARE_SLUGS = ["slack", "basecamp", "notion", "clickup", "zendesk"] as const;

export type CompareSlug = (typeof COMPARE_SLUGS)[number];
