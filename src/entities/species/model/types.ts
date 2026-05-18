import type { EntityRef, Slug } from '@/shared/model';

export type Species = {
  id: Slug;
  name: string;
  description: string;
  classification: string | null;
  designation: string | null;
  averageHeightCm: number | null;
  averageLifespanYears: number | null;
  language: string | null;
  skinColors: string[];
  hairColors: string[];
  eyeColors: string[];
  homeworld: EntityRef<'planet'> | null;
  characters: EntityRef<'character'>[];
  films: EntityRef<'film'>[];
};
