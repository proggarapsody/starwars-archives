import type { Vehicle } from '@/entities/vehicle/model/types';
import { slugify } from '@/shared/lib/slug';
import type { SwapiVehicle } from '../sources/swapi-info';
import type { RefIndex } from './ref';
import { parseSwapiList, parseSwapiNumber, parseSwapiString } from './swapi-quantity';

export function normalizeVehicle(raw: SwapiVehicle, refs: RefIndex): Vehicle {
  return {
    id: slugify(raw.name),
    name: raw.name,
    description: '',
    model: parseSwapiString(raw.model),
    manufacturer: parseSwapiList(raw.manufacturer),
    vehicleClass: parseSwapiString(raw.vehicle_class),
    costCredits: parseSwapiNumber(raw.cost_in_credits),
    lengthMeters: parseSwapiNumber(raw.length),
    crew: parseSwapiString(raw.crew),
    passengers: parseSwapiNumber(raw.passengers),
    cargoCapacityKg: parseSwapiNumber(raw.cargo_capacity),
    consumables: parseSwapiString(raw.consumables),
    maxAtmospheringSpeed: parseSwapiNumber(raw.max_atmosphering_speed),
    pilots: refs.resolveMany('character', raw.pilots),
    films: refs.resolveMany('film', raw.films),
  };
}
