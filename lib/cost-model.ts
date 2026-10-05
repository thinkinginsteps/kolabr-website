/**
 * What a team of a given size, working with a given number of outside people, pays per month.
 *
 * This exists to answer the only cost question that matters here, which is not "what is your
 * per-seat price" but "what is the bill once the clients are in the room". It is deliberately
 * honest: on ClickUp and Notion the outside people are free too, and the model says so rather
 * than inventing a gap. On Basecamp the answer is usually that Basecamp is cheaper.
 *
 * Every competitor figure is a published monthly list price checked on 29 September 2026, and
 * every rule below is the vendor's own, cited in the note each page shows underneath.
 */

export const KOLABR_PRO_MONTHLY = 10;
export const KOLABR_PRO_YEARLY = 8.5;

export type Outcome = {
  /** Monthly total in whole dollars. */
  total: number;
  /** One line saying how that total is reached. */
  basis: string;
};

export type CompetitorModel = {
  name: string;
  /** Short label for the plan being priced, shown under the total. */
  plan: string;
  price: (team: number, outside: number, multiChannel: number) => Outcome;
  /** Shown when the outside people cost nothing on either side, so the page does not overclaim. */
  guestsAreFreeToo?: boolean;
  /**
   * Why the participation slider does not move this competitor's total. Only Slack and ClickUp
   * meter the people who take part; the rest ignore the number, and a control that silently does
   * nothing looks broken rather than meaningful.
   */
  sliderNote?: string;
};

const fmtSeats = (n: number, rate: number) => `${n} × $${rate}`;

export const MODELS: Record<string, CompetitorModel> = {
  slack: {
    name: "Slack",
    plan: "Slack Pro, monthly",
    // Single-channel guests are free, capped at 5 per paid member. A guest who needs a second
    // channel is billed as a full member.
    price: (team, outside, multiChannel) => {
      const rate = 8.75;
      const singleChannel = outside - multiChannel;
      const freeAllowance = team * 5;
      const overflow = Math.max(0, singleChannel - freeAllowance);
      const billable = team + multiChannel + overflow;
      return {
        total: Math.round(billable * rate),
        basis:
          `${fmtSeats(billable, rate)}: your ${team}` +
          (multiChannel ? `, plus ${multiChannel} multi-channel guests billed as members` : "") +
          (overflow ? `, plus ${overflow} single-channel guests past the free allowance` : "") +
          ".",
      };
    },
  },
  basecamp: {
    name: "Basecamp",
    plan: "flat, whole account",
    guestsAreFreeToo: true,
    sliderNote: "Basecamp charges one fee for the whole account, so this number does not move.",
    price: (team, outside) => {
      const people = team + outside;
      const [fee, note] = people <= 20
        ? [25, "the tier that covers up to twenty people"]
        : [59, "the cheapest tier with no limit on people"];
      return {
        total: fee,
        basis: `$${fee} a month for the whole account, ${note}. Basecamp counts your team and your clients alike. Tiers above this one are $99 a month, and $299 billed annually.`,
      };
    },
  },
  notion: {
    name: "Notion",
    plan: "Notion Plus, monthly",
    guestsAreFreeToo: true,
    sliderNote: "Notion bills per member, and guests are free whatever they do, so this number does not move.",
    price: (team) => ({
      total: Math.round(team * 12),
      basis: `${fmtSeats(team, 12)}. Guests are free and unlimited on paid plans, though they see only the pages they are invited to.`,
    }),
  },
  clickup: {
    name: "ClickUp",
    plan: "ClickUp Unlimited, monthly",
    // Read-only guests are unlimited and free. Guests who can comment or edit are metered:
    // 5 for the first paid user, plus 2 per additional paid user, then they become members.
    price: (team, outside, multiChannel) => {
      const rate = 10;
      const allowance = team > 0 ? 5 + (team - 1) * 2 : 0;
      const overflow = Math.max(0, multiChannel - allowance);
      const billable = team + overflow;
      return {
        total: Math.round(billable * rate),
        basis:
          `${fmtSeats(billable, rate)}: your ${team}` +
          (overflow
            ? `, plus ${overflow} participating guests past the allowance of ${allowance}, who become paid members`
            : `. The ${multiChannel} participating guests fit inside the allowance of ${allowance}`) +
          ".",
      };
    },
  },
  zendesk: {
    name: "Zendesk",
    plan: "Suite Team, annual terms",
    sliderNote: "Zendesk bills per agent, not per customer, so this number does not move.",
    price: (team) => ({
      total: Math.round(team * 55),
      basis: `${fmtSeats(team, 55)} per agent. Customers are free, and light agents can read and comment internally but cannot answer a customer.`,
    }),
  },
};

/**
 * Kolabr: you pay for your team, and nobody else, on any number of channels. One plan covers the
 * whole account, so neither the number of clients nor how much they take part changes the bill.
 */
export function kolabrCost(team: number): Outcome {
  return {
    total: team * KOLABR_PRO_MONTHLY,
    basis: `${fmtSeats(team, KOLABR_PRO_MONTHLY)} on Pro. Move the slider as far as you like: guests are free and unlimited, however much they take part.`,
  };
}

/** The same team on annual terms, shown under the monthly total rather than as a second mode. */
export const kolabrYearly = (team: number) => Math.round(team * KOLABR_PRO_YEARLY * 100) / 100;
