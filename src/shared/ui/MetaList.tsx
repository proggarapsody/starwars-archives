import type { ReactNode } from 'react';
import styles from './MetaList.module.css';

export type MetaListItem = {
  label: string;
  value: ReactNode;
  /** When true, the value renders with `tabular-nums` for column alignment. */
  numeric?: boolean;
};

type MetaListProps = {
  items: readonly MetaListItem[];
  className?: string;
  'aria-label'?: string;
};

/**
 * Definition-list of label/value rows. Numeric values gain `tabular-nums`
 * so columns of figures align across cards.
 */
export function MetaList({ items, className, 'aria-label': ariaLabel }: MetaListProps) {
  const composed = className ? `${styles.list} ${className}` : styles.list;
  return (
    <dl className={composed} aria-label={ariaLabel}>
      {items.map((item) => {
        const valueClass = item.numeric ? `${styles.value} ${styles.valueNumeric}` : styles.value;
        return (
          <div key={item.label} style={{ display: 'contents' }}>
            <dt className={styles.term}>{item.label}</dt>
            <dd className={valueClass}>{item.value}</dd>
          </div>
        );
      })}
    </dl>
  );
}
