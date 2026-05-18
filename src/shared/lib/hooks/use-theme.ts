'use client';

import { site } from '@/config/site';
import type { Theme } from '@/config/theme/tokens';
import { useCallback, useEffect, useState } from 'react';

export const THEME_STORAGE_KEY = 'starwars-archives:theme';

const isTheme = (value: unknown): value is Theme => value === 'jedi' || value === 'sith';

function readPersistedTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(raw) ? raw : null;
  } catch {
    return null;
  }
}

function readPreferredTheme(): Theme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return isTheme(site.defaultTheme) ? site.defaultTheme : 'sith';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'sith' : 'jedi';
}

function resolveInitialTheme(): Theme {
  const persisted = readPersistedTheme();
  if (persisted) return persisted;
  return readPreferredTheme();
}

export type UseThemeResult = {
  theme: Theme;
  setTheme: (next: Theme) => void;
};

/**
 * Client hook owning the persistence contract.
 * Returns the site default on the first render to keep SSR markup stable,
 * then upgrades from `localStorage` (or `prefers-color-scheme`) in `useEffect`.
 */
export function useTheme(): UseThemeResult {
  const fallback: Theme = isTheme(site.defaultTheme) ? site.defaultTheme : 'sith';
  const [theme, setThemeState] = useState<Theme>(fallback);

  useEffect(() => {
    const resolved = resolveInitialTheme();
    setThemeState(resolved);
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = resolved;
    }
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        // ignore storage failures (private mode, quota, etc.)
      }
    }
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = next;
    }
  }, []);

  return { theme, setTheme };
}
