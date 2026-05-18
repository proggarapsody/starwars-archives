import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import styles from './Surface.module.css';

type SurfaceProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  /**
   * When true, adds a tinted shadow drawn from `--shadow-color` to
   * lift the surface off the canvas. Use sparingly — most cards are flat.
   */
  lift?: boolean;
  children: ReactNode;
};

/**
 * Card-like surface: tokenized background, soft radius, optional tinted lift.
 * Borderless by default per docs/TASTE.md.
 */
export function Surface({
  as: Component = 'div',
  lift = false,
  children,
  className,
  ...rest
}: SurfaceProps) {
  const base = lift ? `${styles.surface} ${styles.lift}` : styles.surface;
  const composed = className ? `${base} ${className}` : base;
  return (
    <Component className={composed} {...rest}>
      {children}
    </Component>
  );
}
