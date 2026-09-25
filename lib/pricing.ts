// Plans as shown in the design (Home and Pricing). Pricing is not final: change it here only.

export type Plan = {
  name: string;
  badge?: { label: string; tone: "accent" | "muted" };
  monthly: string;
  yearly: string;
  blurb: string;
  includesLabel?: string;
  features: string[];
  highlighted?: boolean;
};

export const PER = { monthly: "/ user / month", yearly: "/ user / year: 11 months, 1 free" };

export const plans: Plan[] = [
  {
    name: "Starter",
    monthly: "$9.99",
    yearly: "$109.89",
    blurb: "For a single team getting started.",
    features: [
      "3 channels, 30 participants each",
      "1 GB file storage",
      "Channel chat and requests",
      "Free guest accounts",
      "Email support",
    ],
  },
  {
    name: "Pro",
    badge: { label: "Most popular", tone: "accent" },
    monthly: "$19.99",
    yearly: "$219.89",
    blurb: "For growing teams working with clients every day.",
    includesLabel: "Everything in Starter, plus",
    features: [
      "30 channels, 100 participants each",
      "20 GB file storage",
      "Wiki and video calls",
      "Scheduled Events with calendar sync",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Max",
    badge: { label: "Best value", tone: "muted" },
    monthly: "$39.99",
    yearly: "$439.89",
    blurb: "For multi-team and multi-client operations.",
    includesLabel: "Everything in Pro, plus",
    features: [
      "Unlimited channels and participants",
      "500 GB storage, expandable",
      "SSO / SAML and audit log export",
      "Retention policies and data residency",
      "Dedicated account manager",
    ],
  },
];
