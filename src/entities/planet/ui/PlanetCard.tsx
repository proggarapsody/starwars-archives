import { routes } from '@/config/routes';
import type { Planet } from '@/entities/planet/model/types';
import { formatPopulation } from '@/shared/lib/format/number';
import { MetaList, type MetaListItem, Surface } from '@/shared/ui';
import Link from 'next/link';
import styles from './PlanetCard.module.css';

type PlanetCardProps = {
  planet: Planet;
};

/**
 * Editorial-archive card for the planets index. Whole card is the link target.
 */
export function PlanetCard({ planet }: PlanetCardProps) {
  const climate = planet.climate.length > 0 ? planet.climate.join(', ') : 'unknown';
  const terrain = planet.terrain.length > 0 ? planet.terrain.join(', ') : 'unknown';

  const meta: MetaListItem[] = [
    { label: 'Climate', value: climate },
    { label: 'Terrain', value: terrain },
    { label: 'Population', value: formatPopulation(planet.population), numeric: true },
  ];

  return (
    <Link href={routes.planet(planet.id)} className={styles.card}>
      <Surface className={styles.surface}>
        <h3 className={styles.name}>{planet.name}</h3>
        <MetaList items={meta} aria-label={`${planet.name} details`} />
      </Surface>
    </Link>
  );
}
