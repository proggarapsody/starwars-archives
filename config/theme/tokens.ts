/**
 * Design tokens — TypeScript source of truth.
 *
 * The same tokens are also expressed as CSS custom properties in
 * `jedi.css` and `sith.css`. Keep both in sync manually — when adding a
 * token here, mirror it in both theme CSS files.
 *
 * CSS Modules MUST reference custom properties only, never the values here.
 * This file is for TS-side access (e.g. computed inline styles, GSAP modules).
 */

export const space = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
  40: '160px',
} as const;

export const fontSize = {
  display: 'clamp(3.5rem, 8vw, 7rem)',
  h1: 'clamp(2.5rem, 5vw, 4rem)',
  h2: 'clamp(2rem, 4vw, 3rem)',
  h3: '1.5rem',
  body: '1rem',
  small: '0.875rem',
  fine: '0.75rem',
} as const;

export const radius = {
  1: '4px',
  2: '8px',
  3: '12px',
  pill: '999px',
} as const;

export const motion = {
  fast: '180ms',
  normal: '240ms',
  slow: '420ms',
  ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

export type Theme = 'jedi' | 'sith';
export type Side = 'light' | 'dark' | 'none';

export const THEMES: readonly Theme[] = ['jedi', 'sith'] as const;
export const SIDES: readonly Side[] = ['light', 'dark', 'none'] as const;
