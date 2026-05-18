import { entityRefSchema, slugSchema } from '@/shared/model/schema';
import * as v from 'valibot';
import type { Film } from './types';

export const filmSchema = v.object({
  id: slugSchema,
  title: v.pipe(v.string(), v.minLength(1)),
  episode: v.pipe(v.number(), v.integer()),
  description: v.string(),
  openingCrawl: v.string(),
  director: v.string(),
  producer: v.string(),
  releaseDate: v.pipe(v.string(), v.regex(/^\d{4}-\d{2}-\d{2}$/)),
  characters: v.array(entityRefSchema('character')),
  planets: v.array(entityRefSchema('planet')),
  starships: v.array(entityRefSchema('starship')),
  vehicles: v.array(entityRefSchema('vehicle')),
  species: v.array(entityRefSchema('species')),
});

const _typeCheck: Film = {} as v.InferOutput<typeof filmSchema>;
void _typeCheck;
