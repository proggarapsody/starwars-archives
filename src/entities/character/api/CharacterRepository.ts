import type { CodexDataSource } from '@/shared/api/data-source';
import { slugify } from '@/shared/lib/slug';
import type { Side, Slug } from '@/shared/model';
import type { Character } from '../model/types';

export type CharacterFilters = {
  side?: Side;
  affiliation?: string;
};

export class CharacterRepository {
  constructor(private readonly dataSource: CodexDataSource) {}

  async findBySlug(slug: Slug): Promise<Character | null> {
    const all = await this.dataSource.getCharacters();
    return all.find((c) => c.id === slug) ?? null;
  }

  async findAll(): Promise<Character[]> {
    const all = await this.dataSource.getCharacters();
    return [...all].sort((a, b) => a.name.localeCompare(b.name));
  }

  async find(filters: CharacterFilters): Promise<Character[]> {
    const all = await this.findAll();
    return all.filter((c) => matchesAllFilters(c, filters));
  }
}

function matchesAllFilters(character: Character, filters: CharacterFilters): boolean {
  if (filters.side !== undefined && character.side !== filters.side) return false;
  if (filters.affiliation !== undefined) {
    const target = filters.affiliation.toLowerCase();
    const matched = character.affiliations.some((aff) => slugify(aff) === target);
    if (!matched) return false;
  }
  return true;
}
