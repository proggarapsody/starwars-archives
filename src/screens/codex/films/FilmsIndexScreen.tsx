import { FilmCard } from '@/entities/film/ui';
import { films } from '@/shared/api';
import { Container, SectionHeader } from '@/shared/ui';
import { CodexGrid } from '@/widgets/codex-grid';
import styles from './FilmsIndexScreen.module.css';

/**
 * Films index — the saga in episode order. Server component.
 * Sorting is delegated to the FilmRepository, which orders by `episode` ascending.
 */
export async function FilmsIndexScreen() {
  const all = await films.findAll();

  return (
    <Container as="section" className={styles.section}>
      <SectionHeader
        eyebrow="Codex"
        title="Films"
        lede="The skywalker saga in episode order, from the phantom menace to the rise of skywalker."
        as="h1"
      />
      <CodexGrid aria-label="Films">
        {all.map((film) => (
          <li key={film.id} className={styles.item}>
            <FilmCard film={film} />
          </li>
        ))}
      </CodexGrid>
    </Container>
  );
}
