import { StarshipCard } from '@/entities/starship/ui';
import { starships } from '@/shared/api';
import { Container, SectionHeader } from '@/shared/ui';
import { CodexGrid } from '@/widgets/codex-grid';
import styles from './StarshipsIndexScreen.module.css';

const collator = new Intl.Collator('en', { sensitivity: 'base' });

/**
 * Starships index — vessels capable of hyperspace travel, alphabetical.
 * Server component.
 */
export async function StarshipsIndexScreen() {
  const all = await starships.findAll();
  const sorted = [...all].sort((a, b) => collator.compare(a.name, b.name));

  return (
    <Container as="section" className={styles.section}>
      <SectionHeader
        eyebrow="Codex"
        title="Starships"
        lede="Hyperspace-capable craft, from x-wing fighters to imperial-class star destroyers."
        as="h1"
      />
      <CodexGrid aria-label="Starships">
        {sorted.map((starship) => (
          <li key={starship.id} className={styles.item}>
            <StarshipCard starship={starship} />
          </li>
        ))}
      </CodexGrid>
    </Container>
  );
}
