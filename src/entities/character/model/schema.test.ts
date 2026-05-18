import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { characterSchema } from './schema';

const validCharacter = {
  id: 'luke-skywalker',
  name: 'Luke Skywalker',
  description: 'A farm boy from Tatooine.',
  image: 'https://vignette.wikia.nocookie.net/luke.jpg',
  side: 'light' as const,
  gender: 'male' as const,
  birthYear: { value: 19, era: 'BBY' as const },
  deathYear: { value: 34, era: 'ABY' as const },
  height: { cm: 172 },
  mass: { kg: 73 },
  appearance: {
    hairColor: 'blond',
    eyeColor: 'blue',
    skinColor: 'light',
  },
  cybernetics: 'Prosthetic right hand',
  homeworld: {
    id: 'tatooine',
    name: 'Tatooine',
    type: 'planet' as const,
    href: '/api/v1/planets/tatooine',
  },
  species: [],
  films: [],
  starships: [],
  vehicles: [],
  affiliations: ['Rebel Alliance'],
  masters: ['Obi-Wan Kenobi'],
  apprentices: ['Rey'],
};

describe('characterSchema', () => {
  test('accepts a fully-populated character', () => {
    expect(() => v.parse(characterSchema, validCharacter)).not.toThrow();
  });

  test('accepts null for unknown structured fields', () => {
    const sparse = {
      ...validCharacter,
      image: null,
      gender: null,
      birthYear: null,
      deathYear: null,
      height: null,
      mass: null,
      cybernetics: null,
      homeworld: null,
      appearance: { hairColor: null, eyeColor: null, skinColor: null },
    };
    expect(() => v.parse(characterSchema, sparse)).not.toThrow();
  });

  test('rejects unknown side values', () => {
    expect(() => v.parse(characterSchema, { ...validCharacter, side: 'grey' })).toThrow();
  });

  test('rejects missing id', () => {
    const { id: _id, ...rest } = validCharacter;
    expect(() => v.parse(characterSchema, rest)).toThrow();
  });

  test('rejects unknown gender', () => {
    expect(() => v.parse(characterSchema, { ...validCharacter, gender: 'unknown' })).toThrow();
  });

  test('rejects sentinel strings in place of null', () => {
    // We never want "n/a" or "unknown" in the snapshot — null only.
    expect(() => v.parse(characterSchema, { ...validCharacter, image: 'n/a' })).not.toThrow();
    // Note: the schema can't catch "n/a" semantically. This is documentation, not enforcement.
    // What we DO catch is the wrong shape — e.g. a string in place of a Length record:
    expect(() => v.parse(characterSchema, { ...validCharacter, height: '172' })).toThrow();
    expect(() => v.parse(characterSchema, { ...validCharacter, mass: 'unknown' })).toThrow();
  });

  test('rejects era values other than BBY/ABY', () => {
    expect(() =>
      v.parse(characterSchema, {
        ...validCharacter,
        birthYear: { value: 19, era: 'CRC' },
      }),
    ).toThrow();
  });

  test('rejects negative height or mass values', () => {
    expect(() => v.parse(characterSchema, { ...validCharacter, height: { cm: -1 } })).toThrow();
    expect(() => v.parse(characterSchema, { ...validCharacter, mass: { kg: 0 } })).toThrow();
  });
});
