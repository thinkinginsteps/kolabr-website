// Questions and answers shown on each use case page, and the source of its FAQPage schema.
// GENERATED from docs/faq-review.md (approved 23 September 2026); every answer is drawn from
// what that page already says. Edit here and in the review doc together, and keep the schema
// honest: it must always match the words on the page.

export type Faq = { q: string; a: string };

// The words live in content/pages/use-case-faqs.json, which the back office edits. The types and the
// key list below stay here on purpose: code owns the shape, content owns the words, so an edit
// can change what a page says but never what a page expects.

import { loadContent, requireKeys } from "./content-store";

export const FAQ_SLUGS = [
  "schools",
  "nonprofits",
  "architecture-firms",
  "engineering-firms",
  "marketing-agencies",
  "accounting-firms",
  "law-firms",
  "it-service-providers",
  "construction",
  "property-management",
  "clinics",
  "logistics",
  "manufacturing",
] as const;

export const useCaseFaqs = requireKeys(
  loadContent<Record<(typeof FAQ_SLUGS)[number], Faq[]>>("use-case-faqs"),
  FAQ_SLUGS,
  "use-case-faqs",
);
