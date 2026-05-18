import * as v from 'valibot';
import type { Character } from './types';

const slugSchema = v.pipe(v.string(), v.minLength(1), v.regex(/^[a-z0-9-]+$/));

const yearSchema = v.object({
  value: v.pipe(v.number(), v.minValue(0)),
  era: v.picklist(['BBY', 'ABY']),
});

const lengthSchema = v.object({
  cm: v.pipe(v.number(), v.minValue(1)),
});

const massSchema = v.object({
  kg: v.pipe(v.number(), v.minValue(0.001)),
});

const entityRefSchema = <T extends string>(type: T) =>
  v.object({
    id: slugSchema,
    name: v.pipe(v.string(), v.minLength(1)),
    type: v.literal(type),
    href: v.pipe(v.string(), v.startsWith(`/api/v1/${type}s/`)),
  });

const sideSchema = v.picklist(['light', 'dark', 'none']);

const genderSchema = v.picklist(['male', 'female', 'other', 'droid']);

export const characterSchema = v.object({
  id: slugSchema,
  name: v.pipe(v.string(), v.minLength(1)),
  description: v.string(),
  image: v.nullable(v.string()),
  side: sideSchema,
  gender: v.nullable(genderSchema),
  birthYear: v.nullable(yearSchema),
  deathYear: v.nullable(yearSchema),
  height: v.nullable(lengthSchema),
  mass: v.nullable(massSchema),
  appearance: v.object({
    hairColor: v.nullable(v.string()),
    eyeColor: v.nullable(v.string()),
    skinColor: v.nullable(v.string()),
  }),
  cybernetics: v.nullable(v.string()),
  homeworld: v.nullable(entityRefSchema('planet')),
  species: v.array(entityRefSchema('species')),
  films: v.array(entityRefSchema('film')),
  starships: v.array(entityRefSchema('starship')),
  vehicles: v.array(entityRefSchema('vehicle')),
  affiliations: v.array(v.string()),
  masters: v.array(v.string()),
  apprentices: v.array(v.string()),
});

// Compile-time check: the inferred schema output matches the hand-written type.
// If these diverge, the assignment below errors and the build fails.
const _typeCheck: Character = {} as v.InferOutput<typeof characterSchema>;
void _typeCheck;
