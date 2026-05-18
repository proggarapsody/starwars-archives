import type { Starship } from '@/entities/starship/model/types';
import { slugify } from '@/shared/lib/slug';
import type { SwapiStarship } from '../sources/swapi-info';
import type { RefIndex } from './ref';
import { parseSwapiList, parseSwapiNumber, parseSwapiString } from './swapi-quantity';

export function normalizeStarship(raw: SwapiStarship, refs: RefIndex): Starship {
  return {
    id: slugify(raw.name),
    name: raw.name,
    description: '',
    model: parseSwapiString(raw.model),
    manufacturer: parseSwapiList(raw.manufacturer),
    starshipClass: parseSwapiString(raw.starship_class),
    costCredits: parseSwapiNumber(raw.cost_in_credits),
    lengthMeters: parseSwapiNumber(raw.length),
    crew: parseSwapiString(raw.crew),
    passengers: parseSwapiNumber(raw.passengers),
    cargoCapacityKg: parseSwapiNumber(raw.cargo_capacity),
    consumables: parseSwapiString(raw.consumables),
    hyperdriveRating: parseSwapiNumber(raw.hyperdrive_rating),
    mglt: parseSwapiNumber(raw.MGLT),
    maxAtmospheringSpeed: parseSwapiNumber(raw.max_atmosphering_speed),
    pilots: refs.resolveMany('character', raw.pilots),
    films: refs.resolveMany('film', raw.films),
  };
}
