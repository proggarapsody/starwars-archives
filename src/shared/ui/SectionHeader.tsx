import type { ReactNode } from 'react';
import styles from './SectionHeader.module.css';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  lede?: ReactNode;
  /**
   * Heading level for the title. Defaults to `h2` — section header by name.
   * Use `h1` only for the document's top heading.
   */
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
};

/**
 * Editorial section header: small-caps eyebrow, sentence-case heading,
 * optional lede paragraph. Used as the anchor for every page section.
 */
export function SectionHeader({
  eyebrow,
  title,
  lede,
  as: HeadingTag = 'h2',
  className,
}: SectionHeaderProps) {
  const composed = className ? `${styles.header} ${className}` : styles.header;
  return (
    <header className={composed}>
      {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
      <HeadingTag className={styles.title}>{title}</HeadingTag>
      {lede ? <p className={styles.lede}>{lede}</p> : null}
    </header>
  );
}
