/**
 * Kolabr Pro's fee per user per month, for the compare pages' price arithmetic. Read from the
 * plans the pricing page shows (lib/pricing.ts), so a price change there reaches every page.
 */

import { plans } from "./pricing";

const pro = plans.find((p) => p.name === "Pro")!;
const dollars = (s: string) => Number(s.replace("$", ""));

export const KOLABR_PRO_MONTHLY = dollars(pro.monthly);
export const KOLABR_PRO_YEARLY = dollars(pro.yearly);
