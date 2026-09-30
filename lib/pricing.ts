// The plans, as agreed on 30 September 2026. Change prices here only.
//
// The shape of the scheme matters as much as the numbers, so it is worth stating once: you pay
// for the people who are accountable, not the people who are present. A user owns work, creates
// channels, administers and sees across channels. A guest is in the room and costs nothing.
// Nothing is capped by how many clients you have, because that is the thing this product is for.

export type Plan = {
  name: string;
  badge?: { label: string; tone: "accent" | "muted" };
  monthly: string;
  yearly: string;
  blurb: string;
  /** Line under the price: what starting on this plan actually gets you. */
  note: string;
  cta: string;
  includesLabel?: string;
  features: string[];
  highlighted?: boolean;
};

// Yearly is shown as a per-month figure, which is how every competitor displays it, with the
// billing period named beside it.
export const PER = { monthly: "/ user / month", yearly: "/ user / month, billed yearly" };

export const YEARLY_DISCOUNT = "15% off";

export const plans: Plan[] = [
  {
    name: "Free",
    monthly: "$0",
    yearly: "$0",
    blurb: "One channel and one client, for as long as you like.",
    note: "Free forever. No card needed",
    cta: "Get started free",
    features: [
      "1 channel, 1 team user",
      "30 guests, free",
      "Requests with owners and categories",
      "Voice calls and voice notes",
      "A wiki of up to 5 pages",
      "1 GB storage, 30 days of history",
    ],
  },
  {
    name: "Pro",
    badge: { label: "Most popular", tone: "accent" },
    monthly: "$10",
    yearly: "$8.50",
    blurb: "For teams working with clients every day.",
    note: "7 days free. No card needed",
    cta: "Start free trial",
    includesLabel: "Everything in Free, plus",
    features: [
      "Unlimited channels and guests",
      "Response targets, routing and playbooks",
      "Video calls, recording and whiteboard",
      "A wiki in every channel",
      "10 GB per user, unlimited history",
    ],
    highlighted: true,
  },
  {
    name: "Business",
    badge: { label: "For scale", tone: "muted" },
    monthly: "$25",
    yearly: "$21.25",
    blurb: "For multi-team operations that answer to someone.",
    note: "7 days free. No card needed",
    cta: "Start free trial",
    includesLabel: "Everything in Pro, plus",
    features: [
      "SAML SSO and SCIM provisioning",
      "Custom roles and granular permissions",
      "Unlimited, exportable audit log",
      "Retention policies and approval steps",
      "50 GB per user, guided onboarding",
    ],
  },
];
