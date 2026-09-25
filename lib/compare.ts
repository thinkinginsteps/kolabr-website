// Content for the six compare pages. GENERATED from design/Compare - *.dc.html by a one-off
// extraction script, so the copy is the design's word for word; edit here from now on.
// Competitor prices are the design's and date quickly: re-check them before launch.

import type { Card, Rich, Shot } from "./use-cases";

export type CompareSection =
  | { type: "reasons"; id: string; title: string; paragraphs: Rich[]; image: Shot; reasons: { lead: string; text: string }[] }
  | { type: "shotCards"; id: string; title: string; lede: Rich; image: Shot; cards: Card[] }
  | { type: "cards"; id: string; title: string; lede: Rich; cards: Card[] };

export type Comparison = {
  competitor: string;
  hero: { eyebrow: string; title: string; lede: Rich; summary: Card[] };
  statement: { id: string; title: string; paragraphs: Rich[]; image: Shot };
  table: { title: string; lede: Rich; groups: { title: string; rows: [Rich, Rich, Rich][] }[] };
  sections: CompareSection[];
  cost: {
    title: string;
    paragraphs: Rich[];
    note: Rich;
    kolabr: { name: string; price: string; text: string };
    other: { name: string; price: string; text: string };
  };
  faq: { title: string; items: Card[] };
  cta: { title: string; body: string; disclaimer: string };
};

// The words live in content/pages/compare.json, which the back office edits. The types and the
// key list below stay here on purpose: code owns the shape, content owns the words, so an edit
// can change what a page says but never what a page expects.

import { loadContent, requireKeys } from "./content-store";

export const COMPARE_SLUGS = [
  "slack",
  "teams",
  "basecamp",
  "notion",
  "clickup",
  "zendesk",
] as const;

export type CompareSlug = (typeof COMPARE_SLUGS)[number];

export const comparisons = requireKeys(
  loadContent<Record<CompareSlug, Comparison>>("compare"),
  COMPARE_SLUGS,
  "compare",
);
