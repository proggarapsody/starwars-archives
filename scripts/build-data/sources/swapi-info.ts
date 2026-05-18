/**
 * swapi.info — community-hosted SWAPI fork, static JSON.
 *
 * Schema-equivalent to original SWAPI: stringly-typed fields, URL-form cross-refs.
 * We normalize both away in scripts/build-data/normalize/.
 */

const BASE = 'https://swapi.info/api';

export type SwapiUrlRef = string;

export type SwapiFilm = {
  url: SwapiUrlRef;
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: SwapiUrlRef[];
  planets: SwapiUrlRef[];
  starships: SwapiUrlRef[];
  vehicles: SwapiUrlRef[];
  species: SwapiUrlRef[];
};

export type SwapiPlanet = {
  url: SwapiUrlRef;
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: SwapiUrlRef[];
  films: SwapiUrlRef[];
};

export type SwapiSpecies = {
  url: SwapiUrlRef;
  name: string;
  classification: string;
  designation: string;
  average_height: string;
  skin_colors: string;
  hair_colors: string;
  eye_colors: string;
  average_lifespan: string;
  homeworld: SwapiUrlRef | null;
  language: string;
  people: SwapiUrlRef[];
  films: SwapiUrlRef[];
};

export type SwapiStarship = {
  url: SwapiUrlRef;
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  hyperdrive_rating: string;
  MGLT: string;
  starship_class: string;
  pilots: SwapiUrlRef[];
  films: SwapiUrlRef[];
};

export type SwapiVehicle = {
  url: SwapiUrlRef;
  name: string;
  model: string;
  manufacturer: string;
  cost_in_credits: string;
  length: string;
  max_atmosphering_speed: string;
  crew: string;
  passengers: string;
  cargo_capacity: string;
  consumables: string;
  vehicle_class: string;
  pilots: SwapiUrlRef[];
  films: SwapiUrlRef[];
};

export type SwapiPerson = {
  url: SwapiUrlRef;
  name: string;
};

export type SwapiBundle = {
  films: SwapiFilm[];
  planets: SwapiPlanet[];
  species: SwapiSpecies[];
  starships: SwapiStarship[];
  vehicles: SwapiVehicle[];
  people: SwapiPerson[];
};

async function fetchJson<T>(path: string, fetchImpl: typeof fetch): Promise<T> {
  const response = await fetchImpl(`${BASE}/${path}`);
  if (!response.ok) {
    throw new Error(`swapi.info ${path} failed: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchSwapiBundle(fetchImpl: typeof fetch = fetch): Promise<SwapiBundle> {
  const [films, planets, species, starships, vehicles, people] = await Promise.all([
    fetchJson<SwapiFilm[]>('films', fetchImpl),
    fetchJson<SwapiPlanet[]>('planets', fetchImpl),
    fetchJson<SwapiSpecies[]>('species', fetchImpl),
    fetchJson<SwapiStarship[]>('starships', fetchImpl),
    fetchJson<SwapiVehicle[]>('vehicles', fetchImpl),
    fetchJson<SwapiPerson[]>('people', fetchImpl),
  ]);
  return { films, planets, species, starships, vehicles, people };
}
