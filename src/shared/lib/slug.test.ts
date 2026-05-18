import { describe, expect, test } from 'vitest';
import { slugify } from './slug';

describe('slugify', () => {
  test('lowercases and hyphenates a simple name', () => {
    expect(slugify('Luke Skywalker')).toBe('luke-skywalker');
  });

  test('collapses internal whitespace into single hyphens', () => {
    expect(slugify('A   New    Hope')).toBe('a-new-hope');
  });

  test('strips leading and trailing whitespace', () => {
    expect(slugify('  Han Solo  ')).toBe('han-solo');
  });

  test('removes apostrophes without leaving artefacts', () => {
    expect(slugify("Obi-Wan's saber")).toBe('obi-wans-saber');
  });

  test('preserves existing hyphens', () => {
    expect(slugify('Obi-Wan Kenobi')).toBe('obi-wan-kenobi');
  });

  test('strips trailing parenthetical disambiguation', () => {
    expect(slugify('Anakin Skywalker (Padawan)')).toBe('anakin-skywalker-padawan');
  });

  test('handles digits and roman numerals', () => {
    expect(slugify('R2-D2')).toBe('r2-d2');
    expect(slugify('Episode IV')).toBe('episode-iv');
  });

  test('normalizes accented characters to ASCII', () => {
    expect(slugify('Padmé Amidala')).toBe('padme-amidala');
  });

  test('throws on empty input', () => {
    expect(() => slugify('')).toThrow();
    expect(() => slugify('   ')).toThrow();
  });
});
