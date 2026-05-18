import type { VehicleFilters } from '@/entities/vehicle/api/VehicleRepository';
import { vehicles } from '@/shared/api';
import { makeListHandler } from '@/shared/api/http/handlers';

function parseFilters(params: URLSearchParams): VehicleFilters {
  const filters: VehicleFilters = {};
  const cls = params.get('class');
  if (cls) filters.class = cls;
  const manufacturer = params.get('manufacturer');
  if (manufacturer) filters.manufacturer = manufacturer;
  return filters;
}

export const GET = makeListHandler({
  findItems: (params) => vehicles.find(parseFilters(params)),
});
