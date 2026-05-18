import type { EntityRef, Length, Mass, Side, Slug, Year } from '@/shared/model';

export type CharacterGender = 'male' | 'female' | 'other' | 'droid';

export type Character = {
  id: Slug;
  name: string;
  description: string;
  image: string | null;
  side: Side;
  gender: CharacterGender | null;
  birthYear: Year | null;
  deathYear: Year | null;
  height: Length | null;
  mass: Mass | null;
  appearance: {
    hairColor: string | null;
    eyeColor: string | null;
    skinColor: string | null;
  };
  cybernetics: string | null;
  homeworld: EntityRef<'planet'> | null;
  species: EntityRef<'species'>[];
  films: EntityRef<'film'>[];
  starships: EntityRef<'starship'>[];
  vehicles: EntityRef<'vehicle'>[];
  affiliations: string[];
  masters: string[];
  apprentices: string[];
};
