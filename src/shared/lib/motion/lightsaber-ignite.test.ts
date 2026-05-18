import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { createSaberTimeline } from './lightsaber-ignite';

function stubReducedMotion(matches: boolean): void {
  const impl = (query: string) =>
    ({
      matches: query.includes('prefers-reduced-motion') ? matches : false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
  vi.stubGlobal('matchMedia', impl);
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: impl,
  });
}

function makeSvgRoot(): SVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  const blade = document.createElementNS(ns, 'rect');
  blade.setAttribute('data-blade', 'true');
  const hilt = document.createElementNS(ns, 'g');
  hilt.setAttribute('data-hilt', 'true');
  svg.appendChild(hilt);
  svg.appendChild(blade);
  document.body.appendChild(svg);
  return svg;
}

describe('createSaberTimeline', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    stubReducedMotion(false);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.body.innerHTML = '';
  });

  test('ignite timeline contains tweens that drive blade and hilt', () => {
    const root = makeSvgRoot();
    const tl = createSaberTimeline({ root, direction: 'ignite' });
    expect(tl.getChildren().length).toBeGreaterThanOrEqual(2);
    expect(tl.duration()).toBeGreaterThan(0);
    expect(tl.duration()).toBeLessThanOrEqual(0.4);
  });

  test('extinguish timeline is shorter than ignite', () => {
    const root = makeSvgRoot();
    const ignite = createSaberTimeline({ root, direction: 'ignite' });
    const extinguish = createSaberTimeline({ root, direction: 'extinguish' });
    expect(extinguish.duration()).toBeLessThanOrEqual(ignite.duration());
    expect(extinguish.duration()).toBeLessThanOrEqual(0.25);
  });

  test('under reduced-motion the timeline has duration 0', () => {
    stubReducedMotion(true);
    const root = makeSvgRoot();
    const tl = createSaberTimeline({ root, direction: 'ignite' });
    expect(tl.duration()).toBe(0);
  });
});
