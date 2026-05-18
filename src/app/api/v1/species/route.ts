import type { SpeciesFilters } from '@/entities/species/api/SpeciesRepository';
import { species } from '@/shared/api';
import { makeListHandler } from '@/shared/api/http/handlers';

function parseFilters(params: URLSearchParams): SpeciesFilters {
  const filters: SpeciesFilters = {};
  const classification = params.get('classification');
  if (classification) filters.classification = classification;
  return filters;
}

export const GET = makeListHandler({
  findItems: (params) => species.find(parseFilters(params)),
});
