import { routes } from '@/config/routes';
import { characters } from '@/shared/api';
import { Container } from '@/shared/ui';
import { CodexMenu } from '@/widgets/codex-menu';
import { FeatureRail } from '@/widgets/feature-rail';
import Image from 'next/image';
import Link from 'next/link';
import styles from './HomeScreen.module.css';

/**
 * Home screen. Image-led wikia register: full-bleed portrait hero, six-tile
 * codex menu with PNG portraits per category, and a curated feature rail.
 */
export async function HomeScreen() {
  const heroCharacter = await characters.findBySlug('luke-skywalker');

  return (
    <div className={styles.screen}>
      <section className={styles.hero}>
        {heroCharacter?.image ? (
          <div className={styles.heroBackdrop} aria-hidden="true">
            <Image
              src={heroCharacter.image}
              alt=""
              fill
              priority
              sizes="100vw"
              className={styles.heroBackdropImage}
            />
            <span className={styles.heroVignette} aria-hidden="true" />
          </div>
        ) : null}

        <Container as="div" className={styles.heroInner}>
          <p className={styles.heroEyebrow}>
            <span className={styles.heroEyebrowDot} aria-hidden="true" />
            Galactic encyclopedia
          </p>
          <h1 className={styles.heroTitle}>
            Star Wars <span className={styles.heroTitleAccent}>Archives</span>
          </h1>
          <p className={styles.heroLede}>
            Read-only canon: 80+ characters, every saga film, the planets, species, starships and
            vehicles that bind them. One record per entry, sourced from the wikia datasets.
          </p>
          <div className={styles.heroActions}>
            <Link href={routes.characters} className={styles.ctaPrimary}>
              Browse characters
            </Link>
            <Link href={routes.films} className={styles.ctaGhost}>
              View films
            </Link>
          </div>
        </Container>
      </section>

      <Container as="div" className={styles.body}>
        <section className={styles.menu} aria-labelledby="codex-menu-heading">
          <header className={styles.sectionHead}>
            <h2 id="codex-menu-heading" className={styles.sectionTitle}>
              Sections
            </h2>
            <span className={styles.sectionRule} aria-hidden="true" />
          </header>
          <CodexMenu />
        </section>

        <section className={styles.rail} aria-labelledby="feature-rail-heading">
          <header className={styles.sectionHead}>
            <h2 id="feature-rail-heading" className={styles.sectionTitle}>
              From the archive
            </h2>
            <span className={styles.sectionRule} aria-hidden="true" />
          </header>
          <FeatureRail />
        </section>
      </Container>
    </div>
  );
}
