import type { Character } from '@/entities/character/model/types';
import { createFakeDataSource } from '@/shared/api/testing';
import { describe, expect, test } from 'vitest';
import { CharacterRepository } from './CharacterRepository';

function makeCharacter(overrides: Partial<Character>): Character {
  return {
    id: 'unnamed',
    name: 'Unnamed',
    description: '',
    image: null,
    side: 'none',
    gender: null,
    birthYear: null,
    deathYear: null,
    height: null,
    mass: null,
    appearance: { hairColor: null, eyeColor: null, skinColor: null },
    cybernetics: null,
    homeworld: null,
    species: [],
    films: [],
    starships: [],
    vehicles: [],
    affiliations: [],
    masters: [],
    apprentices: [],
    ...overrides,
  };
}

const luke = makeCharacter({
  id: 'luke-skywalker',
  name: 'Luke Skywalker',
  side: 'light',
  affiliations: ['Rebel Alliance', 'Jedi Order'],
});
const vader = makeCharacter({
  id: 'darth-vader',
  name: 'Darth Vader',
  side: 'dark',
  affiliations: ['Galactic Empire', 'Sith Order'],
});
const yoda = makeCharacter({
  id: 'yoda',
  name: 'Yoda',
  side: 'light',
  affiliations: ['Jedi Order', 'Galactic Republic'],
});

describe('CharacterRepository.findBySlug', () => {
  test('returns the matching character', async () => {
    const repo = new CharacterRepository(createFakeDataSource({ characters: [luke, vader] }));
    const result = await repo.findBySlug('luke-skywalker');
    expect(result?.name).toBe('Luke Skywalker');
  });

  test('returns null when no character matches', async () => {
    const repo = new CharacterRepository(createFakeDataSource({ characters: [luke] }));
    expect(await repo.findBySlug('jar-jar-binks')).toBeNull();
  });

  test('returns null on an empty data source', async () => {
    const repo = new CharacterRepository(createFakeDataSource());
    expect(await repo.findBySlug('luke-skywalker')).toBeNull();
  });
});

describe('CharacterRepository.findAll', () => {
  test('returns every character', async () => {
    const repo = new CharacterRepository(createFakeDataSource({ characters: [luke, vader, yoda] }));
    const all = await repo.findAll();
    expect(all).toHaveLength(3);
    expect(all.map((c) => c.id)).toContain('luke-skywalker');
    expect(all.map((c) => c.id)).toContain('darth-vader');
  });

  test('returns an empty array when no characters exist', async () => {
    const repo = new CharacterRepository(createFakeDataSource());
    expect(await repo.findAll()).toEqual([]);
  });

  test('sorts results by name ascending by default', async () => {
    const repo = new CharacterRepository(createFakeDataSource({ characters: [yoda, luke, vader] }));
    const all = await repo.findAll();
    expect(all.map((c) => c.name)).toEqual(['Darth Vader', 'Luke Skywalker', 'Yoda']);
  });
});

describe('CharacterRepository.find', () => {
  test('returns every character when no filters are provided', async () => {
    const repo = new CharacterRepository(createFakeDataSource({ characters: [luke, vader] }));
    expect(await repo.find({})).toHaveLength(2);
  });

  test('filters by side', async () => {
    const repo = new CharacterRepository(createFakeDataSource({ characters: [luke, vader, yoda] }));
    const result = await repo.find({ side: 'light' });
    expect(result.map((c) => c.id)).toEqual(['luke-skywalker', 'yoda']);
  });

  test('filters by affiliation (case-insensitive substring match)', async () => {
    const repo = new CharacterRepository(createFakeDataSource({ characters: [luke, vader, yoda] }));
    const result = await repo.find({ affiliation: 'jedi-order' });
    expect(result.map((c) => c.id).sort()).toEqual(['luke-skywalker', 'yoda']);
  });

  test('combines multiple filters with AND', async () => {
    const repo = new CharacterRepository(createFakeDataSource({ characters: [luke, vader, yoda] }));
    const result = await repo.find({ side: 'light', affiliation: 'rebel-alliance' });
    expect(result.map((c) => c.id)).toEqual(['luke-skywalker']);
  });
});
