import type { EntityRef, Slug } from '@/shared/model';

export type Starship = {
  id: Slug;
  name: string;
  description: string;
  model: string | null;
  manufacturer: string[];
  starshipClass: string | null;
  costCredits: number | null;
  lengthMeters: number | null;
  crew: string | null;
  passengers: number | null;
  cargoCapacityKg: number | null;
  consumables: string | null;
  hyperdriveRating: number | null;
  mglt: number | null;
  maxAtmospheringSpeed: number | null;
  pilots: EntityRef<'character'>[];
  films: EntityRef<'film'>[];
};
