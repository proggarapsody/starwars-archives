import type { CodexDataSource } from '@/shared/api/data-source';
import { slugify } from '@/shared/lib/slug';
import type { Slug } from '@/shared/model';
import type { Vehicle } from '../model/types';

export type VehicleFilters = {
  class?: string;
  manufacturer?: string;
};

export class VehicleRepository {
  constructor(private readonly dataSource: CodexDataSource) {}

  async findBySlug(slug: Slug): Promise<Vehicle | null> {
    const all = await this.dataSource.getVehicles();
    return all.find((v) => v.id === slug) ?? null;
  }

  async findAll(): Promise<Vehicle[]> {
    const all = await this.dataSource.getVehicles();
    return [...all].sort((a, b) => a.name.localeCompare(b.name));
  }

  async find(filters: VehicleFilters): Promise<Vehicle[]> {
    const all = await this.findAll();
    return all.filter((v) => {
      if (filters.class && (v.vehicleClass === null || slugify(v.vehicleClass) !== filters.class)) {
        return false;
      }
      if (
        filters.manufacturer &&
        !v.manufacturer.some((m) => slugify(m) === filters.manufacturer)
      ) {
        return false;
      }
      return true;
    });
  }
}
