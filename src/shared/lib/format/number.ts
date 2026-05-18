const integerFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
});

/**
 * Format an integer with grouping separators (e.g. 2000000000 → "2,000,000,000").
 * Returns `"unknown"` when the value is null.
 */
export function formatPopulation(value: number | null): string {
  if (value === null) return 'unknown';
  return integerFormatter.format(value);
}

/**
 * Format an arbitrary numeric stat, or `"unknown"` when null.
 */
export function formatNumberOrUnknown(value: number | null): string {
  if (value === null) return 'unknown';
  return integerFormatter.format(value);
}

/**
 * Extract the four-digit year from an ISO YYYY-MM-DD date string.
 */
export function isoYear(isoDate: string): string {
  return isoDate.slice(0, 4);
}
