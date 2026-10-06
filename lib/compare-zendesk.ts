// The Zendesk compare page. Its argument is the door against the room: Zendesk keeps customers
// at a portal and a queue, where an agent relays what the expert knows; Kolabr brings clients into
// the channel, where the person who knows answers and the clock is in plain sight. The words live
// in content/pages/compare-zendesk.json; the shape stays here (see lib/content-store.ts).

import { assertCheckedDate } from "./checked-date";
import type { Comparison } from "./compare";
import { loadContent } from "./content-store";
import type { Card, Rich, Shot } from "./use-cases";
import { kolabrMonthly, ZENDESK_PLANS, ZENDESK_PRICES_CHECKED, zendeskMonthly, KOLABR_PRO_YEARLY } from "./zendesk-cost";

/** One step of a request's journey: who acts, and what happens. `relay` marks the hand-offs. */
export type JourneyStep = { actor: string; text: string; relay?: boolean };

export type ZendeskComparison = Pick<Comparison, "competitor" | "table" | "faq" | "proof" | "cta"> & {
  hero: { eyebrow: string; title: string; lede: Rich; image: Shot; chip: { title: string; body: string } };
  journey: {
    id: string;
    title: string;
    lede: Rich;
    relayLabel: string;
    zendesk: { label: string; steps: JourneyStep[] };
    kolabr: { label: string; steps: JourneyStep[] };
  };
  /** Zendesk agent, Zendesk light agent, Kolabr user, in that order. Prices come from lib/zendesk-cost.ts. */
  roles: { id: string; title: string; lede: Rich; cards: { label: string; can: string; note: string }[]; footer: Rich };
  keep: { id: string; title: string; lede: Rich; tiles: Card[] };
  /** The price band, at #cost. Figures from lib/zendesk-cost.ts; the reader picks the team size. */
  cost: { title: string; lede: Rich; chartTitle: string; teamLabel: string; noTargets: string; withTargets: string; note: Rich };
};

const KEYS = ["competitor", "hero", "journey", "roles", "keep", "cost", "table", "faq", "proof", "cta"] as const;

/**
 * The page quotes prices in words (the table, the FAQ, the note). They must match the figures the
 * bars are drawn from, or a price change made in one place would leave the other wrong.
 */
function assertPrices(data: ZendeskComparison) {
  const text = JSON.stringify(data);
  const [team, pro] = ZENDESK_PLANS;
  const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0 })}`;
  const expected = [
    money(KOLABR_PRO_YEARLY),
    `${money(team.yearly)} per agent`,
    `${money(pro.yearly)} per agent`,
    money(team.monthly),
    money(pro.monthly),
    `For 10 people that is ${money(kolabrMonthly(10))} a month, against ${money(zendeskMonthly(team, 10))} and ${money(zendeskMonthly(pro, 10))}`,
  ];
  const missing = expected.filter((e) => !text.includes(e));
  if (missing.length) throw new Error(`compare-zendesk.json no longer matches lib/zendesk-cost.ts; expected: ${missing.join(" | ")}`);
}

function load(): ZendeskComparison {
  const data = loadContent<ZendeskComparison>("compare-zendesk");
  const missing = KEYS.filter((k) => !(k in data));
  if (missing.length) throw new Error(`Content file compare-zendesk.json is missing: ${missing.join(", ")}`);
  if (data.roles.cards.length !== 3) throw new Error("compare-zendesk.json: the roles band is laid out for exactly three cards");
  assertCheckedDate(data, ZENDESK_PRICES_CHECKED, "compare-zendesk.json", "lib/zendesk-cost.ts");
  assertPrices(data);
  return data;
}

export const zendeskComparison = load();
