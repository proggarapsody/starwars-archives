import type { PlanetFilters } from '@/entities/planet/api/PlanetRepository';
import { planets } from '@/shared/api';
import { makeListHandler } from '@/shared/api/http/handlers';

function parseFilters(params: URLSearchParams): PlanetFilters {
  const filters: PlanetFilters = {};
  const climate = params.get('climate');
  if (climate) filters.climate = climate;
  const terrain = params.get('terrain');
  if (terrain) filters.terrain = terrain;
  return filters;
}

export const GET = makeListHandler({
  findItems: (params) => planets.find(parseFilters(params)),
});
