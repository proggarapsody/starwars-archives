import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

// Mock the saber motion module so we don't depend on GSAP timing in tests.
vi.mock('@/shared/lib/motion/lightsaber-ignite', () => ({
  createSaberTimeline: () => ({
    play: () => undefined,
    duration: () => 0,
    kill: () => undefined,
  }),
}));

import { ThemeToggle } from './ThemeToggle.client';

function stubMatchMedia(prefersDark: boolean): void {
  const impl = (query: string) =>
    ({
      matches: query.includes('prefers-color-scheme: dark') ? prefersDark : false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: impl,
  });
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    // Default site theme is sith; align the prefers-color-scheme stub
    // so the hook does not flip the state on mount.
    stubMatchMedia(true);
  });

  afterEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  test('renders with aria-pressed reflecting the current theme', () => {
    // Default theme is sith (per config/site.ts) so aria-pressed should be false.
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  test('aria-label announces the NEXT action', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    // Starting on sith -> next action is switching to jedi.
    expect(button).toHaveAttribute('aria-label', 'Switch to Jedi theme');
  });

  test('clicking flips the theme and updates aria-pressed and aria-label', async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('aria-label', 'Switch to Sith theme');
  });
});
