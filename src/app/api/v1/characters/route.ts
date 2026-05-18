import type { CharacterFilters } from '@/entities/character/api/CharacterRepository';
import { characters } from '@/shared/api';
import { makeListHandler } from '@/shared/api/http/handlers';
import type { Side } from '@/shared/model';

const SIDES = new Set<Side>(['light', 'dark', 'none']);

function parseFilters(params: URLSearchParams): CharacterFilters {
  const filters: CharacterFilters = {};
  const side = params.get('side');
  if (side !== null && SIDES.has(side as Side)) filters.side = side as Side;
  const affiliation = params.get('affiliation');
  if (affiliation) filters.affiliation = affiliation;
  const homeworld = params.get('homeworld');
  if (homeworld) filters.homeworld = homeworld;
  const species = params.get('species');
  if (species) filters.species = species;
  const film = params.get('film');
  if (film) filters.film = film;
  const gender = params.get('gender');
  if (gender) filters.gender = gender;
  return filters;
}

export const GET = makeListHandler({
  findItems: (params) => characters.find(parseFilters(params)),
});
