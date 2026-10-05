/**
 * What a team pays on Kolabr Pro and on Slack Pro once its clients are in the room. The Slack
 * compare page's calculator runs on this, and nothing else does.
 *
 * Kolabr bills the people on your team and nobody else, so our side is team × rate and no other
 * input moves it. Slack bills guests on two conditions, both its own published rules:
 *
 * - A guest in more than one channel is a multi-channel guest, billed as a full member.
 * - A guest in one channel is free, but only up to five per paid member. Past that allowance each
 *   extra guest needs a paid account.
 *
 * Slack list prices checked on SLACK_PRICES_CHECKED. Introductory offers are left out on purpose:
 * they end, and a budget built on one is wrong by the fourth month.
 */

import { KOLABR_PRO_MONTHLY, KOLABR_PRO_YEARLY } from "./cost-model";

export const SLACK_PRICES_CHECKED = "5 October 2026";

const SLACK_PRO = { monthly: 8.75, yearly: 7.25 };
const KOLABR_PRO = { monthly: KOLABR_PRO_MONTHLY, yearly: KOLABR_PRO_YEARLY };
/** Single-channel guests Slack allows free for every paid member. */
const FREE_GUESTS_PER_MEMBER = 5;

export type SlackInputs = {
  team: number;
  clients: number;
  guestsPerClient: number;
  /** Does each client need more than one channel? */
  multiChannel: boolean;
  yearly: boolean;
};

export type SideCost = {
  /** Per month, in dollars and cents, on the chosen terms. */
  perMonth: number;
  /** Per year, in dollars and cents, on the chosen terms. */
  perYear: number;
  rate: number;
  /** One line saying how the figure is reached. */
  basis: string;
};

/** Whole dollars when the figure is whole, otherwise cents: $120, $8.50, $113.75. */
export const money = (n: number) => {
  const cents = Math.round(n * 100) / 100;
  const digits = Number.isInteger(cents) ? 0 : 2;
  return `$${cents.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;
};
const plural = (n: number, one: string, many: string) => `${n.toLocaleString("en-US")} ${n === 1 ? one : many}`;

function side(people: number, rate: number, basis: string): SideCost {
  const cents = Math.round(people * rate * 100);
  return { perMonth: cents / 100, perYear: (cents * 12) / 100, rate, basis };
}

export function kolabrSide({ team, clients, guestsPerClient, yearly }: SlackInputs): SideCost {
  const rate = yearly ? KOLABR_PRO.yearly : KOLABR_PRO.monthly;
  const guests = clients * guestsPerClient;
  const theirs = guests
    ? ` Your ${guests === 1 ? "guest is" : `${guests.toLocaleString("en-US")} guests are`} free, in as many channels as the work needs.`
    : " Guests are free, in as many channels as the work needs.";
  return side(team, rate, `${team} × ${money(rate)} on Pro, your team and nobody else.${theirs}`);
}

export function slackSide({ team, clients, guestsPerClient, multiChannel, yearly }: SlackInputs): SideCost {
  const rate = yearly ? SLACK_PRO.yearly : SLACK_PRO.monthly;
  const guests = clients * guestsPerClient;
  const head = (billed: number) => `${billed} × ${money(rate)}: your team of ${team}`;

  if (!guests) return side(team, rate, `${head(team)}.`);

  if (multiChannel) {
    const billed = team + guests;
    return side(
      billed,
      rate,
      `${head(billed)}, plus ${plural(guests, "guest", "guests")} in more than one channel, each billed as a full member.`,
    );
  }

  const allowance = team * FREE_GUESTS_PER_MEMBER;
  const overflow = Math.max(0, guests - allowance);
  const billed = team + overflow;
  return side(
    billed,
    rate,
    overflow
      ? `${head(billed)}, plus ${plural(overflow, "guest", "guests")} past the free limit of ${allowance} (five per paid member), each needing a paid account.`
      : `${head(billed)}. Your ${plural(guests, "guest stays", "guests stay")} in one channel each, free up to ${allowance} (five per paid member).`,
  );
}
