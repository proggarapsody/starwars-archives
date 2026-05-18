import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import styles from './Container.module.css';

type ContainerProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
};

/**
 * Central column wrapper. Constrains content to `--container-max`
 * and applies the project's horizontal gutter token.
 */
export function Container({ as: Component = 'div', children, className, ...rest }: ContainerProps) {
  const composed = className ? `${styles.container} ${className}` : styles.container;
  return (
    <Component className={composed} {...rest}>
      {children}
    </Component>
  );
}
