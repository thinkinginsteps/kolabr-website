/**
 * A compare page says when the competitor's figures were checked in several places (the hero,
 * the table, the price band, the footer). They must all name the same day, or a re-check that
 * updates one leaves the others claiming a date nobody checked on. This fails the build instead.
 */
export function assertCheckedDate(data: unknown, expected: string, file: string, source: string) {
  const text = JSON.stringify(data);
  const dates = new Set([...text.matchAll(/checked[^"]*?(\d{1,2} [A-Z][a-z]+ \d{4})/g)].map((m) => m[1]));
  const stale = [...dates].filter((d) => d !== expected);
  if (stale.length) {
    throw new Error(`${file} says the figures were checked on ${stale.join(", ")}, but ${source} says ${expected}`);
  }
}
