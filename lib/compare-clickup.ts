// The ClickUp compare page. Its argument: ClickUp is built for your team to manage work, Kolabr
// for your team and your clients to do the work together. Everyone who needs a say is in the room,
// free, and finds their way on the first day. The page states ClickUp's rules rather than a picked
// example, and lets the reader choose their team size. The words live in content/pages/compare-clickup.json;
// the shape stays here (see lib/content-store.ts).

import { assertCheckedDate } from "./checked-date";
import { CLICKUP_PLANS, CLICKUP_PRICES_CHECKED } from "./clickup-cost";
import type { Comparison } from "./compare";
import { loadContent } from "./content-store";
import type { Card, Rich, Shot } from "./use-cases";

export type ClickUpComparison = Pick<Comparison, "competitor" | "table" | "faq" | "proof" | "cta"> & {
  hero: { eyebrow: string; title: string; lede: Rich; image: Shot; chip: { title: string; body: string } };
  /**
   * ClickUp's guest allowance as a rule anyone can check and apply to their own team, never a
   * picked example. The table's figures come from lib/clickup-cost.ts.
   */
  room: {
    id: string;
    title: string;
    lede: Rich;
    /** Unlimited, then Business, in the order of CLICKUP_PLANS. */
    plans: { label: string; visual: string; rule: string; after: string }[];
    kolabr: { label: string; visual: string; rule: string; after: string };
    tableTitle: string;
    teamLabel: string;
    noLimit: string;
    note: Rich;
  };
  /** What a client has to learn: ClickUp's hierarchy and views against one channel's tabs. */
  learn: {
    id: string;
    title: string;
    lede: Rich;
    clickup: { label: string; path: { level: string; name: string }[]; views: string[]; caption: Rich };
    kolabr: { label: string; client: string; channel: string; tabs: string[]; caption: Rich };
  };
  /** A team's board against the one request card a client reads, then three points. */
  promise: {
    id: string;
    title: string;
    lede: Rich;
    board: { label: string; columns: { name: string; cards: number; highlight?: string }[] };
    request: { label: string; id: string; title: string; rows: { label: string; value: string }[]; footer: string };
    caption: Rich;
    points: Card[];
  };
  /** The chart band, at #cost. Its figures come from lib/clickup-cost.ts; the reader picks the team size. */
  cost: { title: string; lede: Rich; chartTitle: string; teamLabel: string; hint: string; note: Rich };
};

const KEYS = ["competitor", "hero", "room", "learn", "promise", "cost", "table", "faq", "proof", "cta"] as const;

/**
 * The page states ClickUp's allowance rule in words. The words must match the numbers the chart
 * and table are drawn from, or a change at ClickUp updated in one place would leave the other wrong.
 */
function assertRule(data: ClickUpComparison) {
  const plans = [CLICKUP_PLANS.unlimited, CLICKUP_PLANS.business];
  const wrong = plans.flatMap((p, i) => {
    const r = data.room.plans[i];
    const rule = `${p.base} places for your first user, then ${p.perUser} for each user after that`;
    const after = `every ${p.perUser} more guests`;
    return [r?.rule.includes(rule) ? [] : [rule], r?.after.includes(after) ? [] : [after]].flat();
  });
  if (wrong.length)
    throw new Error(`compare-clickup.json no longer states ClickUp's rule as lib/clickup-cost.ts has it: ${wrong.join(" | ")}`);
}

function load(): ClickUpComparison {
  const data = loadContent<ClickUpComparison>("compare-clickup");
  const missing = KEYS.filter((k) => !(k in data));
  if (missing.length) throw new Error(`Content file compare-clickup.json is missing: ${missing.join(", ")}`);
  assertCheckedDate(data, CLICKUP_PRICES_CHECKED, "compare-clickup.json", "lib/clickup-cost.ts");
  assertRule(data);
  return data;
}

export const clickupComparison = load();
