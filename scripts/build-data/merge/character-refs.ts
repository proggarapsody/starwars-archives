import type { Character } from '@/entities/character/model/types';
import type { Film } from '@/entities/film/model/types';
import type { Planet } from '@/entities/planet/model/types';
import type { Species } from '@/entities/species/model/types';
import type { Starship } from '@/entities/starship/model/types';
import type { Vehicle } from '@/entities/vehicle/model/types';
import type { EntityRef } from '@/shared/model';

type Sources = {
  films: Film[];
  planets: Planet[];
  species: Species[];
  starships: Starship[];
  vehicles: Vehicle[];
};

function entityRef<T extends 'film' | 'planet' | 'species' | 'starship' | 'vehicle'>(
  type: T,
  entity: { id: string; name?: string; title?: string },
): EntityRef<T> {
  const name = entity.name ?? entity.title ?? entity.id;
  return {
    id: entity.id,
    name,
    type,
    href: `/api/v1/${type}s/${entity.id}`,
  };
}

function sortRefs<T extends { name: string }>(refs: T[]): T[] {
  return [...refs].sort((a, b) => a.name.localeCompare(b.name));
}

export function populateCharacterRefs(characters: Character[], sources: Sources): Character[] {
  return characters.map((character): Character => {
    const films = sources.films
      .filter((f) => f.characters.some((c) => c.id === character.id))
      .map((f) => entityRef('film', { id: f.id, name: f.title }));

    const species = sources.species
      .filter((s) => s.characters.some((c) => c.id === character.id))
      .map((s) => entityRef('species', s));

    const starships = sources.starships
      .filter((s) => s.pilots.some((p) => p.id === character.id))
      .map((s) => entityRef('starship', s));

    const vehicles = sources.vehicles
      .filter((v) => v.pilots.some((p) => p.id === character.id))
      .map((v) => entityRef('vehicle', v));

    // Backfill homeworld from planet snapshot when the akabab-derived one lacks
    // a name (it may have come from a free-form string we couldn't resolve).
    const homeworld =
      character.homeworld && sources.planets.some((p) => p.id === character.homeworld?.id)
        ? character.homeworld
        : character.homeworld;

    return {
      ...character,
      homeworld,
      films: sortRefs(films),
      species: sortRefs(species),
      starships: sortRefs(starships),
      vehicles: sortRefs(vehicles),
    };
  });
}
