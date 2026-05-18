'use client';

import { useTheme } from '@/shared/lib/hooks/use-theme';
import { createSaberTimeline } from '@/shared/lib/motion/lightsaber-ignite';
import { useGSAP } from '@gsap/react';
import { useRef } from 'react';
import styles from './ThemeToggle.module.css';

/**
 * Lightsaber-hilt theme toggle. Wires `useTheme` to a click handler,
 * playing the saber ignite/extinguish timeline on each change.
 *
 * `aria-pressed` reflects whether the Jedi theme is active.
 * `aria-label` always announces the NEXT action.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Cleanup hook — `useGSAP` reverts created tweens when the component
  // unmounts so the timeline does not leak.
  useGSAP(() => undefined, { scope: svgRef });

  const isJedi = theme === 'jedi';
  const nextTheme = isJedi ? 'sith' : 'jedi';
  const nextLabel = isJedi ? 'Switch to Sith theme' : 'Switch to Jedi theme';

  function handleClick(): void {
    const root = svgRef.current;
    if (root) {
      // Going to jedi == ignite; going to sith == extinguish.
      const direction = nextTheme === 'jedi' ? 'ignite' : 'extinguish';
      const tl = createSaberTimeline({ root, direction });
      tl.play();
    }
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      className={styles.toggle}
      aria-pressed={isJedi}
      aria-label={nextLabel}
      onClick={handleClick}
    >
      <svg
        ref={svgRef}
        className={styles.icon}
        viewBox="0 0 32 32"
        role="presentation"
        aria-hidden="true"
      >
        <title>Lightsaber</title>
        {/* Blade — animated. Anchored at hilt end (y=22) growing upward. */}
        <rect
          data-blade="true"
          className={styles.blade}
          x="14.5"
          y="2"
          width="3"
          height="20"
          rx="1.5"
        />
        {/* Hilt — micro-rotates during ignite. */}
        <g data-hilt="true">
          <rect className={styles.hilt} x="12" y="22" width="8" height="6" rx="1" />
          <rect className={styles.hiltAccent} x="13" y="24" width="6" height="1" />
          <rect className={styles.hilt} x="13" y="28" width="6" height="2" rx="0.5" />
        </g>
      </svg>
    </button>
  );
}
