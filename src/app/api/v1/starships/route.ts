import type { StarshipFilters } from '@/entities/starship/api/StarshipRepository';
import { starships } from '@/shared/api';
import { makeListHandler } from '@/shared/api/http/handlers';

function parseFilters(params: URLSearchParams): StarshipFilters {
  const filters: StarshipFilters = {};
  const cls = params.get('class');
  if (cls) filters.class = cls;
  const manufacturer = params.get('manufacturer');
  if (manufacturer) filters.manufacturer = manufacturer;
  return filters;
}

export const GET = makeListHandler({
  findItems: (params) => starships.find(parseFilters(params)),
});
