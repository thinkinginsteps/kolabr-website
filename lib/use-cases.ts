// Content for the twelve use case pages built on the shared template (Schools has its own
// page). GENERATED from design/Use Case - *.dc.html by a one-off extraction script, so the copy
// is the design's word for word; edit here from now on. Links in rich text are {label, href}.

import type { Route } from "next";

export type Rich = string | (string | { label: string; href: Route })[];
export type Card = { title: string; body: Rich };
export type Shot = { file: string; alt: string };

export type UseCase = {
  hero: { eyebrow: string; title: string; lede: Rich; note?: Rich; image: Shot };
  channels: { title: string; lede: Rich; cards: Card[]; seatNote: Rich };
  requests: { id: string; title: string; lede: Rich; image: Shot; cards: Card[] };
  split: { id: string; title: string; lede: Rich; points: Card[]; image: Shot };
  site: { id: string; title: string; lede: Rich; image: Shot; cards: Card[] };
  calendar: { title: string; lede: Rich; image: Shot };
  oversight: {
    title: string;
    lede: Rich;
    image: Shot;
    wide: { title: string; body: Rich; link: { label: string; href: Route }; rows: { label: string; value: string; total?: boolean }[] };
    deep: { title: string; body: Rich; rows: { label: string; value: string; highlight?: boolean }[] };
    cards: Card[];
  };
  stages: { title: string; lede: Rich; cards: Card[] };
  cta: { title: string; body: string; primary: string };
};

// The words live in content/pages/use-cases.json, which the back office edits. The types and the
// key list below stay here on purpose: code owns the shape, content owns the words, so an edit
// can change what a page says but never what a page expects.

import { loadContent, requireKeys } from "./content-store";

export const USE_CASE_SLUGS = [
  "accounting-firms",
  "architecture-firms",
  "clinics",
  "construction",
  "engineering-firms",
  "it-service-providers",
  "law-firms",
  "logistics",
  "manufacturing",
  "marketing-agencies",
  "nonprofits",
  "property-management",
] as const;

export type UseCaseSlug = (typeof USE_CASE_SLUGS)[number];

export const useCaseContent = requireKeys(
  loadContent<Record<UseCaseSlug, UseCase>>("use-cases"),
  USE_CASE_SLUGS,
  "use-cases",
);

/** Schools uses the same pieces in its own order, so it has its own shape and its own file. */
export type SchoolsContent = {
  hero: UseCase["hero"];
  channels: UseCase["channels"];
  parents: UseCase["split"];
  requests: UseCase["requests"];
  calendar: { id: string; title: string; lede: Rich; image: Shot; cards: Card[] };
  wiki: { id: string; title: string; lede: Rich; image: Shot };
  oversight: UseCase["oversight"];
  stages: UseCase["stages"];
  cta: UseCase["cta"];
};

export const schoolsContent = loadContent<SchoolsContent>("use-case-schools");
