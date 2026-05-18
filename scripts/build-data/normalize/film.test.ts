import { describe, expect, test } from 'vitest';
import type { SwapiFilm } from '../sources/swapi-info';
import { normalizeFilm } from './film';
import { RefIndex } from './ref';

const ane: SwapiFilm = {
  url: 'https://swapi.info/api/films/1',
  title: 'A New Hope',
  episode_id: 4,
  opening_crawl: 'It is a period of civil war...',
  director: 'George Lucas',
  producer: 'Gary Kurtz, Rick McCallum',
  release_date: '1977-05-25',
  characters: ['https://swapi.info/api/people/1'],
  planets: ['https://swapi.info/api/planets/1'],
  starships: [],
  vehicles: [],
  species: [],
};

describe('normalizeFilm', () => {
  test('derives a slug from the title', () => {
    const refs = new RefIndex();
    expect(normalizeFilm(ane, refs).id).toBe('a-new-hope');
  });

  test('maps title, episode, director, producer, opening crawl', () => {
    const refs = new RefIndex();
    const result = normalizeFilm(ane, refs);
    expect(result.title).toBe('A New Hope');
    expect(result.episode).toBe(4);
    expect(result.director).toBe('George Lucas');
    expect(result.producer).toBe('Gary Kurtz, Rick McCallum');
    expect(result.openingCrawl).toBe('It is a period of civil war...');
    expect(result.releaseDate).toBe('1977-05-25');
  });

  test('resolves character URLs against the ref index', () => {
    const refs = new RefIndex();
    refs.register('character', 'https://swapi.info/api/people/1', 'Luke Skywalker');
    refs.register('planet', 'https://swapi.info/api/planets/1', 'Tatooine');

    const result = normalizeFilm(ane, refs);
    expect(result.characters).toEqual([
      {
        id: 'luke-skywalker',
        name: 'Luke Skywalker',
        type: 'character',
        href: '/api/v1/characters/luke-skywalker',
      },
    ]);
    expect(result.planets[0]?.id).toBe('tatooine');
  });

  test('omits unresolved refs silently', () => {
    const refs = new RefIndex();
    const result = normalizeFilm(ane, refs);
    expect(result.characters).toEqual([]);
    expect(result.planets).toEqual([]);
  });

  test('defaults description to empty string', () => {
    const refs = new RefIndex();
    expect(normalizeFilm(ane, refs).description).toBe('');
  });
});
