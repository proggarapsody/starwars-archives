import { describe, expect, test } from 'vitest';
import type { SwapiStarship } from '../sources/swapi-info';
import { RefIndex } from './ref';
import { normalizeStarship } from './starship';

const falcon: SwapiStarship = {
  url: 'https://swapi.info/api/starships/10',
  name: 'Millennium Falcon',
  model: 'YT-1300 light freighter',
  manufacturer: 'Corellian Engineering Corporation',
  cost_in_credits: '100000',
  length: '34.37',
  max_atmosphering_speed: '1050',
  crew: '4',
  passengers: '6',
  cargo_capacity: '100000',
  consumables: '2 months',
  hyperdrive_rating: '0.5',
  MGLT: '75',
  starship_class: 'Light freighter',
  pilots: [],
  films: [],
};

describe('normalizeStarship', () => {
  test('parses numeric stats', () => {
    const result = normalizeStarship(falcon, new RefIndex());
    expect(result.costCredits).toBe(100000);
    expect(result.lengthMeters).toBe(34.37);
    expect(result.maxAtmospheringSpeed).toBe(1050);
    expect(result.passengers).toBe(6);
    expect(result.cargoCapacityKg).toBe(100000);
    expect(result.hyperdriveRating).toBe(0.5);
    expect(result.mglt).toBe(75);
  });

  test('keeps crew as a string (often a range like "30-165")', () => {
    expect(normalizeStarship({ ...falcon, crew: '30-165' }, new RefIndex()).crew).toBe('30-165');
  });

  test('splits multi-manufacturer strings on commas and "and"', () => {
    const result = normalizeStarship(
      { ...falcon, manufacturer: 'Kuat Drive Yards, Imperial Department of Military Research' },
      new RefIndex(),
    );
    expect(result.manufacturer).toEqual([
      'Kuat Drive Yards',
      'Imperial Department of Military Research',
    ]);
  });
});
