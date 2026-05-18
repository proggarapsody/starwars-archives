import type { Planet } from '@/entities/planet/model/types';
import { slugify } from '@/shared/lib/slug';
import type { SwapiPlanet } from '../sources/swapi-info';
import type { RefIndex } from './ref';
import { parseSwapiList, parseSwapiNumber, parseSwapiString } from './swapi-quantity';

export function normalizePlanet(raw: SwapiPlanet, refs: RefIndex): Planet {
  return {
    id: slugify(raw.name),
    name: raw.name,
    description: '',
    climate: parseSwapiList(raw.climate),
    terrain: parseSwapiList(raw.terrain),
    diameterKm: parseSwapiNumber(raw.diameter),
    gravity: parseSwapiString(raw.gravity),
    rotationHours: parseSwapiNumber(raw.rotation_period),
    orbitDays: parseSwapiNumber(raw.orbital_period),
    surfaceWaterPercent: parseSwapiNumber(raw.surface_water),
    population: parseSwapiNumber(raw.population),
    residents: refs.resolveMany('character', raw.residents),
    films: refs.resolveMany('film', raw.films),
  };
}
