/**
 * Shape of akabab/starwars-api character records.
 * Some fields are inconsistently present — every leaf is optional.
 * Reference: https://akabab.github.io/starwars-api/
 */
export type AkababCharacter = {
  id: number;
  name: string;
  height?: number | null;
  mass?: number | null;
  gender?: string | null;
  homeworld?: string | null;
  wiki?: string | null;
  image?: string | null;
  born?: number | null;
  bornLocation?: string | null;
  died?: number | null;
  diedLocation?: string | null;
  species?: string | null;
  hairColor?: string | null;
  eyeColor?: string | null;
  skinColor?: string | null;
  cybernetics?: string | null;
  affiliations?: string[];
  masters?: string[];
  apprentices?: string[];
  formerAffiliations?: string[];
};

export const AKABAB_ALL_URL = 'https://akabab.github.io/starwars-api/api/all.json';

export async function fetchAkababCharacters(
  fetchImpl: typeof fetch = fetch,
): Promise<AkababCharacter[]> {
  const response = await fetchImpl(AKABAB_ALL_URL);
  if (!response.ok) {
    throw new Error(`akabab fetch failed: ${response.status} ${response.statusText}`);
  }
  const data = (await response.json()) as AkababCharacter[];
  return data;
}
