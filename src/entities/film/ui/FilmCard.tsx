import { routes } from '@/config/routes';
import type { Film } from '@/entities/film/model/types';
import { isoYear } from '@/shared/lib/format/number';
import { toRoman } from '@/shared/lib/format/roman';
import { MetaList, type MetaListItem, Surface } from '@/shared/ui';
import Link from 'next/link';
import styles from './FilmCard.module.css';

type FilmCardProps = {
  film: Film;
};

/**
 * Editorial-archive card for the films index. Whole card is the link target.
 */
export function FilmCard({ film }: FilmCardProps) {
  const meta: MetaListItem[] = [
    { label: 'Episode', value: toRoman(film.episode) },
    { label: 'Released', value: isoYear(film.releaseDate), numeric: true },
    { label: 'Director', value: film.director },
  ];

  return (
    <Link href={routes.film(film.id)} className={styles.card}>
      <Surface className={styles.surface}>
        <h3 className={styles.title}>{film.title}</h3>
        <MetaList items={meta} aria-label={`${film.title} details`} />
      </Surface>
    </Link>
  );
}
