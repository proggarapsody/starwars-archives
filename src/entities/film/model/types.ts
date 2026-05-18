import type { EntityRef, Slug } from '@/shared/model';

export type Film = {
  id: Slug;
  title: string;
  episode: number;
  description: string;
  openingCrawl: string;
  director: string;
  producer: string;
  releaseDate: string; // ISO date, YYYY-MM-DD
  characters: EntityRef<'character'>[];
  planets: EntityRef<'planet'>[];
  starships: EntityRef<'starship'>[];
  vehicles: EntityRef<'vehicle'>[];
  species: EntityRef<'species'>[];
};
