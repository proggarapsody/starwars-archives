import { PlanetCard } from '@/entities/planet/ui';
import { planets } from '@/shared/api';
import { Container, SectionHeader } from '@/shared/ui';
import { CodexGrid } from '@/widgets/codex-grid';
import styles from './PlanetsIndexScreen.module.css';

const collator = new Intl.Collator('en', { sensitivity: 'base' });

/**
 * Planets index — every world catalogued in the archive, alphabetical.
 * Server component.
 */
export async function PlanetsIndexScreen() {
  const all = await planets.findAll();
  const sorted = [...all].sort((a, b) => collator.compare(a.name, b.name));

  return (
    <Container as="section" className={styles.section}>
      <SectionHeader
        eyebrow="Codex"
        title="Planets"
        lede="Worlds of the known galaxy, from the desert wastes of tatooine to the cloud cities of bespin."
        as="h1"
      />
      <CodexGrid aria-label="Planets">
        {sorted.map((planet) => (
          <li key={planet.id} className={styles.item}>
            <PlanetCard planet={planet} />
          </li>
        ))}
      </CodexGrid>
    </Container>
  );
}
