import * as v from 'valibot';
import type { EntityType } from './types';

/** Shared valibot building blocks for every entity schema. */

export const slugSchema = v.pipe(v.string(), v.minLength(1), v.regex(/^[a-z0-9-]+$/));

export const entityRefSchema = <T extends EntityType>(type: T) =>
  v.object({
    id: slugSchema,
    name: v.pipe(v.string(), v.minLength(1)),
    type: v.literal(type),
    href: v.pipe(v.string(), v.startsWith(`/api/v1/${type}s/`)),
  });

export const nullablePositiveNumber = v.nullable(v.pipe(v.number(), v.minValue(0)));
export const nullableString = v.nullable(v.string());
