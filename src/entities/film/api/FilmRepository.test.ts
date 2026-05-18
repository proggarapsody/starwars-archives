import type { Film } from '@/entities/film/model/types';
import { createFakeDataSource } from '@/shared/api/testing';
import { describe, expect, test } from 'vitest';
import { FilmRepository } from './FilmRepository';

function makeFilm(overrides: Partial<Film>): Film {
  return {
    id: 'untitled',
    title: 'Untitled',
    episode: 0,
    description: '',
    openingCrawl: '',
    director: '',
    producer: '',
    releaseDate: '2020-01-01',
    characters: [],
    planets: [],
    starships: [],
    vehicles: [],
    species: [],
    ...overrides,
  };
}

const ane = makeFilm({ id: 'a-new-hope', title: 'A New Hope', episode: 4 });
const tesb = makeFilm({
  id: 'the-empire-strikes-back',
  title: 'The Empire Strikes Back',
  episode: 5,
});
const rotj = makeFilm({ id: 'return-of-the-jedi', title: 'Return of the Jedi', episode: 6 });

describe('FilmRepository', () => {
  test('findBySlug returns the matching film', async () => {
    const repo = new FilmRepository(createFakeDataSource({ films: [ane, tesb, rotj] }));
    expect((await repo.findBySlug('a-new-hope'))?.title).toBe('A New Hope');
  });

  test('findBySlug returns null when no film matches', async () => {
    const repo = new FilmRepository(createFakeDataSource({ films: [ane] }));
    expect(await repo.findBySlug('cabin-in-the-galaxy')).toBeNull();
  });

  test('findAll sorts films by episode ascending', async () => {
    const repo = new FilmRepository(createFakeDataSource({ films: [rotj, ane, tesb] }));
    const all = await repo.findAll();
    expect(all.map((f) => f.episode)).toEqual([4, 5, 6]);
  });
});
