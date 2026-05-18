/**
 * Parsers for SWAPI's stringly-typed fields.
 *
 * SWAPI delivers numbers as strings, sometimes with units or thousands
 * separators ("1,000,000"). Unknown values are represented by sentinel
 * strings ("unknown", "n/a", "none"). These helpers turn that into typed
 * data, with `null` as the only "unknown".
 */

const UNKNOWN_SENTINELS = new Set(['', 'unknown', 'n/a', 'na', 'none']);

function isSentinel(value: string): boolean {
  return UNKNOWN_SENTINELS.has(value.trim().toLowerCase());
}

export function parseSwapiNumber(value: string | null | undefined): number | null {
  if (value == null) return null;
  if (typeof value !== 'string') return null;
  if (isSentinel(value)) return null;
  // Extract the first numeric token from the string. Handles "1000km", "approx 3,000".
  const match = value.replace(/,/g, '').match(/-?\d+(\.\d+)?/);
  if (!match) return null;
  const parsed = Number.parseFloat(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseSwapiString(value: string | null | undefined): string | null {
  if (value == null) return null;
  if (typeof value !== 'string') return null;
  if (isSentinel(value)) return null;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

export function parseSwapiList(value: string | string[] | null | undefined): string[] {
  if (value == null) return [];
  const raw = Array.isArray(value) ? value : value.split(/,|\bor\b/);
  return raw
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length > 0 && !isSentinel(item));
}
