import { describe, expect, test } from 'vitest';
import type { AkababCharacter } from '../sources/akabab';
import { normalizeCharacter } from './character';

const baseAkabab: AkababCharacter = {
  id: 1,
  name: 'Luke Skywalker',
  height: 1.72,
  mass: 73,
  gender: 'male',
  homeworld: 'tatooine',
  image: 'https://vignette.wikia.nocookie.net/luke.jpg',
  born: -19,
  died: 34,
  species: 'human',
  hairColor: 'blond',
  eyeColor: 'blue',
  skinColor: 'light',
  cybernetics: 'Prosthetic right hand',
  affiliations: ['Rebel Alliance', 'Jedi Order'],
  masters: ['Obi-Wan Kenobi', 'Yoda'],
  apprentices: ['Rey'],
};

describe('normalizeCharacter', () => {
  test('produces a stable slug from the name', () => {
    const result = normalizeCharacter(baseAkabab, { sides: {} });
    expect(result.id).toBe('luke-skywalker');
  });

  test('keeps the display name verbatim', () => {
    const result = normalizeCharacter(baseAkabab, { sides: {} });
    expect(result.name).toBe('Luke Skywalker');
  });

  test('converts meters to centimeters', () => {
    const result = normalizeCharacter(baseAkabab, { sides: {} });
    expect(result.height).toEqual({ cm: 172 });
  });

  test('wraps mass in kg units', () => {
    const result = normalizeCharacter(baseAkabab, { sides: {} });
    expect(result.mass).toEqual({ kg: 73 });
  });

  test('converts negative birth year to BBY', () => {
    const result = normalizeCharacter(baseAkabab, { sides: {} });
    expect(result.birthYear).toEqual({ value: 19, era: 'BBY' });
  });

  test('converts positive death year to ABY', () => {
    const result = normalizeCharacter(baseAkabab, { sides: {} });
    expect(result.deathYear).toEqual({ value: 34, era: 'ABY' });
  });

  test('attaches a side from the tagging table', () => {
    const result = normalizeCharacter(baseAkabab, {
      sides: { 'luke-skywalker': 'light' },
    });
    expect(result.side).toBe('light');
  });

  test('defaults side to "none" when not tagged', () => {
    const result = normalizeCharacter(baseAkabab, { sides: {} });
    expect(result.side).toBe('none');
  });

  test('builds an EntityRef for the homeworld', () => {
    const result = normalizeCharacter(baseAkabab, { sides: {} });
    expect(result.homeworld).toEqual({
      id: 'tatooine',
      name: 'Tatooine',
      type: 'planet',
      href: '/api/v1/planets/tatooine',
    });
  });

  test('produces null fields for absent quantities', () => {
    const sparse: AkababCharacter = { id: 99, name: 'Unknown Drifter' };
    const result = normalizeCharacter(sparse, { sides: {} });
    expect(result.height).toBeNull();
    expect(result.mass).toBeNull();
    expect(result.birthYear).toBeNull();
    expect(result.deathYear).toBeNull();
    expect(result.homeworld).toBeNull();
    expect(result.image).toBeNull();
    expect(result.gender).toBeNull();
    expect(result.cybernetics).toBeNull();
    expect(result.appearance).toEqual({ hairColor: null, eyeColor: null, skinColor: null });
  });

  test('normalizes gender to enum or null', () => {
    expect(normalizeCharacter({ ...baseAkabab, gender: 'male' }, { sides: {} }).gender).toBe(
      'male',
    );
    expect(normalizeCharacter({ ...baseAkabab, gender: 'female' }, { sides: {} }).gender).toBe(
      'female',
    );
    expect(normalizeCharacter({ ...baseAkabab, gender: 'n/a' }, { sides: {} }).gender).toBeNull();
    expect(
      normalizeCharacter({ ...baseAkabab, gender: 'hermaphrodite' }, { sides: {} }).gender,
    ).toBe('other');
  });

  test('preserves affiliations, masters, and apprentices verbatim', () => {
    const result = normalizeCharacter(baseAkabab, { sides: {} });
    expect(result.affiliations).toEqual(['Rebel Alliance', 'Jedi Order']);
    expect(result.masters).toEqual(['Obi-Wan Kenobi', 'Yoda']);
    expect(result.apprentices).toEqual(['Rey']);
  });

  test('defaults arrays to empty when absent', () => {
    const sparse: AkababCharacter = { id: 99, name: 'Unknown Drifter' };
    const result = normalizeCharacter(sparse, { sides: {} });
    expect(result.affiliations).toEqual([]);
    expect(result.masters).toEqual([]);
    expect(result.apprentices).toEqual([]);
    expect(result.species).toEqual([]);
    expect(result.films).toEqual([]);
    expect(result.starships).toEqual([]);
    expect(result.vehicles).toEqual([]);
  });

  test('treats an explicit "n/a" homeworld as null', () => {
    const result = normalizeCharacter({ ...baseAkabab, homeworld: 'n/a' }, { sides: {} });
    expect(result.homeworld).toBeNull();
  });

  test('returns null when string-typed fields arrive as non-strings (defensive)', () => {
    const messy = {
      ...baseAkabab,
      // akabab in the wild has fields that escape the declared type — e.g. nested objects.
      homeworld: { name: 'Tatooine' } as unknown as string,
      image: 42 as unknown as string,
      hairColor: false as unknown as string,
    };
    const result = normalizeCharacter(messy, { sides: {} });
    expect(result.homeworld).toBeNull();
    expect(result.image).toBeNull();
    expect(result.appearance.hairColor).toBeNull();
  });

  test('coerces a string masters/apprentices/affiliations into a single-element array', () => {
    // akabab is inconsistent — some records have a string where an array is expected.
    const messy = {
      ...baseAkabab,
      masters: 'Luke Skywalker' as unknown as string[],
      apprentices: 'Finn' as unknown as string[],
      affiliations: 'Resistance' as unknown as string[],
    };
    const result = normalizeCharacter(messy, { sides: {} });
    expect(result.masters).toEqual(['Luke Skywalker']);
    expect(result.apprentices).toEqual(['Finn']);
    expect(result.affiliations).toEqual(['Resistance']);
  });
});
