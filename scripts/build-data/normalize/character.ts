import type { Character, CharacterGender } from '@/entities/character/model/types';
import { slugify } from '@/shared/lib/slug';
import type { Side, Slug } from '@/shared/model';
import type { AkababCharacter } from '../sources/akabab';
import { kgToMass, metersToLength, signedYearToYear } from './quantity';

export type NormalizeCharacterContext = {
  /** Hand-tagged map: slug → side. Used to assign 'light' / 'dark' / 'none'. */
  sides: Record<Slug, Side>;
};

const UNKNOWN_SENTINELS = new Set(['', 'n/a', 'unknown', 'none', 'na']);

function nullableString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (UNKNOWN_SENTINELS.has(trimmed.toLowerCase())) return null;
  return trimmed;
}

/**
 * akabab is inconsistent: some array-typed fields arrive as bare strings.
 * Coerce to a defensive array of non-empty trimmed strings.
 */
function toStringArray(value: unknown): string[] {
  if (value == null) return [];
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length === 0 ? [] : [trimmed];
  }
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function normalizeGender(raw: string | null | undefined): CharacterGender | null {
  const value = nullableString(raw);
  if (value === null) return null;
  const lower = value.toLowerCase();
  if (lower === 'male' || lower === 'female') return lower;
  if (lower === 'droid' || lower === 'n/a (droid)') return 'droid';
  return 'other';
}

function planetRef(homeworld: string | null | undefined) {
  const slug = nullableString(homeworld);
  if (slug === null) return null;
  // akabab already provides lowercase, single-word names; slugify normalizes any drift.
  const id = slugify(slug);
  return {
    id,
    name: titleCase(slug),
    type: 'planet' as const,
    href: `/api/v1/planets/${id}` as const,
  };
}

function titleCase(value: string): string {
  return value
    .split(/[-\s]+/)
    .map((part) => {
      const first = part.charAt(0);
      return first === '' ? part : first.toUpperCase() + part.slice(1);
    })
    .join(' ');
}

export function normalizeCharacter(
  raw: AkababCharacter,
  context: NormalizeCharacterContext,
): Character {
  const id = slugify(raw.name);
  const side: Side = context.sides[id] ?? 'none';

  return {
    id,
    name: raw.name.trim(),
    description: '',
    image: nullableString(raw.image),
    side,
    gender: normalizeGender(raw.gender),
    birthYear: signedYearToYear(raw.born ?? null),
    deathYear: signedYearToYear(raw.died ?? null),
    height: metersToLength(raw.height ?? null),
    mass: kgToMass(raw.mass ?? null),
    appearance: {
      hairColor: nullableString(raw.hairColor),
      eyeColor: nullableString(raw.eyeColor),
      skinColor: nullableString(raw.skinColor),
    },
    cybernetics: nullableString(raw.cybernetics),
    homeworld: planetRef(raw.homeworld),
    species: [],
    films: [],
    starships: [],
    vehicles: [],
    affiliations: toStringArray(raw.affiliations),
    masters: toStringArray(raw.masters),
    apprentices: toStringArray(raw.apprentices),
  };
}
