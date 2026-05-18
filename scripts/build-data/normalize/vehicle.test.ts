import { describe, expect, test } from 'vitest';
import type { SwapiVehicle } from '../sources/swapi-info';
import { RefIndex } from './ref';
import { normalizeVehicle } from './vehicle';

const atst: SwapiVehicle = {
  url: 'https://swapi.info/api/vehicles/19',
  name: 'AT-ST',
  model: 'All Terrain Scout Transport',
  manufacturer: 'Kuat Drive Yards, Imperial Department of Military Research',
  cost_in_credits: 'unknown',
  length: '2',
  max_atmosphering_speed: '90',
  crew: '2',
  passengers: '0',
  cargo_capacity: '200',
  consumables: 'none',
  vehicle_class: 'walker',
  pilots: [],
  films: [],
};

describe('normalizeVehicle', () => {
  test('parses numeric stats and resolves nullable cost', () => {
    const result = normalizeVehicle(atst, new RefIndex());
    expect(result.costCredits).toBeNull();
    expect(result.lengthMeters).toBe(2);
    expect(result.maxAtmospheringSpeed).toBe(90);
    expect(result.cargoCapacityKg).toBe(200);
  });

  test('exposes vehicle class as a string', () => {
    expect(normalizeVehicle(atst, new RefIndex()).vehicleClass).toBe('walker');
  });

  test('treats "none" consumables as null', () => {
    expect(normalizeVehicle(atst, new RefIndex()).consumables).toBeNull();
  });
});
