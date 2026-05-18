import { VehicleCard } from '@/entities/vehicle/ui';
import { vehicles } from '@/shared/api';
import { Container, SectionHeader } from '@/shared/ui';
import { CodexGrid } from '@/widgets/codex-grid';
import styles from './VehiclesIndexScreen.module.css';

const collator = new Intl.Collator('en', { sensitivity: 'base' });

/**
 * Vehicles index — sub-orbital and ground craft, alphabetical.
 * Server component.
 */
export async function VehiclesIndexScreen() {
  const all = await vehicles.findAll();
  const sorted = [...all].sort((a, b) => collator.compare(a.name, b.name));

  return (
    <Container as="section" className={styles.section}>
      <SectionHeader
        eyebrow="Codex"
        title="Vehicles"
        lede="Sub-orbital and ground transports, from speeder bikes to all-terrain armoured walkers."
        as="h1"
      />
      <CodexGrid aria-label="Vehicles">
        {sorted.map((vehicle) => (
          <li key={vehicle.id} className={styles.item}>
            <VehicleCard vehicle={vehicle} />
          </li>
        ))}
      </CodexGrid>
    </Container>
  );
}
