import type { Character } from '@/entities/character/model/types';
import type { CodexDataSource } from './data-source';

type Seed = {
  characters?: Character[];
};

/**
 * In-memory data source for tests. Pass partial seed data; unset collections
 * resolve to empty arrays.
 */
export function createFakeDataSource(seed: Seed = {}): CodexDataSource {
  const characters = seed.characters ?? [];

  return {
    getCharacters: () => Promise.resolve(characters),
  };
}
