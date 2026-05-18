import gsap from 'gsap';

/**
 * Lightsaber ignite/extinguish timeline factory.
 *
 * Animates the blade `scaleY` 0→1 (ignite) or 1→0 (extinguish), anchored at the
 * hilt end, plus a 4° micro-rotation on the hilt that overshoots once on ignite.
 *
 * Budget per docs/TASTE.md: ignite ≤ 320ms, extinguish ≤ 220ms.
 * Eased with `cubic-bezier(0.16, 1, 0.3, 1)`.
 *
 * Under `prefers-reduced-motion: reduce` the timeline snaps to its end state
 * with `gsap.set` and reports `duration() === 0`.
 *
 * No DOM is touched outside the passed `root`. The blade and hilt are located
 * inside the root via `[data-blade]` and `[data-hilt]` attributes; the toggle
 * component is responsible for marking them.
 *
 * Anchoring: callers are expected to set `transform-origin` on the blade
 * element (in CSS or inline) so the scaleY grows from the hilt end. We do
 * not write `transform-origin` here — keeps the factory free of SVG-matrix
 * code paths that don't run under happy-dom.
 */

type Direction = 'ignite' | 'extinguish';

type CreateSaberTimelineArgs = {
  root: SVGElement;
  direction: Direction;
};

const SABER_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const IGNITE_DURATION = 0.32; // seconds
const EXTINGUISH_DURATION = 0.22; // seconds
const HILT_OVERSHOOT_DEGREES = 4;

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function selectBlade(root: SVGElement): Element {
  return root.querySelector('[data-blade]') ?? root;
}

function selectHilt(root: SVGElement): Element {
  return root.querySelector('[data-hilt]') ?? root;
}

export function createSaberTimeline({
  root,
  direction,
}: CreateSaberTimelineArgs): gsap.core.Timeline {
  const blade = selectBlade(root);
  const hilt = selectHilt(root);
  const tl = gsap.timeline({ paused: true });

  if (prefersReducedMotion()) {
    if (direction === 'ignite') {
      gsap.set(blade, { scaleY: 1 });
      gsap.set(hilt, { rotate: 0 });
    } else {
      gsap.set(blade, { scaleY: 0 });
      gsap.set(hilt, { rotate: 0 });
    }
    return tl;
  }

  if (direction === 'ignite') {
    gsap.set(blade, { scaleY: 0 });
    gsap.set(hilt, { rotate: 0 });
    tl.to(
      blade,
      {
        scaleY: 1,
        duration: IGNITE_DURATION,
        ease: SABER_EASE,
      },
      0,
    );
    tl.to(
      hilt,
      {
        rotate: HILT_OVERSHOOT_DEGREES,
        duration: IGNITE_DURATION * 0.55,
        ease: SABER_EASE,
      },
      0,
    );
    tl.to(
      hilt,
      {
        rotate: 0,
        duration: IGNITE_DURATION * 0.45,
        ease: SABER_EASE,
      },
      IGNITE_DURATION * 0.55,
    );
  } else {
    gsap.set(blade, { scaleY: 1 });
    gsap.set(hilt, { rotate: 0 });
    tl.to(
      blade,
      {
        scaleY: 0,
        duration: EXTINGUISH_DURATION,
        ease: SABER_EASE,
      },
      0,
    );
    tl.to(
      hilt,
      {
        rotate: -HILT_OVERSHOOT_DEGREES * 0.4,
        duration: EXTINGUISH_DURATION * 0.5,
        ease: SABER_EASE,
      },
      0,
    );
    tl.to(
      hilt,
      {
        rotate: 0,
        duration: EXTINGUISH_DURATION * 0.5,
        ease: SABER_EASE,
      },
      EXTINGUISH_DURATION * 0.5,
    );
  }

  return tl;
}
