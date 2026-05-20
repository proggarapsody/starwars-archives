import { routes } from '@/config/routes';
import type { Species } from '@/entities/species/model/types';
import { formatNumberOrUnknown } from '@/shared/lib/format/number';
import styles from '@/shared/ui/EntityTile.module.css';
import Link from 'next/link';

type SpeciesCardProps = {
  species: Species;
};

export function SpeciesCard({ species }: SpeciesCardProps) {
  return (
    <Link href={routes.speciesEntry(species.id)} className={styles.card}>
      <div className={styles.crest}>
        <span className={styles.crestPattern} aria-hidden="true" />
        <span className={styles.crestBadge}>Species</span>
        <span className={styles.initial} aria-hidden="true">
          {species.name.charAt(0)}
        </span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{species.name}</h3>
        <dl className={styles.meta}>
          <div className={styles.metaRow}>
            <dt>Class</dt>
            <dd>{species.classification ?? 'unknown'}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Language</dt>
            <dd>{species.language ?? 'unknown'}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Lifespan</dt>
            <dd>{lifespanLabel(species.averageLifespanYears)}</dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}

function lifespanLabel(years: number | null): string {
  if (years === null) return 'unknown';
  return `${formatNumberOrUnknown(years)} yrs`;
}
