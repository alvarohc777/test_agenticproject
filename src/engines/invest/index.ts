/** One entry of content/invest-products.json, filled by the domain expert with official links. */
export type InvestProduct = {
  id: string;
  name: string;
  url: string;
  minMonthlyRappen: number;
  horizonYears: number;
};

/**
 * Ideas, never advice: products whose minimum fits the monthly surplus.
 * The screen always links to the official product page.
 */
export function investmentIdeas(monthlySurplusRappen: number, products: InvestProduct[]): InvestProduct[] {
  if (monthlySurplusRappen <= 0) return [];
  return products.filter((p) => p.minMonthlyRappen <= monthlySurplusRappen);
}

// TODO(invest): goals (emergency fund first), horizon, risk explanation in plain words.
