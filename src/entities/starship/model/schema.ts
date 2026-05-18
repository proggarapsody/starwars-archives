import { entityRefSchema, nullableString, slugSchema } from '@/shared/model/schema';
import * as v from 'valibot';
import type { Starship } from './types';

const nullableNonNegative = v.nullable(v.pipe(v.number(), v.minValue(0)));

export const starshipSchema = v.object({
  id: slugSchema,
  name: v.pipe(v.string(), v.minLength(1)),
  description: v.string(),
  model: nullableString,
  manufacturer: v.array(v.string()),
  starshipClass: nullableString,
  costCredits: nullableNonNegative,
  lengthMeters: nullableNonNegative,
  crew: nullableString,
  passengers: nullableNonNegative,
  cargoCapacityKg: nullableNonNegative,
  consumables: nullableString,
  hyperdriveRating: nullableNonNegative,
  mglt: nullableNonNegative,
  maxAtmospheringSpeed: nullableNonNegative,
  pilots: v.array(entityRefSchema('character')),
  films: v.array(entityRefSchema('film')),
});

const _typeCheck: Starship = {} as v.InferOutput<typeof starshipSchema>;
void _typeCheck;
