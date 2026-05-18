import { CharacterCard } from '@/entities/character/ui';
import { characters } from '@/shared/api';
import { Container, SectionHeader } from '@/shared/ui';
import { CodexGrid } from '@/widgets/codex-grid';
import styles from './CharactersIndexScreen.module.css';

const collator = new Intl.Collator('en', { sensitivity: 'base' });

/**
 * Characters index — alphabetical roll-call of every named figure in the
 * archive. Server component; data is read at build time from the bundled
 * snapshot via the CharacterRepository.
 */
export async function CharactersIndexScreen() {
  const all = await characters.findAll();
  const sorted = [...all].sort((a, b) => collator.compare(a.name, b.name));

  return (
    <Container as="section" className={styles.section}>
      <SectionHeader
        eyebrow="Codex"
        title="Characters"
        lede="Every named figure in the archive, from junior padawans to imperial command."
        as="h1"
      />
      <CodexGrid aria-label="Characters">
        {sorted.map((character) => (
          <li key={character.id} className={styles.item}>
            <CharacterCard character={character} />
          </li>
        ))}
      </CodexGrid>
    </Container>
  );
}
