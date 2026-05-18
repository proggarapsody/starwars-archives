import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import styles from './SmallCapsLabel.module.css';

type SmallCapsLabelProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
};

/**
 * Small-caps text label. Replaces pill badges per docs/TASTE.md.
 * Weight 600, tracking 0.08em, uppercase.
 */
export function SmallCapsLabel({
  as: Component = 'span',
  children,
  className,
  ...rest
}: SmallCapsLabelProps) {
  const composed = className ? `${styles.label} ${className}` : styles.label;
  return (
    <Component className={composed} {...rest}>
      {children}
    </Component>
  );
}
