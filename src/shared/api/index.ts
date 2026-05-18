import { CharacterRepository } from '@/entities/character/api/CharacterRepository';
import { jsonDataSource } from './json-data-source';

/**
 * Composition root. The single place where the data source is bound to
 * repositories. UI and route handlers import from here.
 *
 *   import { characters } from '@/shared/api';
 *   const luke = await characters.findBySlug('luke-skywalker');
 */
export const characters = new CharacterRepository(jsonDataSource);

export type { CodexDataSource } from './data-source';
