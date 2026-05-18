import { describe, expect, test } from 'vitest';
import { toRoman } from './roman';

describe('toRoman', () => {
  test('converts the Star Wars episode numbers', () => {
    expect(toRoman(1)).toBe('I');
    expect(toRoman(2)).toBe('II');
    expect(toRoman(3)).toBe('III');
    expect(toRoman(4)).toBe('IV');
    expect(toRoman(5)).toBe('V');
    expect(toRoman(6)).toBe('VI');
    expect(toRoman(7)).toBe('VII');
    expect(toRoman(8)).toBe('VIII');
    expect(toRoman(9)).toBe('IX');
  });

  test('handles larger values via subtractive notation', () => {
    expect(toRoman(40)).toBe('XL');
    expect(toRoman(94)).toBe('XCIV');
    expect(toRoman(1999)).toBe('MCMXCIX');
  });

  test('returns empty string for invalid input', () => {
    expect(toRoman(0)).toBe('');
    expect(toRoman(-1)).toBe('');
    expect(toRoman(1.5)).toBe('');
    expect(toRoman(Number.NaN)).toBe('');
  });
});
