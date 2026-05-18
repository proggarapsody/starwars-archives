import type { EntityRef, Slug } from '@/shared/model';

export type Planet = {
  id: Slug;
  name: string;
  description: string;
  climate: string[];
  terrain: string[];
  diameterKm: number | null;
  gravity: string | null; // e.g. "1 standard", "0.85 standard" — varied SWAPI text
  rotationHours: number | null;
  orbitDays: number | null;
  surfaceWaterPercent: number | null;
  population: number | null;
  residents: EntityRef<'character'>[];
  films: EntityRef<'film'>[];
};
