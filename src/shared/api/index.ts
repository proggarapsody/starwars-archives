import { CharacterRepository } from '@/entities/character/api/CharacterRepository';
import { FilmRepository } from '@/entities/film/api/FilmRepository';
import { PlanetRepository } from '@/entities/planet/api/PlanetRepository';
import { SpeciesRepository } from '@/entities/species/api/SpeciesRepository';
import { StarshipRepository } from '@/entities/starship/api/StarshipRepository';
import { VehicleRepository } from '@/entities/vehicle/api/VehicleRepository';
import { jsonDataSource } from './json-data-source';

/**
 * Composition root. The single place where the data source is bound to
 * repositories. UI and route handlers import from here.
 *
 *   import { characters, films } from '@/shared/api';
 *   const luke = await characters.findBySlug('luke-skywalker');
 *   const saga = await films.findAll();
 */
export const characters = new CharacterRepository(jsonDataSource);
export const films = new FilmRepository(jsonDataSource);
export const planets = new PlanetRepository(jsonDataSource);
export const species = new SpeciesRepository(jsonDataSource);
export const starships = new StarshipRepository(jsonDataSource);
export const vehicles = new VehicleRepository(jsonDataSource);

export type { CodexDataSource } from './data-source';
