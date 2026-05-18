import { entityRefSchema, nullableString, slugSchema } from '@/shared/model/schema';
import * as v from 'valibot';
import type { Planet } from './types';

const nullableNonNegative = v.nullable(v.pipe(v.number(), v.minValue(0)));

export const planetSchema = v.object({
  id: slugSchema,
  name: v.pipe(v.string(), v.minLength(1)),
  description: v.string(),
  climate: v.array(v.string()),
  terrain: v.array(v.string()),
  diameterKm: nullableNonNegative,
  gravity: nullableString,
  rotationHours: nullableNonNegative,
  orbitDays: nullableNonNegative,
  surfaceWaterPercent: nullableNonNegative,
  population: nullableNonNegative,
  residents: v.array(entityRefSchema('character')),
  films: v.array(entityRefSchema('film')),
});

const _typeCheck: Planet = {} as v.InferOutput<typeof planetSchema>;
void _typeCheck;
