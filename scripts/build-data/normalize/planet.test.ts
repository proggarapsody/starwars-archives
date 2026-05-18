import { describe, expect, test } from 'vitest';
import type { SwapiPlanet } from '../sources/swapi-info';
import { normalizePlanet } from './planet';
import { RefIndex } from './ref';

const tatooine: SwapiPlanet = {
  url: 'https://swapi.info/api/planets/1',
  name: 'Tatooine',
  rotation_period: '23',
  orbital_period: '304',
  diameter: '10465',
  climate: 'arid',
  gravity: '1 standard',
  terrain: 'desert',
  surface_water: '1',
  population: '200000',
  residents: [],
  films: [],
};

describe('normalizePlanet', () => {
  test('parses numeric stats', () => {
    const result = normalizePlanet(tatooine, new RefIndex());
    expect(result.diameterKm).toBe(10465);
    expect(result.rotationHours).toBe(23);
    expect(result.orbitDays).toBe(304);
    expect(result.surfaceWaterPercent).toBe(1);
    expect(result.population).toBe(200000);
  });

  test('splits climate and terrain into arrays', () => {
    const result = normalizePlanet(
      { ...tatooine, climate: 'temperate, tropical', terrain: 'grasslands, hills, ocean' },
      new RefIndex(),
    );
    expect(result.climate).toEqual(['temperate', 'tropical']);
    expect(result.terrain).toEqual(['grasslands', 'hills', 'ocean']);
  });

  test('keeps gravity as a string (SWAPI uses varied prose)', () => {
    expect(normalizePlanet(tatooine, new RefIndex()).gravity).toBe('1 standard');
  });

  test('handles "unknown" / sentinel values as null', () => {
    const sparse: SwapiPlanet = {
      ...tatooine,
      diameter: 'unknown',
      population: 'unknown',
      gravity: 'N/A',
      surface_water: 'unknown',
    };
    const result = normalizePlanet(sparse, new RefIndex());
    expect(result.diameterKm).toBeNull();
    expect(result.population).toBeNull();
    expect(result.gravity).toBeNull();
    expect(result.surfaceWaterPercent).toBeNull();
  });
});
