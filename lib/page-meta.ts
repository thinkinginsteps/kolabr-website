// Page titles and descriptions. Revised for search intent on 23 September 2026: the phrase
// people search for leads and the brand comes last, because "Kolabr" has no search demand yet.
// See docs/metadata-review.md for the before and after. Every title is 50 to 60 characters and
// every description 140 to 155. Edit here and in the review doc together.

export type PageMeta = { title: string; description: string; name: string; noindex?: boolean };

// The words live in content/pages/page-meta.json, which the back office edits. The types and the
// key list below stay here on purpose: code owns the shape, content owns the words, so an edit
// can change what a page says but never what a page expects.

import { loadContent, requireKeys } from "./content-store";

export const META_ROUTES = [
  "/",
  "/pricing/",
  "/blog/",
  "/about/",
  "/contact/",
  "/product/channels/",
  "/product/chat/",
  "/product/requests/",
  "/product/meetings/",
  "/product/wiki/",
  "/product/administration/",
  "/product/mobile-app/",
  "/product/details/",
  "/use-cases/schools/",
  "/use-cases/nonprofits/",
  "/use-cases/architecture-firms/",
  "/use-cases/engineering-firms/",
  "/use-cases/marketing-agencies/",
  "/use-cases/accounting-firms/",
  "/use-cases/law-firms/",
  "/use-cases/it-service-providers/",
  "/use-cases/construction/",
  "/use-cases/property-management/",
  "/use-cases/clinics/",
  "/use-cases/logistics/",
  "/use-cases/manufacturing/",
  "/compare/slack/",
  "/compare/teams/",
  "/compare/basecamp/",
  "/compare/notion/",
  "/compare/clickup/",
  "/compare/zendesk/",
  "/privacy/",
  "/terms/",
  "/cookies/",
  "/refunds/",
] as const;

export type MetaRoute = (typeof META_ROUTES)[number];

export const pageMeta = requireKeys(
  loadContent<Record<MetaRoute, PageMeta>>("page-meta"),
  META_ROUTES,
  "page-meta",
);
