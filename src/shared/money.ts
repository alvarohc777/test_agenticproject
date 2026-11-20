/** Money is always an integer number of Rappen (1 CHF = 100 Rappen). Format only at the edge. */
export function formatChf(rappen: number, locale = "de-CH"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "CHF" }).format(rappen / 100);
}

/** "2025-02" → "Feb 2025" in the given language. */
export function formatMonth(month: string, locale = "en-CH"): string {
  const [y, m] = month.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, { month: "short", year: "numeric" }).format(new Date(y!, m! - 1, 1));
}
