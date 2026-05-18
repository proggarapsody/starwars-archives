import { describe, expect, test } from 'vitest';
import type { SwapiSpecies } from '../sources/swapi-info';
import { RefIndex } from './ref';
import { normalizeSpecies } from './species';

const human: SwapiSpecies = {
  url: 'https://swapi.info/api/species/1',
  name: 'Human',
  classification: 'mammal',
  designation: 'sentient',
  average_height: '180',
  skin_colors: 'caucasian, black, asian, hispanic',
  hair_colors: 'blonde, brown, black, red',
  eye_colors: 'brown, blue, green, hazel, grey, amber',
  average_lifespan: '120',
  homeworld: 'https://swapi.info/api/planets/9',
  language: 'Galactic Basic',
  people: [],
  films: [],
};

describe('normalizeSpecies', () => {
  test('parses height and lifespan as numbers', () => {
    const result = normalizeSpecies(human, new RefIndex());
    expect(result.averageHeightCm).toBe(180);
    expect(result.averageLifespanYears).toBe(120);
  });

  test('resolves homeworld through the ref index', () => {
    const refs = new RefIndex();
    refs.register('planet', 'https://swapi.info/api/planets/9', 'Coruscant');

    const result = normalizeSpecies(human, refs);
    expect(result.homeworld?.id).toBe('coruscant');
  });

  test('returns null homeworld when not registered or null in source', () => {
    expect(normalizeSpecies({ ...human, homeworld: null }, new RefIndex()).homeworld).toBeNull();
    expect(normalizeSpecies(human, new RefIndex()).homeworld).toBeNull();
  });

  test('splits color lists', () => {
    const result = normalizeSpecies(human, new RefIndex());
    expect(result.skinColors).toContain('caucasian');
    expect(result.hairColors).toContain('blonde');
    expect(result.eyeColors).toContain('amber');
  });
});
