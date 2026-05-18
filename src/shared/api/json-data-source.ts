import type { Character } from '@/entities/character/model/types';
import type { Film } from '@/entities/film/model/types';
import type { Planet } from '@/entities/planet/model/types';
import type { Species } from '@/entities/species/model/types';
import type { Starship } from '@/entities/starship/model/types';
import type { Vehicle } from '@/entities/vehicle/model/types';
import charactersJson from '@/shared/data/characters.json';
import filmsJson from '@/shared/data/films.json';
import planetsJson from '@/shared/data/planets.json';
import speciesJson from '@/shared/data/species.json';
import starshipsJson from '@/shared/data/starships.json';
import vehiclesJson from '@/shared/data/vehicles.json';
import type { CodexDataSource } from './data-source';

/**
 * Production data source. Imports bundled JSON snapshots produced by
 * `scripts/build-data.ts`. Schema validation runs at build time, so we
 * trust the typed JSON at runtime — no re-validation.
 */
export const jsonDataSource: CodexDataSource = {
  getCharacters: () => Promise.resolve(charactersJson as Character[]),
  getFilms: () => Promise.resolve(filmsJson as Film[]),
  getPlanets: () => Promise.resolve(planetsJson as Planet[]),
  getSpecies: () => Promise.resolve(speciesJson as Species[]),
  getStarships: () => Promise.resolve(starshipsJson as Starship[]),
  getVehicles: () => Promise.resolve(vehiclesJson as Vehicle[]),
};
