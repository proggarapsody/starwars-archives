import type { CodexDataSource } from '@/shared/api/data-source';
import type { Slug } from '@/shared/model';
import type { Species } from '../model/types';

export type SpeciesFilters = {
  classification?: string;
};

export class SpeciesRepository {
  constructor(private readonly dataSource: CodexDataSource) {}

  async findBySlug(slug: Slug): Promise<Species | null> {
    const all = await this.dataSource.getSpecies();
    return all.find((s) => s.id === slug) ?? null;
  }

  async findAll(): Promise<Species[]> {
    const all = await this.dataSource.getSpecies();
    return [...all].sort((a, b) => a.name.localeCompare(b.name));
  }

  async find(filters: SpeciesFilters): Promise<Species[]> {
    const all = await this.findAll();
    return all.filter((s) => {
      if (filters.classification && s.classification !== filters.classification) return false;
      return true;
    });
  }
}
