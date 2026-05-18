import type { Side, Slug } from '@/shared/model';

/**
 * Hand-curated map of character slug → narrative side of the Force.
 *
 * This is editorial data we author ourselves — akabab doesn't carry it.
 * Drives the Force-Tinted UI feature. Characters not listed default to 'none'.
 *
 * Edit freely. Keep entries alphabetical by slug for diff-friendliness.
 */
export const SIDES: Record<Slug, Side> = {
  // Light side
  'ahsoka-tano': 'light',
  'anakin-skywalker': 'light', // before fall — Vader is a separate slug
  'bb-8': 'light',
  finn: 'light',
  'han-solo': 'light',
  'jyn-erso': 'light',
  'kanan-jarrus': 'light',
  'leia-organa': 'light',
  'luke-skywalker': 'light',
  'mace-windu': 'light',
  'obi-wan-kenobi': 'light',
  'padme-amidala': 'light',
  'poe-dameron': 'light',
  'qui-gon-jinn': 'light',
  'r2-d2': 'light',
  rey: 'light',
  'rose-tico': 'light',
  yoda: 'light',
  'c-3po': 'light',

  // Dark side
  'asajj-ventress': 'dark',
  'captain-phasma': 'dark',
  'count-dooku': 'dark',
  'darth-bane': 'dark',
  'darth-maul': 'dark',
  'darth-sidious': 'dark',
  'darth-vader': 'dark',
  'general-grievous': 'dark',
  'general-hux': 'dark',
  'jabba-the-hutt': 'dark',
  'kylo-ren': 'dark',
  palpatine: 'dark',
  'pre-vizsla': 'dark',
  'savage-opress': 'dark',
  'sheev-palpatine': 'dark',
  snoke: 'dark',
  'supreme-leader-snoke': 'dark',
  'wilhuff-tarkin': 'dark',
};
