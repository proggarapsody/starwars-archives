import type { CodexDataSource } from '@/shared/api/data-source';
import { slugify } from '@/shared/lib/slug';
import type { Slug } from '@/shared/model';
import type { Planet } from '../model/types';

export type PlanetFilters = {
  climate?: string;
  terrain?: string;
};

export class PlanetRepository {
  constructor(private readonly dataSource: CodexDataSource) {}

  async findBySlug(slug: Slug): Promise<Planet | null> {
    const all = await this.dataSource.getPlanets();
    return all.find((p) => p.id === slug) ?? null;
  }

  async findAll(): Promise<Planet[]> {
    const all = await this.dataSource.getPlanets();
    return [...all].sort((a, b) => a.name.localeCompare(b.name));
  }

  async find(filters: PlanetFilters): Promise<Planet[]> {
    const all = await this.findAll();
    return all.filter((p) => {
      if (filters.climate && !p.climate.some((c) => slugify(c) === filters.climate)) return false;
      if (filters.terrain && !p.terrain.some((t) => slugify(t) === filters.terrain)) return false;
      return true;
    });
  }
}
