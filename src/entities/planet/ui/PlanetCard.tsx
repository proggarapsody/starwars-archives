import { routes } from '@/config/routes';
import type { Planet } from '@/entities/planet/model/types';
import { formatPopulation } from '@/shared/lib/format/number';
import styles from '@/shared/ui/EntityTile.module.css';
import Link from 'next/link';

type PlanetCardProps = {
  planet: Planet;
};

export function PlanetCard({ planet }: PlanetCardProps) {
  const climate = planet.climate.length > 0 ? planet.climate[0] : 'unknown';
  const terrain = planet.terrain.length > 0 ? planet.terrain[0] : 'unknown';

  return (
    <Link href={routes.planet(planet.id)} className={styles.card}>
      <div className={styles.crest}>
        <span className={styles.crestPattern} aria-hidden="true" />
        <span className={styles.crestBadge}>Planet</span>
        <span className={styles.initial} aria-hidden="true">
          {planet.name.charAt(0)}
        </span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{planet.name}</h3>
        <dl className={styles.meta}>
          <div className={styles.metaRow}>
            <dt>Climate</dt>
            <dd>{climate}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Terrain</dt>
            <dd>{terrain}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Population</dt>
            <dd>{formatPopulation(planet.population)}</dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}
