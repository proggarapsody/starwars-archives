import type { Character } from '@/entities/character/model/types';
import type { Film } from '@/entities/film/model/types';
import type { Planet } from '@/entities/planet/model/types';
import type { Species } from '@/entities/species/model/types';
import type { Starship } from '@/entities/starship/model/types';
import type { Vehicle } from '@/entities/vehicle/model/types';
import type { CodexDataSource } from './data-source';

type Seed = {
  characters?: Character[];
  films?: Film[];
  planets?: Planet[];
  species?: Species[];
  starships?: Starship[];
  vehicles?: Vehicle[];
};

/**
 * In-memory data source for tests. Pass partial seed data; unset collections
 * resolve to empty arrays.
 */
export function createFakeDataSource(seed: Seed = {}): CodexDataSource {
  return {
    getCharacters: () => Promise.resolve(seed.characters ?? []),
    getFilms: () => Promise.resolve(seed.films ?? []),
    getPlanets: () => Promise.resolve(seed.planets ?? []),
    getSpecies: () => Promise.resolve(seed.species ?? []),
    getStarships: () => Promise.resolve(seed.starships ?? []),
    getVehicles: () => Promise.resolve(seed.vehicles ?? []),
  };
}
