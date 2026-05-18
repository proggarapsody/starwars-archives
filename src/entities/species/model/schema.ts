import { entityRefSchema, nullableString, slugSchema } from '@/shared/model/schema';
import * as v from 'valibot';
import type { Species } from './types';

const nullableNonNegative = v.nullable(v.pipe(v.number(), v.minValue(0)));

export const speciesSchema = v.object({
  id: slugSchema,
  name: v.pipe(v.string(), v.minLength(1)),
  description: v.string(),
  classification: nullableString,
  designation: nullableString,
  averageHeightCm: nullableNonNegative,
  averageLifespanYears: nullableNonNegative,
  language: nullableString,
  skinColors: v.array(v.string()),
  hairColors: v.array(v.string()),
  eyeColors: v.array(v.string()),
  homeworld: v.nullable(entityRefSchema('planet')),
  characters: v.array(entityRefSchema('character')),
  films: v.array(entityRefSchema('film')),
});

const _typeCheck: Species = {} as v.InferOutput<typeof speciesSchema>;
void _typeCheck;
