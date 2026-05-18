import type { EntityRef, Slug } from '@/shared/model';

export type Vehicle = {
  id: Slug;
  name: string;
  description: string;
  model: string | null;
  manufacturer: string[];
  vehicleClass: string | null;
  costCredits: number | null;
  lengthMeters: number | null;
  crew: string | null;
  passengers: number | null;
  cargoCapacityKg: number | null;
  consumables: string | null;
  maxAtmospheringSpeed: number | null;
  pilots: EntityRef<'character'>[];
  films: EntityRef<'film'>[];
};
