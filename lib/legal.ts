// Content for the four legal pages. GENERATED from design/{Privacy,Terms,Cookies,Refunds}.dc.html by a
// one-off extraction script, so the text is the design's word for word; edit here from now on.
// [COMPANY NAME] is a deliberate placeholder: these pages stay noindex and must not launch until the
// legal entity is supplied.

import type { Rich } from "./use-cases";

export type LegalBlock =
  | { p: Rich }
  | { h4: string }
  | { ul: Rich[] }
  | { table: { head: string[]; rows: Rich[][] } };

export type LegalPage = {
  eyebrow: string;
  title: string;
  lede: Rich;
  chips: string[];
  nav: { id: string; label: string }[];
  short: { title: string; body: Rich };
  sections: { id: string; num: string; title: string; blocks: LegalBlock[] }[];
  closing: { title: string; body: Rich };
};

// The words live in content/pages/legal.json, which the back office edits. The types and the
// key list below stay here on purpose: code owns the shape, content owns the words, so an edit
// can change what a page says but never what a page expects.

import { loadContent, requireKeys } from "./content-store";

export const LEGAL_SLUGS = [
  "privacy",
  "terms",
  "cookies",
  "refunds",
] as const;

export type LegalSlug = (typeof LEGAL_SLUGS)[number];

export const legalPages = requireKeys(
  loadContent<Record<LegalSlug, LegalPage>>("legal"),
  LEGAL_SLUGS,
  "legal",
);
