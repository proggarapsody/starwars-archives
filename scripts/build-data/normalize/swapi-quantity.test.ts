import { describe, expect, test } from 'vitest';
import { parseSwapiList, parseSwapiNumber, parseSwapiString } from './swapi-quantity';

describe('parseSwapiNumber', () => {
  test('parses plain integer strings', () => {
    expect(parseSwapiNumber('172')).toBe(172);
  });

  test('parses decimal strings', () => {
    expect(parseSwapiNumber('0.5')).toBe(0.5);
  });

  test('strips thousands separators', () => {
    expect(parseSwapiNumber('1,000,000')).toBe(1_000_000);
  });

  test('handles trailing units by ignoring them', () => {
    // SWAPI's max_atmosphering_speed is sometimes "1000km" or "1000 km"
    expect(parseSwapiNumber('1000km')).toBe(1000);
    expect(parseSwapiNumber('1000 km')).toBe(1000);
  });

  test('returns null for "unknown" / "n/a" / empty', () => {
    expect(parseSwapiNumber('unknown')).toBeNull();
    expect(parseSwapiNumber('n/a')).toBeNull();
    expect(parseSwapiNumber('')).toBeNull();
    expect(parseSwapiNumber('  ')).toBeNull();
  });

  test('returns null for nullish or unparseable input', () => {
    expect(parseSwapiNumber(null)).toBeNull();
    expect(parseSwapiNumber(undefined)).toBeNull();
    expect(parseSwapiNumber('approx 3,000')).toBe(3000);
    expect(parseSwapiNumber('words only')).toBeNull();
  });
});

describe('parseSwapiString', () => {
  test('passes through real strings, trimmed', () => {
    expect(parseSwapiString('  blond  ')).toBe('blond');
  });

  test('returns null for sentinels', () => {
    expect(parseSwapiString('unknown')).toBeNull();
    expect(parseSwapiString('n/a')).toBeNull();
    expect(parseSwapiString('none')).toBeNull();
    expect(parseSwapiString('')).toBeNull();
  });

  test('returns null for nullish input', () => {
    expect(parseSwapiString(null)).toBeNull();
    expect(parseSwapiString(undefined)).toBeNull();
  });
});

describe('parseSwapiList', () => {
  test('splits comma-separated strings, trimming each entry', () => {
    expect(parseSwapiList('blue, brown, hazel')).toEqual(['blue', 'brown', 'hazel']);
  });

  test('handles "or" separators alongside commas', () => {
    // SWAPI's terrain field uses both: "grasslands, hills, deserts or jungles"
    expect(parseSwapiList('grasslands, hills, deserts or jungles')).toEqual([
      'grasslands',
      'hills',
      'deserts',
      'jungles',
    ]);
  });

  test('strips sentinel values from within the list', () => {
    expect(parseSwapiList('green, n/a, blue, unknown')).toEqual(['green', 'blue']);
  });

  test('returns an empty array for null / sentinel-only inputs', () => {
    expect(parseSwapiList('unknown')).toEqual([]);
    expect(parseSwapiList('')).toEqual([]);
    expect(parseSwapiList(null)).toEqual([]);
    expect(parseSwapiList(undefined)).toEqual([]);
  });

  test('passes through arrays unchanged after trimming + filtering', () => {
    expect(parseSwapiList(['Blue ', 'n/a', '', 'Brown'])).toEqual(['Blue', 'Brown']);
  });
});
