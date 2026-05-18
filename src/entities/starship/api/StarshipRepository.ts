import type { CodexDataSource } from '@/shared/api/data-source';
import { slugify } from '@/shared/lib/slug';
import type { Slug } from '@/shared/model';
import type { Starship } from '../model/types';

export type StarshipFilters = {
  class?: string;
  manufacturer?: string;
};

export class StarshipRepository {
  constructor(private readonly dataSource: CodexDataSource) {}

  async findBySlug(slug: Slug): Promise<Starship | null> {
    const all = await this.dataSource.getStarships();
    return all.find((s) => s.id === slug) ?? null;
  }

  async findAll(): Promise<Starship[]> {
    const all = await this.dataSource.getStarships();
    return [...all].sort((a, b) => a.name.localeCompare(b.name));
  }

  async find(filters: StarshipFilters): Promise<Starship[]> {
    const all = await this.findAll();
    return all.filter((s) => {
      if (
        filters.class &&
        (s.starshipClass === null || slugify(s.starshipClass) !== filters.class)
      ) {
        return false;
      }
      if (
        filters.manufacturer &&
        !s.manufacturer.some((m) => slugify(m) === filters.manufacturer)
      ) {
        return false;
      }
      return true;
    });
  }
}
