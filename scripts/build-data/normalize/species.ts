import type { Species } from '@/entities/species/model/types';
import { slugify } from '@/shared/lib/slug';
import type { SwapiSpecies } from '../sources/swapi-info';
import type { RefIndex } from './ref';
import { parseSwapiList, parseSwapiNumber, parseSwapiString } from './swapi-quantity';

export function normalizeSpecies(raw: SwapiSpecies, refs: RefIndex): Species {
  return {
    id: slugify(raw.name),
    name: raw.name,
    description: '',
    classification: parseSwapiString(raw.classification),
    designation: parseSwapiString(raw.designation),
    averageHeightCm: parseSwapiNumber(raw.average_height),
    averageLifespanYears: parseSwapiNumber(raw.average_lifespan),
    language: parseSwapiString(raw.language),
    skinColors: parseSwapiList(raw.skin_colors),
    hairColors: parseSwapiList(raw.hair_colors),
    eyeColors: parseSwapiList(raw.eye_colors),
    homeworld: raw.homeworld ? refs.resolve('planet', raw.homeworld) : null,
    characters: refs.resolveMany('character', raw.people),
    films: refs.resolveMany('film', raw.films),
  };
}
