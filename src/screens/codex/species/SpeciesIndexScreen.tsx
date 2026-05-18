import { SpeciesCard } from '@/entities/species/ui';
import { species } from '@/shared/api';
import { Container, SectionHeader } from '@/shared/ui';
import { CodexGrid } from '@/widgets/codex-grid';
import styles from './SpeciesIndexScreen.module.css';

const collator = new Intl.Collator('en', { sensitivity: 'base' });

/**
 * Species index — every sentient and non-sentient species in the archive,
 * alphabetical. Server component.
 */
export async function SpeciesIndexScreen() {
  const all = await species.findAll();
  const sorted = [...all].sort((a, b) => collator.compare(a.name, b.name));

  return (
    <Container as="section" className={styles.section}>
      <SectionHeader
        eyebrow="Codex"
        title="Species"
        lede="Sentient peoples and creatures of the galaxy, with their classifications and tongues."
        as="h1"
      />
      <CodexGrid aria-label="Species">
        {sorted.map((entry) => (
          <li key={entry.id} className={styles.item}>
            <SpeciesCard species={entry} />
          </li>
        ))}
      </CodexGrid>
    </Container>
  );
}
