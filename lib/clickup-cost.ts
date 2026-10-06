/**
 * What ClickUp and Kolabr charge as more guests take part, for the ClickUp
 * compare page. The rules are ClickUp's own (help.clickup.com, "Pricing per user role and plan"):
 *
 * - A guest who can comment or edit takes a "permission controlled" guest place. View-only
 *   guests are free and unlimited, but cannot comment, approve or edit.
 * - Unlimited gives 5 places for the first paid user and 2 more per paid user after that.
 *   Business gives 10, and 5 more per paid user.
 * - Inviting a guest with permissions past the allowance adds a paid seat, and that seat opens
 *   places like any other. So the bill steps up once every 2 guests on Unlimited, every 5 on
 *   Business.
 *
 * Kolabr bills users and nobody else, so its line never moves.
 * Prices are yearly fees per user per month, checked on CLICKUP_PRICES_CHECKED.
 */

import { KOLABR_PRO_YEARLY } from "./cost-model";

export const CLICKUP_PRICES_CHECKED = "6 October 2026";

/** Team sizes the page offers: the reference table's rows and the chart's switch. */
export const TEAM_SIZES = [1, 5, 10, 25, 50] as const;
export const CHART_TEAMS = [5, 10, 25, 50] as const;
export const DEFAULT_CHART_TEAM = 10;

/**
 * How far the chart's x axis runs for a team: far enough to show both ClickUp allowances running
 * out (Business's is the larger, 5 per user plus 5), then some way past it.
 */
const RANGES: Record<number, number> = { 5: 50, 10: 100, 25: 200, 50: 400 };
export const chartRange = (team: number) => RANGES[team] ?? Math.ceil((team * 8) / 50) * 50;

export const CLICKUP_PLANS = {
  unlimited: { name: "ClickUp Unlimited", yearly: 7, base: 5, perUser: 2 },
  business: { name: "ClickUp Business", yearly: 12, base: 10, perUser: 5 },
} as const;

type ClickUpPlan = (typeof CLICKUP_PLANS)[keyof typeof CLICKUP_PLANS];

/** Guest places a plan gives for a number of paid seats. */
export const guestPlaces = (plan: ClickUpPlan, seats: number) => (seats > 0 ? plan.base + plan.perUser * (seats - 1) : 0);

/** Paid seats a team needs on a plan so that every guest who comments or approves has a place. */
export function seatsNeeded(plan: ClickUpPlan, team: number, guests: number) {
  let seats = team;
  while (guestPlaces(plan, seats) < guests) seats++;
  return seats;
}

export const clickupBill = (plan: ClickUpPlan, team: number, guests: number) => seatsNeeded(plan, team, guests) * plan.yearly;
export const kolabrBill = (team: number) => Math.round(team * KOLABR_PRO_YEARLY * 100) / 100;

/** One point per guest count, 0 to `max`, for the chart. */
export function billSeries(team: number, max: number) {
  return Array.from({ length: max + 1 }, (_, guests) => ({
    guests,
    unlimited: clickupBill(CLICKUP_PLANS.unlimited, team, guests),
    business: clickupBill(CLICKUP_PLANS.business, team, guests),
    kolabr: kolabrBill(team),
  }));
}
