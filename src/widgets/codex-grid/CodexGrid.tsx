import type { ReactNode } from 'react';
import styles from './CodexGrid.module.css';

type CodexGridProps = {
  children: ReactNode;
  'aria-label': string;
};

/**
 * Asymmetric two-column grid for codex index pages. The second column is
 * offset vertically at >=1280px to break uniformity per docs/TASTE.md.
 * Collapses to a single column at <=720px.
 *
 * Children opt in to the scroll-driven entry reveal by setting an
 * `animation-timeline: view()` rule on themselves; this wrapper is purely
 * structural and stateless.
 */
export function CodexGrid({ children, 'aria-label': ariaLabel }: CodexGridProps) {
  return (
    <ul className={styles.grid} aria-label={ariaLabel}>
      {children}
    </ul>
  );
}
