import type { CodexDataSource } from '@/shared/api/data-source';
import type { Slug } from '@/shared/model';
import type { Film } from '../model/types';

export class FilmRepository {
  constructor(private readonly dataSource: CodexDataSource) {}

  async findBySlug(slug: Slug): Promise<Film | null> {
    const all = await this.dataSource.getFilms();
    return all.find((f) => f.id === slug) ?? null;
  }

  async findAll(): Promise<Film[]> {
    const all = await this.dataSource.getFilms();
    return [...all].sort((a, b) => a.episode - b.episode);
  }
}
