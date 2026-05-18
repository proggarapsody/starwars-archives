import type { Character } from '@/entities/character/model/types';
import type { Film } from '@/entities/film/model/types';
import type { Planet } from '@/entities/planet/model/types';
import type { Species } from '@/entities/species/model/types';
import type { Starship } from '@/entities/starship/model/types';
import type { Vehicle } from '@/entities/vehicle/model/types';
import { describe, expect, test } from 'vitest';
import { populateCharacterRefs } from './character-refs';

function makeCharacter(overrides: Partial<Character>): Character {
  return {
    id: 'luke-skywalker',
    name: 'Luke Skywalker',
    description: '',
    image: null,
    side: 'none',
    gender: null,
    birthYear: null,
    deathYear: null,
    height: null,
    mass: null,
    appearance: { hairColor: null, eyeColor: null, skinColor: null },
    cybernetics: null,
    homeworld: null,
    species: [],
    films: [],
    starships: [],
    vehicles: [],
    affiliations: [],
    masters: [],
    apprentices: [],
    ...overrides,
  };
}

const lukeRef = {
  id: 'luke-skywalker',
  name: 'Luke Skywalker',
  type: 'character' as const,
  href: '/api/v1/characters/luke-skywalker',
};

const ane: Film = {
  id: 'a-new-hope',
  title: 'A New Hope',
  episode: 4,
  description: '',
  openingCrawl: '',
  director: '',
  producer: '',
  releaseDate: '1977-05-25',
  characters: [lukeRef],
  planets: [],
  starships: [],
  vehicles: [],
  species: [],
};

const human: Species = {
  id: 'human',
  name: 'Human',
  description: '',
  classification: null,
  designation: null,
  averageHeightCm: null,
  averageLifespanYears: null,
  language: null,
  skinColors: [],
  hairColors: [],
  eyeColors: [],
  homeworld: null,
  characters: [lukeRef],
  films: [],
};

const xwing: Starship = {
  id: 'x-wing',
  name: 'X-wing',
  description: '',
  model: null,
  manufacturer: [],
  starshipClass: null,
  costCredits: null,
  lengthMeters: null,
  crew: null,
  passengers: null,
  cargoCapacityKg: null,
  consumables: null,
  hyperdriveRating: null,
  mglt: null,
  maxAtmospheringSpeed: null,
  pilots: [lukeRef],
  films: [],
};

const snowspeeder: Vehicle = {
  id: 'snowspeeder',
  name: 'Snowspeeder',
  description: '',
  model: null,
  manufacturer: [],
  vehicleClass: null,
  costCredits: null,
  lengthMeters: null,
  crew: null,
  passengers: null,
  cargoCapacityKg: null,
  consumables: null,
  maxAtmospheringSpeed: null,
  pilots: [lukeRef],
  films: [],
};

describe('populateCharacterRefs', () => {
  test('populates films, species, starships, vehicles from inverse refs', () => {
    const character = makeCharacter({});
    const [result] = populateCharacterRefs([character], {
      films: [ane],
      species: [human],
      starships: [xwing],
      vehicles: [snowspeeder],
      planets: [],
    });

    expect(result?.films.map((r) => r.id)).toEqual(['a-new-hope']);
    expect(result?.species.map((r) => r.id)).toEqual(['human']);
    expect(result?.starships.map((r) => r.id)).toEqual(['x-wing']);
    expect(result?.vehicles.map((r) => r.id)).toEqual(['snowspeeder']);
  });

  test('preserves existing homeworld if already populated', () => {
    const homeworld = {
      id: 'tatooine',
      name: 'Tatooine',
      type: 'planet' as const,
      href: '/api/v1/planets/tatooine',
    };
    const character = makeCharacter({ homeworld });
    const [result] = populateCharacterRefs([character], {
      films: [],
      species: [],
      starships: [],
      vehicles: [],
      planets: [
        {
          id: 'tatooine',
          name: 'Tatooine',
          description: '',
          climate: [],
          terrain: [],
          diameterKm: null,
          gravity: null,
          rotationHours: null,
          orbitDays: null,
          surfaceWaterPercent: null,
          population: null,
          residents: [],
          films: [],
        } satisfies Planet,
      ],
    });

    expect(result?.homeworld?.id).toBe('tatooine');
  });

  test('sorts ref arrays by name', () => {
    const character = makeCharacter({});
    const film2: Film = { ...ane, id: 'return-of-the-jedi', title: 'Return of the Jedi' };
    const film3: Film = { ...ane, id: 'empire-strikes-back', title: 'The Empire Strikes Back' };
    const [result] = populateCharacterRefs([character], {
      films: [film2, ane, film3],
      species: [],
      starships: [],
      vehicles: [],
      planets: [],
    });

    expect(result?.films.map((r) => r.name)).toEqual([
      'A New Hope',
      'Return of the Jedi',
      'The Empire Strikes Back',
    ]);
  });

  test('leaves arrays empty when no inverse refs match', () => {
    const lonely = makeCharacter({ id: 'jaxxon', name: 'Jaxxon' });
    const [result] = populateCharacterRefs([lonely], {
      films: [ane],
      species: [human],
      starships: [xwing],
      vehicles: [snowspeeder],
      planets: [],
    });

    expect(result?.films).toEqual([]);
    expect(result?.species).toEqual([]);
    expect(result?.starships).toEqual([]);
    expect(result?.vehicles).toEqual([]);
  });
});
