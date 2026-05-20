import { routes } from '@/config/routes';
import type { Starship } from '@/entities/starship/model/types';
import styles from '@/shared/ui/EntityTile.module.css';
import Link from 'next/link';

type StarshipCardProps = {
  starship: Starship;
};

export function StarshipCard({ starship }: StarshipCardProps) {
  const manufacturer = starship.manufacturer[0] ?? 'unknown';

  return (
    <Link href={routes.starship(starship.id)} className={styles.card}>
      <div className={styles.crest}>
        <span className={styles.crestPattern} aria-hidden="true" />
        <span className={styles.crestBadge}>Starship</span>
        <span className={styles.initial} aria-hidden="true">
          {starship.name.charAt(0)}
        </span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{starship.name}</h3>
        <dl className={styles.meta}>
          <div className={styles.metaRow}>
            <dt>Class</dt>
            <dd>{starship.starshipClass ?? 'unknown'}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Maker</dt>
            <dd>{manufacturer}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Hyperdrive</dt>
            <dd>
              {starship.hyperdriveRating !== null ? starship.hyperdriveRating.toFixed(1) : '—'}
            </dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}
