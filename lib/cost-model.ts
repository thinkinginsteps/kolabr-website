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
  teams: {
    name: "Microsoft Teams",
    plan: "Microsoft 365 Business Basic, annual terms",
    guestsAreFreeToo: true,
    price: (team) => ({
      total: Math.round(team * 7),
      basis: `${fmtSeats(team, 7)}. Guest access is included, so the outside people do not add to the licence bill.`,
    }),
  },
  basecamp: {
    name: "Basecamp",
    plan: "flat, whole account",
    guestsAreFreeToo: true,
    price: (team, outside) => {
      const people = team + outside;
      const tier = people <= 5 ? [0, "Free"] : people <= 20 ? [25, "Freelancer"] : [59, "Studio"];
      return {
        total: tier[0] as number,
        basis: `${tier[1]} at $${tier[0]} a month for the whole account. Basecamp counts everyone, but Studio and above have no limit on people.`,
      };
    },
  },
  notion: {
    name: "Notion",
    plan: "Notion Plus, monthly",
    guestsAreFreeToo: true,
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
    price: (team) => ({
      total: Math.round(team * 55),
      basis: `${fmtSeats(team, 55)} per agent. Customers are free, and light agents can read and comment internally but cannot answer a customer.`,
    }),
  },
};

/** Kolabr: you pay for your team, and nobody else, on any number of channels. */
export function kolabrCost(team: number): Outcome {
  return {
    total: team * KOLABR_PRO_MONTHLY,
    basis: `${fmtSeats(team, KOLABR_PRO_MONTHLY)} on Pro. Guests are free and unlimited, in as many channels as the work needs.`,
  };
}
