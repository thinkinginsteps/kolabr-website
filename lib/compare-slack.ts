// The Slack compare page. It argues value first: what Kolabr does beyond chat, then what the
// guests cost, then the detail. The words live in content/pages/compare-slack.json; the shape
// stays here, as it does for every other page (see lib/content-store.ts).

import type { Comparison } from "./compare";
import { loadContent } from "./content-store";
import { SLACK_PRICES_CHECKED } from "./slack-cost";
import type { Card, Rich } from "./use-cases";

/**
 * A small drawing of the feature, made from the product pages' sketch pieces
 * (components/product/Illustrations.tsx). Text only, so it stays sharp and needs no image.
 */
export type ValueSketch =
  | { kind: "queue"; rows: { id: string; title: string; status: string; sla: "On track" | "At risk" | "Breached" }[] }
  | { kind: "rows"; heading: string; rows: { label: string; value: string }[] }
  | { kind: "wiki"; heading: string; articles: { title: string; meta: string; suggested?: boolean }[] }
  | { kind: "meeting"; heading: string; link: string }
  | { kind: "playbook"; heading: string; steps: { text: string; owner: string; due: string; done: boolean }[] }
  | { kind: "members"; heading: string; members: { name: string; guest: boolean }[] };

/** One thing Kolabr includes, and an honest line on what Slack offers instead. */
export type ValueItem = Card & { slack: Rich; sketch: ValueSketch };

export type SlackComparison = Pick<
  Comparison,
  "competitor" | "hero" | "statement" | "table" | "sections" | "outcome" | "faq" | "proof" | "cta"
> & {
  /** Straight after the hero: what you get on top of chat, before any price is mentioned. */
  valueBand: { id: string; title: string; lede: Rich; items: ValueItem[] };
  /** The calculator band, at #cost: the hero's first button points there. */
  cost: { title: string; paragraphs: Rich[] };
};

const KEYS = ["competitor", "hero", "valueBand", "statement", "cost", "table", "sections", "outcome", "faq", "proof", "cta"] as const;

function load(): SlackComparison {
  const data = loadContent<SlackComparison>("compare-slack");
  const missing = KEYS.filter((k) => !(k in data));
  if (missing.length) throw new Error(`Content file compare-slack.json is missing: ${missing.join(", ")}`);

  // The page states when Slack's figures were checked in several places (the hero note, the
  // table, the calculator, the footer). They must all name the same day, or a re-check that
  // updates one leaves the others claiming a date nobody checked on.
  const text = JSON.stringify(data);
  const dates = new Set([...text.matchAll(/checked[^"]*?(\d{1,2} [A-Z][a-z]+ \d{4})/g)].map((m) => m[1]));
  const stale = [...dates].filter((d) => d !== SLACK_PRICES_CHECKED);
  if (stale.length) {
    throw new Error(`compare-slack.json says Slack was checked on ${stale.join(", ")}, but lib/slack-cost.ts says ${SLACK_PRICES_CHECKED}`);
  }
  return data;
}

export const slackComparison = load();
