import { Container } from '@/shared/ui';
import { CodexMenu } from '@/widgets/codex-menu';
import { FeatureRail } from '@/widgets/feature-rail';
import styles from './HomeScreen.module.css';

/**
 * Home screen. Editorial hero (pure typography — no image, no CTA),
 * the asymmetric codex menu, and a curated four-entry feature rail.
 * Composition only; data and behavior live in the widgets it mounts.
 */
export function HomeScreen() {
  return (
    <Container as="div" className={styles.screen}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>The archive</span>
        <h1 className={styles.title}>An archive, ignited.</h1>
        <p className={styles.lede}>
          A read-only encyclopedia of the Star Wars galaxy — six codex sections, one canonical
          record per entry, set in an editorial register.
        </p>
      </header>

      <section className={styles.menu} aria-labelledby="codex-menu-heading">
        <h2 id="codex-menu-heading" className={styles.sectionEyebrow}>
          <span className={styles.sectionEyebrowText}>Sections</span>
        </h2>
        <CodexMenu />
      </section>

      <section className={styles.rail} aria-labelledby="feature-rail-heading">
        <h2 id="feature-rail-heading" className={styles.sectionEyebrow}>
          <span className={styles.sectionEyebrowText}>From the archive</span>
        </h2>
        <FeatureRail />
      </section>
    </Container>
  );
}
