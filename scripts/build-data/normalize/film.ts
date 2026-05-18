import type { Film } from '@/entities/film/model/types';
import { slugify } from '@/shared/lib/slug';
import type { SwapiFilm } from '../sources/swapi-info';
import type { RefIndex } from './ref';

export function normalizeFilm(raw: SwapiFilm, refs: RefIndex): Film {
  return {
    id: slugify(raw.title),
    title: raw.title,
    episode: raw.episode_id,
    description: '',
    openingCrawl: raw.opening_crawl,
    director: raw.director,
    producer: raw.producer,
    releaseDate: raw.release_date,
    characters: refs.resolveMany('character', raw.characters),
    planets: refs.resolveMany('planet', raw.planets),
    starships: refs.resolveMany('starship', raw.starships),
    vehicles: refs.resolveMany('vehicle', raw.vehicles),
    species: refs.resolveMany('species', raw.species),
  };
}
