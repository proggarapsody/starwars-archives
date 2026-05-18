import type { Length, Mass, Year } from '@/shared/model';

/**
 * Normalizers from upstream "stringly or sloppily typed" values to our
 * typed quantity records. `null` is the only "unknown" — no sentinel strings,
 * no zero-means-missing.
 */

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

/**
 * akabab stores height as meters with one decimal place.
 * Convert to integer centimeters; round to nearest.
 */
export function metersToLength(value: number | null | undefined): Length | null {
  if (!isFiniteNumber(value) || value <= 0) return null;
  return { cm: Math.round(value * 100) };
}

/**
 * akabab stores mass as kilograms (number).
 */
export function kgToMass(value: number | null | undefined): Mass | null {
  if (!isFiniteNumber(value) || value <= 0) return null;
  return { kg: value };
}

/**
 * akabab stores birth/death year as a signed integer relative to the
 * Battle of Yavin (BBY/ABY split). Negative = BBY, non-negative = ABY.
 */
export function signedYearToYear(value: number | null | undefined): Year | null {
  if (!isFiniteNumber(value)) return null;
  if (value < 0) return { value: Math.abs(value), era: 'BBY' };
  return { value, era: 'ABY' };
}
