import type { Character } from '@/entities/character/model/types';
import charactersJson from '@/shared/data/characters.json';
import type { CodexDataSource } from './data-source';

/**
 * Production data source. Imports bundled JSON snapshots produced by
 * `scripts/build-data.ts`. The JSON is committed to the repo and treated as
 * the canonical, validated runtime data.
 *
 * Schema validation happens at build time (in scripts/build-data/index.ts),
 * so we trust the typed JSON at runtime — no re-validation.
 */
const characters = charactersJson as Character[];

export const jsonDataSource: CodexDataSource = {
  getCharacters: () => Promise.resolve(characters),
};
