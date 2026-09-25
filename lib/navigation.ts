import type { Route } from "next";
import type { CompareRoute, Href } from "./links";

// Navigation data for the Nav, mobile menu and Footer. Labels, blurbs and order come
// straight from design/*.dc.html. The design orders use cases differently in the mega
// menu, the mobile sheet and the footer, so each surface keeps its own order.

export type NavLink = { label: string; href: Href };
export type NavItem = { label: string; href: Route | CompareRoute; blurb: string };

export const product = {
  channels: { label: "Channels", href: "/product/channels", blurb: "The shared workspace everything else sits in" },
  chat: { label: "Channel chat", href: "/product/chat", blurb: "One conversation, plus direct and group chats" },
  requests: { label: "Requests", href: "/product/requests", blurb: "Owner, category, SLA and status on every item" },
  meetings: {
    label: "Scheduled Events",
    href: "/product/meetings",
    blurb: "Meetings and a channel calendar, synced with Google and Outlook",
  },
  wiki: { label: "Wiki", href: "/product/wiki", blurb: "A knowledge base inside the channel" },
  administration: {
    label: "Administration",
    href: "/product/administration",
    blurb: "Roles, routing, playbooks and the audit log",
  },
  mobile: { label: "Mobile app", href: "/product/mobile-app", blurb: "The free companion app for iOS and Android" },
  details: { label: "Small details", href: "/product/details", blurb: "Light and dark mode, several accounts, and more" },
} satisfies Record<string, NavItem>;

export const useCases = {
  architecture: { label: "Architecture firms", href: "/use-cases/architecture-firms" },
  engineering: { label: "Engineering firms", href: "/use-cases/engineering-firms" },
  construction: { label: "Construction", href: "/use-cases/construction" },
  marketing: { label: "Marketing agencies", href: "/use-cases/marketing-agencies" },
  accounting: { label: "Accounting firms", href: "/use-cases/accounting-firms" },
  law: { label: "Law firms", href: "/use-cases/law-firms" },
  it: { label: "IT service providers", href: "/use-cases/it-service-providers" },
  property: { label: "Property management", href: "/use-cases/property-management" },
  logistics: { label: "Logistics", href: "/use-cases/logistics" },
  manufacturing: { label: "Manufacturing", href: "/use-cases/manufacturing" },
  schools: { label: "Schools", href: "/use-cases/schools" },
  nonprofits: { label: "Nonprofits", href: "/use-cases/nonprofits" },
  clinics: { label: "Clinics", href: "/use-cases/clinics" },
} satisfies Record<string, NavLink>;

export const compare = {
  slack: { label: "Slack", href: "/compare/slack", blurb: "Chat everywhere, clients behind a paid account" },
  teams: { label: "Teams", href: "/compare/teams", blurb: "Built for inside the company, three ways to add anyone else" },
  basecamp: { label: "Basecamp", href: "/compare/basecamp", blurb: "Projects that end, and free-standing to-do lists" },
  notion: { label: "Notion", href: "/compare/notion", blurb: "Documents in one place, the conversation somewhere else" },
  clickup: { label: "ClickUp", href: "/compare/clickup", blurb: "Task tracking for your team, not for your clients" },
  zendesk: { label: "Zendesk", href: "/compare/zendesk", blurb: "Helpdesk software, which Kolabr is not" },
} satisfies Record<string, NavItem>;

type UseCaseKey = keyof typeof useCases;
const pick = (keys: UseCaseKey[]) => keys.map((k) => useCases[k]);

export const megaMenu = {
  productColumns: [
    [product.channels, product.chat, product.requests, product.meetings],
    [product.wiki, product.administration, product.mobile, product.details],
  ],
  useCases: pick([
    "architecture", "engineering", "construction", "marketing", "accounting", "law", "it",
    "property", "logistics", "manufacturing", "schools", "nonprofits", "clinics",
  ]),
  compare: Object.values(compare),
};

export const mobileMenu = {
  // The design listed Home inside this group; it sits on its own at the top of the sheet instead.
  product: [
    product.channels, product.chat, product.requests, product.meetings,
    product.wiki, product.mobile, product.details, product.administration,
  ],
  useCases: pick([
    "architecture", "engineering", "accounting", "law", "property", "logistics", "manufacturing",
    "clinics", "construction", "schools", "marketing", "it", "nonprofits",
  ]),
  compare: Object.values(compare).map((c) => ({ label: `Kolabr vs ${c.label}`, href: c.href })),
};

export const primaryLinks = {
  home: { label: "Home", href: "/" },
  pricing: { label: "Pricing", href: "/pricing" },
  contact: { label: "Contact us", href: "/contact" },
  blog: { label: "Blog", href: "/blog" },
} satisfies Record<string, NavLink>;

export const footer = {
  columns: [
    {
      title: "Product",
      links: [
        // The design's "Product overview" had no destination (there is no /product page).
        // It points at Channels, which the design's own nav uses as the product entry point.
        { label: "Product overview", href: product.channels.href },
        product.channels, product.chat, product.requests, product.meetings,
        product.wiki, product.mobile, product.details, product.administration,
      ],
    },
    {
      title: "Use cases",
      links: pick([
        "architecture", "construction", "engineering", "accounting", "law", "property", "logistics",
        "manufacturing", "clinics", "marketing", "it", "nonprofits", "schools",
      ]),
    },
    {
      title: "Compare",
      links: Object.values(compare).map((c) => ({ label: `Kolabr vs ${c.label}`, href: c.href })),
    },
    {
      title: "Company",
      links: [
        primaryLinks.pricing,
        primaryLinks.contact,
        { label: "About", href: "/about" },
        primaryLinks.blog,
        { label: "Sign up", href: "/signup/" },
      ],
    },
  ] satisfies { title: string; links: NavLink[] }[],
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Refunds", href: "/refunds" },
    { label: "Cookies", href: "/cookies" },
  ] satisfies NavLink[],
};
