import { routes } from '@/config/routes';
import type { Vehicle } from '@/entities/vehicle/model/types';
import { formatNumberOrUnknown } from '@/shared/lib/format/number';
import styles from '@/shared/ui/EntityTile.module.css';
import Link from 'next/link';

type VehicleCardProps = {
  vehicle: Vehicle;
};

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const manufacturer = vehicle.manufacturer[0] ?? 'unknown';

  return (
    <Link href={routes.vehicle(vehicle.id)} className={styles.card}>
      <div className={styles.crest}>
        <span className={styles.crestPattern} aria-hidden="true" />
        <span className={styles.crestBadge}>Vehicle</span>
        <span className={styles.initial} aria-hidden="true">
          {vehicle.name.charAt(0)}
        </span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{vehicle.name}</h3>
        <dl className={styles.meta}>
          <div className={styles.metaRow}>
            <dt>Class</dt>
            <dd>{vehicle.vehicleClass ?? 'unknown'}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Maker</dt>
            <dd>{manufacturer}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Max speed</dt>
            <dd>{speedLabel(vehicle.maxAtmospheringSpeed)}</dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}

function speedLabel(kph: number | null): string {
  if (kph === null) return 'unknown';
  return `${formatNumberOrUnknown(kph)} kph`;
}
