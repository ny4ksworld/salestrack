// Currency formatting — KES (Kenyan Shilling)

const LOCALE   = 'en-KE';
const CURRENCY = 'KES';

/**
 * Format a number as a currency string.
 * formatCurrency(5600)   → "KSh 5,600.00"
 * formatCurrency(45, 0)  → "KSh 45"
 *
 * @param {number} amount
 * @param {number} [decimals=2]
 * @returns {string}
 */
export function formatCurrency(amount, decimals = 2) {
  return new Intl.NumberFormat(LOCALE, {
    style:                 'currency',
    currency:              CURRENCY,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

/**
 * Compact form for large numbers shown on dashboard stat cards.
 * formatCurrencyCompact(125600) → "KSh 125.6K"
 *
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrencyCompact(amount) {
  if (amount >= 1_000_000) return `KSh ${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000)     return `KSh ${(amount / 1_000).toFixed(1)}K`;
  return formatCurrency(amount, 0);
}
