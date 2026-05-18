import type { Character } from '@/entities/character/model/types';

/**
 * The contract repositories depend on. All entity collections expose the same
 * shape — a single getter returning the full array.
 *
 * Concrete implementations:
 *   - JsonCodexDataSource — reads from bundled JSON snapshots (production).
 *   - createFakeDataSource — constructs an in-memory source (tests).
 *
 * Adding a new implementation (Postgres, KV store) only requires implementing
 * this interface — repositories and UI do not change.
 */
export interface CodexDataSource {
  getCharacters(): Promise<Character[]>;
  // Other entity getters will be added as the entities are introduced:
  //   getFilms(): Promise<Film[]>;
  //   getPlanets(): Promise<Planet[]>;
  //   getSpecies(): Promise<Species[]>;
  //   getStarships(): Promise<Starship[]>;
  //   getVehicles(): Promise<Vehicle[]>;
}
