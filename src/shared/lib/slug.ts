/**
 * Convert a human-readable name to a URL slug.
 *
 * Rules:
 * - Lowercase ASCII.
 * - Strip accents (Unicode NFD + diacritic removal).
 * - Drop characters other than [a-z0-9-].
 * - Collapse runs of whitespace and punctuation into single hyphens.
 * - Trim leading and trailing hyphens.
 * - Throw if the result is empty.
 */
export function slugify(input: string): string {
  const stripped = input
    .normalize('NFD')
    // biome-ignore lint/suspicious/noMisleadingCharacterClass: stripping combining diacritics is exactly the intent
    .replace(/[̀-ͯ]/g, '');

  const slug = stripped
    .toLowerCase()
    // Apostrophes are removed outright — "Obi-Wan's" should become "obi-wans", not "obi-wan-s".
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (slug.length === 0) {
    throw new Error(`Cannot slugify empty or symbol-only input: ${JSON.stringify(input)}`);
  }
  return slug;
}
