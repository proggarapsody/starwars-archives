import { routes } from '@/config/routes';
import type { Starship } from '@/entities/starship/model/types';
import { MetaList, type MetaListItem, Surface } from '@/shared/ui';
import Link from 'next/link';
import styles from './StarshipCard.module.css';

type StarshipCardProps = {
  starship: Starship;
};

/**
 * Editorial-archive card for the starships index. Whole card is the link target.
 */
export function StarshipCard({ starship }: StarshipCardProps) {
  const manufacturer =
    starship.manufacturer.length > 0 ? starship.manufacturer.join(', ') : 'unknown';

  const meta: MetaListItem[] = [
    { label: 'Class', value: starship.starshipClass ?? 'unknown' },
    { label: 'Manufacturer', value: manufacturer },
    {
      label: 'Hyperdrive',
      value: starship.hyperdriveRating !== null ? starship.hyperdriveRating.toFixed(1) : 'unknown',
      numeric: true,
    },
  ];

  return (
    <Link href={routes.starship(starship.id)} className={styles.card}>
      <Surface className={styles.surface}>
        <h3 className={styles.name}>{starship.name}</h3>
        <MetaList items={meta} aria-label={`${starship.name} details`} />
      </Surface>
    </Link>
  );
}
