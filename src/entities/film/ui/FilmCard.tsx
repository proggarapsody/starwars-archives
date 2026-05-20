import { routes } from '@/config/routes';
import type { Film } from '@/entities/film/model/types';
import { isoYear } from '@/shared/lib/format/number';
import { toRoman } from '@/shared/lib/format/roman';
import styles from '@/shared/ui/EntityTile.module.css';
import Link from 'next/link';

type FilmCardProps = {
  film: Film;
};

export function FilmCard({ film }: FilmCardProps) {
  return (
    <Link href={routes.film(film.id)} className={styles.card}>
      <div className={styles.crest}>
        <span className={styles.crestPattern} aria-hidden="true" />
        <span className={styles.crestBadge}>Film</span>
        <span className={styles.crestEpisode}>Episode {toRoman(film.episode)}</span>
        <span className={styles.initial} aria-hidden="true">
          {toRoman(film.episode)}
        </span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{film.title}</h3>
        <dl className={styles.meta}>
          <div className={styles.metaRow}>
            <dt>Released</dt>
            <dd>{isoYear(film.releaseDate)}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Director</dt>
            <dd>{film.director}</dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}
