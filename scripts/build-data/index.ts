import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { characterSchema } from '@/entities/character/model/schema';
import type { Character } from '@/entities/character/model/types';
import { filmSchema } from '@/entities/film/model/schema';
import type { Film } from '@/entities/film/model/types';
import { planetSchema } from '@/entities/planet/model/schema';
import type { Planet } from '@/entities/planet/model/types';
import { speciesSchema } from '@/entities/species/model/schema';
import type { Species } from '@/entities/species/model/types';
import { starshipSchema } from '@/entities/starship/model/schema';
import type { Starship } from '@/entities/starship/model/types';
import { vehicleSchema } from '@/entities/vehicle/model/schema';
import type { Vehicle } from '@/entities/vehicle/model/types';
import * as v from 'valibot';
import { populateCharacterRefs } from './merge/character-refs';
import { normalizeCharacter } from './normalize/character';
import { normalizeFilm } from './normalize/film';
import { normalizePlanet } from './normalize/planet';
import { RefIndex } from './normalize/ref';
import { normalizeSpecies } from './normalize/species';
import { normalizeStarship } from './normalize/starship';
import { normalizeVehicle } from './normalize/vehicle';
import { fetchAkababCharacters } from './sources/akabab';
import { fetchSwapiBundle } from './sources/swapi-info';
import { SIDES } from './tagging/sides';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUTPUT_DIR = join(ROOT, '..', 'src', 'shared', 'data');

const charactersOutputSchema = v.array(characterSchema);
const filmsOutputSchema = v.array(filmSchema);
const planetsOutputSchema = v.array(planetSchema);
const speciesOutputSchema = v.array(speciesSchema);
const starshipsOutputSchema = v.array(starshipSchema);
const vehiclesOutputSchema = v.array(vehicleSchema);

function log(line: string): void {
  process.stdout.write(`${line}\n`);
}

function step(line: string): void {
  process.stdout.write(`  → ${line}`);
}

function done(line: string): void {
  process.stdout.write(`${line}\n`);
}

function dedupe<T extends { id: string; name?: string; title?: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const unique: T[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    unique.push(item);
  }
  return unique;
}

async function writeJson(filename: string, data: unknown): Promise<string> {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const path = join(OUTPUT_DIR, filename);
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  return path;
}

async function build(): Promise<void> {
  log('Building data snapshot.\n');

  // --------- Fetch ---------
  log('fetch');
  step('akabab/starwars-api ... ');
  const akabab = await fetchAkababCharacters();
  done(`${akabab.length} characters`);

  step('swapi.info ... ');
  const swapi = await fetchSwapiBundle();
  done(
    `${swapi.films.length} films, ${swapi.planets.length} planets, ${swapi.species.length} species, ${swapi.starships.length} starships, ${swapi.vehicles.length} vehicles, ${swapi.people.length} people refs`,
  );
  log('');

  // --------- Pre-normalize characters from akabab (no cross-refs yet) ---------
  log('characters (initial pass)');
  step('normalizing akabab characters ... ');
  let characters: Character[] = dedupe(
    akabab.map((raw) => normalizeCharacter(raw, { sides: SIDES })),
  );
  done(`${characters.length} unique slugs`);

  // --------- Build the URL → ref index ---------
  step('indexing URLs ... ');
  const refs = new RefIndex();
  for (const film of swapi.films) refs.register('film', film.url, film.title);
  for (const planet of swapi.planets) refs.register('planet', planet.url, planet.name);
  for (const species of swapi.species) refs.register('species', species.url, species.name);
  for (const ship of swapi.starships) refs.register('starship', ship.url, ship.name);
  for (const vehicle of swapi.vehicles) refs.register('vehicle', vehicle.url, vehicle.name);
  for (const person of swapi.people) refs.register('character', person.url, person.name);
  done('registered');
  log('');

  // --------- Normalize the SWAPI entities (with cross-refs) ---------
  log('films / planets / species / starships / vehicles');
  step('normalizing ... ');
  let films: Film[] = dedupe(swapi.films.map((f) => normalizeFilm(f, refs)));
  let planets: Planet[] = dedupe(swapi.planets.map((p) => normalizePlanet(p, refs)));
  let species: Species[] = dedupe(swapi.species.map((s) => normalizeSpecies(s, refs)));
  let starships: Starship[] = dedupe(swapi.starships.map((s) => normalizeStarship(s, refs)));
  let vehicles: Vehicle[] = dedupe(swapi.vehicles.map((v) => normalizeVehicle(v, refs)));
  done(
    `${films.length} films, ${planets.length} planets, ${species.length} species, ${starships.length} starships, ${vehicles.length} vehicles`,
  );
  log('');

  // --------- Populate character cross-refs (films, species, ships, vehicles) ---------
  log('characters (cross-refs pass)');
  step('populating refs ... ');
  characters = populateCharacterRefs(characters, {
    films,
    planets,
    species,
    starships,
    vehicles,
  });
  done('done');
  log('');

  // --------- Sort canonical order ---------
  characters.sort((a, b) => a.name.localeCompare(b.name));
  films.sort((a, b) => a.episode - b.episode);
  planets.sort((a, b) => a.name.localeCompare(b.name));
  species.sort((a, b) => a.name.localeCompare(b.name));
  starships.sort((a, b) => a.name.localeCompare(b.name));
  vehicles.sort((a, b) => a.name.localeCompare(b.name));

  // --------- Validate ---------
  log('validate');
  step('characterSchema ... ');
  characters = v.parse(charactersOutputSchema, characters);
  done('ok');
  step('filmSchema ... ');
  films = v.parse(filmsOutputSchema, films);
  done('ok');
  step('planetSchema ... ');
  planets = v.parse(planetsOutputSchema, planets);
  done('ok');
  step('speciesSchema ... ');
  species = v.parse(speciesOutputSchema, species);
  done('ok');
  step('starshipSchema ... ');
  starships = v.parse(starshipsOutputSchema, starships);
  done('ok');
  step('vehicleSchema ... ');
  vehicles = v.parse(vehiclesOutputSchema, vehicles);
  done('ok');
  log('');

  // --------- Write ---------
  log('write');
  const charactersPath = await writeJson('characters.json', characters);
  log(`  ✓ ${charactersPath} (${characters.length})`);
  const filmsPath = await writeJson('films.json', films);
  log(`  ✓ ${filmsPath} (${films.length})`);
  const planetsPath = await writeJson('planets.json', planets);
  log(`  ✓ ${planetsPath} (${planets.length})`);
  const speciesPath = await writeJson('species.json', species);
  log(`  ✓ ${speciesPath} (${species.length})`);
  const starshipsPath = await writeJson('starships.json', starships);
  log(`  ✓ ${starshipsPath} (${starships.length})`);
  const vehiclesPath = await writeJson('vehicles.json', vehicles);
  log(`  ✓ ${vehiclesPath} (${vehicles.length})`);
}

const startedAt = Date.now();
build()
  .then(() => {
    const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
    log(`\nDone in ${elapsed}s.`);
  })
  .catch((error) => {
    process.stderr.write(
      `\nBuild failed: ${error instanceof Error ? error.message : String(error)}\n`,
    );
    if (error instanceof Error && error.stack) process.stderr.write(`${error.stack}\n`);
    process.exit(1);
  });
