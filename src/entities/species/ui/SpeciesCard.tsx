import { routes } from '@/config/routes';
import type { Species } from '@/entities/species/model/types';
import { formatNumberOrUnknown } from '@/shared/lib/format/number';
import { MetaList, type MetaListItem, Surface } from '@/shared/ui';
import Link from 'next/link';
import styles from './SpeciesCard.module.css';

type SpeciesCardProps = {
  species: Species;
};

/**
 * Editorial-archive card for the species index. Whole card is the link target.
 */
export function SpeciesCard({ species }: SpeciesCardProps) {
  const meta: MetaListItem[] = [
    { label: 'Classification', value: species.classification ?? 'unknown' },
    { label: 'Language', value: species.language ?? 'unknown' },
    {
      label: 'Avg. lifespan',
      value: lifespanLabel(species.averageLifespanYears),
      numeric: true,
    },
  ];

  return (
    <Link href={routes.speciesEntry(species.id)} className={styles.card}>
      <Surface className={styles.surface}>
        <h3 className={styles.name}>{species.name}</h3>
        <MetaList items={meta} aria-label={`${species.name} details`} />
      </Surface>
    </Link>
  );
}

function lifespanLabel(years: number | null): string {
  if (years === null) return 'unknown';
  return `${formatNumberOrUnknown(years)} years`;
}
