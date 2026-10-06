/**
 * What a team pays for the people who answer clients, on Kolabr Pro and on Zendesk's Suite plans,
 * for the Zendesk compare page. Zendesk prices per agent, and its response targets (SLA policies)
 * start at Suite Professional; Kolabr prices per user and has response targets on Pro.
 *
 * Yearly fees per user or agent per month, from zendesk.com/pricing (Monthly/Yearly switch),
 * checked on ZENDESK_PRICES_CHECKED. Kolabr's figure comes from lib/pricing.ts via lib/cost-model.ts.
 */

import { KOLABR_PRO_YEARLY } from "./cost-model";

export const ZENDESK_PRICES_CHECKED = "6 October 2026";

export const ZENDESK_PLANS = [
  { key: "suiteTeam", name: "Zendesk Suite Team", yearly: 55, monthly: 69, responseTargets: false },
  { key: "suiteProfessional", name: "Zendesk Suite Professional", yearly: 115, monthly: 149, responseTargets: true },
] as const;

/** Team sizes the price band offers, and the one it opens on. */
export const BAND_TEAMS = [5, 10, 25, 50] as const;
export const DEFAULT_BAND_TEAM = 10;

const cents = (n: number) => Math.round(n * 100) / 100;
export const kolabrMonthly = (users: number) => cents(users * KOLABR_PRO_YEARLY);
export const zendeskMonthly = (plan: (typeof ZENDESK_PLANS)[number], agents: number) => cents(agents * plan.yearly);

export { KOLABR_PRO_YEARLY };
