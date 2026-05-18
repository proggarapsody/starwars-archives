import { entityRefSchema, nullableString, slugSchema } from '@/shared/model/schema';
import * as v from 'valibot';
import type { Vehicle } from './types';

const nullableNonNegative = v.nullable(v.pipe(v.number(), v.minValue(0)));

export const vehicleSchema = v.object({
  id: slugSchema,
  name: v.pipe(v.string(), v.minLength(1)),
  description: v.string(),
  model: nullableString,
  manufacturer: v.array(v.string()),
  vehicleClass: nullableString,
  costCredits: nullableNonNegative,
  lengthMeters: nullableNonNegative,
  crew: nullableString,
  passengers: nullableNonNegative,
  cargoCapacityKg: nullableNonNegative,
  consumables: nullableString,
  maxAtmospheringSpeed: nullableNonNegative,
  pilots: v.array(entityRefSchema('character')),
  films: v.array(entityRefSchema('film')),
});

const _typeCheck: Vehicle = {} as v.InferOutput<typeof vehicleSchema>;
void _typeCheck;
