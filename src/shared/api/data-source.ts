import type { Character } from '@/entities/character/model/types';
import type { Film } from '@/entities/film/model/types';
import type { Planet } from '@/entities/planet/model/types';
import type { Species } from '@/entities/species/model/types';
import type { Starship } from '@/entities/starship/model/types';
import type { Vehicle } from '@/entities/vehicle/model/types';

/**
 * The contract repositories depend on. All entity collections expose the same
 * shape — a single getter returning the full array.
 *
 * Concrete implementations:
 *   - jsonDataSource — reads from bundled JSON snapshots (production).
 *   - createFakeDataSource — constructs an in-memory source (tests).
 */
export interface CodexDataSource {
  getCharacters(): Promise<Character[]>;
  getFilms(): Promise<Film[]>;
  getPlanets(): Promise<Planet[]>;
  getSpecies(): Promise<Species[]>;
  getStarships(): Promise<Starship[]>;
  getVehicles(): Promise<Vehicle[]>;
}
