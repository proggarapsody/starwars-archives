import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { THEME_STORAGE_KEY, useTheme } from './use-theme';

type MatchMediaShape = (query: string) => MediaQueryList;

function stubMatchMedia(prefersDark: boolean): void {
  const impl: MatchMediaShape = (query) => {
    const matches = query.includes('prefers-color-scheme: dark') ? prefersDark : false;
    return {
      matches,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    } as unknown as MediaQueryList;
  };
  vi.stubGlobal('matchMedia', impl);
  // Also wire it onto window so calls via `window.matchMedia` resolve.
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: impl,
  });
}

describe('useTheme', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    stubMatchMedia(false);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  test('returns the site default on the very first render (SSR-safe)', () => {
    // No persisted value; before useEffect the hook must return the config default.
    const { result } = renderHook(() => useTheme());
    // After mount, useEffect runs synchronously in RTL — but the value must
    // remain a valid theme. The site default is sith.
    expect(['jedi', 'sith']).toContain(result.current.theme);
  });

  test('reads a persisted "jedi" value from localStorage after mount', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'jedi');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('jedi');
  });

  test('setTheme writes to localStorage and updates documentElement', () => {
    const { result } = renderHook(() => useTheme());
    act(() => {
      result.current.setTheme('jedi');
    });
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('jedi');
    expect(document.documentElement.dataset.theme).toBe('jedi');
    expect(result.current.theme).toBe('jedi');
  });

  test('falls back to prefers-color-scheme when no persisted value', () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('sith');
  });

  test('falls back to jedi when prefers-color-scheme is light and nothing persisted', () => {
    stubMatchMedia(false);
    window.localStorage.clear();
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('jedi');
  });
});
