import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { characterSchema } from '@/entities/character/model/schema';
import type { Character } from '@/entities/character/model/types';
import * as v from 'valibot';
import { normalizeCharacter } from './normalize/character';
import { fetchAkababCharacters } from './sources/akabab';
import { SIDES } from './tagging/sides';

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const OUTPUT_DIR = join(ROOT, '..', 'src', 'shared', 'data');

const charactersOutputSchema = v.array(characterSchema);

async function buildCharacters(): Promise<Character[]> {
  process.stdout.write('  → fetching akabab/starwars-api ... ');
  const raw = await fetchAkababCharacters();
  process.stdout.write(`${raw.length} records\n`);

  process.stdout.write('  → normalizing ... ');
  const normalized = raw.map((r) => normalizeCharacter(r, { sides: SIDES }));
  process.stdout.write(`${normalized.length} characters\n`);

  process.stdout.write('  → validating against characterSchema ... ');
  const validated = v.parse(charactersOutputSchema, normalized);
  process.stdout.write('ok\n');

  // De-duplicate by slug, keeping first occurrence (akabab has none currently;
  // safety net for future source merging).
  const seen = new Set<string>();
  const unique = validated.filter((c) => {
    if (seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
  if (unique.length !== validated.length) {
    process.stdout.write(`  ! removed ${validated.length - unique.length} duplicate slug(s)\n`);
  }

  return unique.sort((a, b) => a.name.localeCompare(b.name));
}

async function writeJson(filename: string, data: unknown): Promise<string> {
  await mkdir(OUTPUT_DIR, { recursive: true });
  const path = join(OUTPUT_DIR, filename);
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  return path;
}

async function main(): Promise<void> {
  const startedAt = Date.now();
  process.stdout.write('Building data snapshot.\n\n');

  process.stdout.write('characters\n');
  const characters = await buildCharacters();
  const path = await writeJson('characters.json', characters);
  process.stdout.write(`  ✓ wrote ${path} (${characters.length} records)\n\n`);

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
  process.stdout.write(`Done in ${elapsed}s.\n`);
}

main().catch((error) => {
  process.stderr.write(
    `\nBuild failed: ${error instanceof Error ? error.message : String(error)}\n`,
  );
  if (error instanceof Error && error.stack) process.stderr.write(`${error.stack}\n`);
  process.exit(1);
});
