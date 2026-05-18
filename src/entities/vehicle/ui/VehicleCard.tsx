import { routes } from '@/config/routes';
import type { Vehicle } from '@/entities/vehicle/model/types';
import { formatNumberOrUnknown } from '@/shared/lib/format/number';
import { MetaList, type MetaListItem, Surface } from '@/shared/ui';
import Link from 'next/link';
import styles from './VehicleCard.module.css';

type VehicleCardProps = {
  vehicle: Vehicle;
};

/**
 * Editorial-archive card for the vehicles index. Whole card is the link target.
 */
export function VehicleCard({ vehicle }: VehicleCardProps) {
  const manufacturer =
    vehicle.manufacturer.length > 0 ? vehicle.manufacturer.join(', ') : 'unknown';

  const meta: MetaListItem[] = [
    { label: 'Class', value: vehicle.vehicleClass ?? 'unknown' },
    { label: 'Manufacturer', value: manufacturer },
    {
      label: 'Max speed',
      value: speedLabel(vehicle.maxAtmospheringSpeed),
      numeric: true,
    },
  ];

  return (
    <Link href={routes.vehicle(vehicle.id)} className={styles.card}>
      <Surface className={styles.surface}>
        <h3 className={styles.name}>{vehicle.name}</h3>
        <MetaList items={meta} aria-label={`${vehicle.name} details`} />
      </Surface>
    </Link>
  );
}

function speedLabel(kph: number | null): string {
  if (kph === null) return 'unknown';
  return `${formatNumberOrUnknown(kph)} kph`;
}
