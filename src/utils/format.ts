/**
 * 1,234 style grouping without relying on Intl, which is not guaranteed to be
 * available in every JS engine build. The symbol comes from the selected
 * currency so the whole app can switch between ₹, $, € and friends.
 */

/** Alpha symbols like AED need a space; ₹, $ and friends do not */
export const currencyPrefix = (symbol: string): string =>
  /^[A-Za-z]+$/.test(symbol) ? `${symbol} ` : symbol;

export const formatCurrency = (value: number, symbol = '₹'): string => {
  const sign = value < 0 ? '-' : '';
  const grouped = Math.round(Math.abs(value))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return `${sign}${currencyPrefix(symbol)}${grouped}`;
};
