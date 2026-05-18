import { site } from '@/config/site';
import { Container } from '@/shared/ui';
import styles from './SiteFooter.module.css';

const DATA_SOURCES: ReadonlyArray<{ label: string; href: string }> = [
  { label: 'akabab/starwars-api', href: 'https://github.com/akabab/starwars-api' },
  { label: 'swapi.info', href: 'https://swapi.info' },
  {
    label: 'fgeorges/star-wars-dataset',
    href: 'https://github.com/fgeorges/star-wars-dataset',
  },
];

/**
 * Site-wide footer. Server component. Three editorial columns at >=720px,
 * stacked below. Does not duplicate nav.
 */
export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <Container as="div">
        <div className={styles.grid}>
          <section className={styles.column} aria-labelledby="footer-project">
            <h2 id="footer-project" className={styles.heading}>
              Project
            </h2>
            <ul className={styles.list}>
              <li>
                <a className={styles.link} href={site.repository} target="_blank" rel="noreferrer">
                  Source repository
                </a>
              </li>
              <li>
                <a className={styles.link} href={site.predecessor} target="_blank" rel="noreferrer">
                  Predecessor (2022)
                </a>
              </li>
            </ul>
          </section>

          <section className={styles.column} aria-labelledby="footer-sources">
            <h2 id="footer-sources" className={styles.heading}>
              Data sources
            </h2>
            <ul className={styles.list}>
              {DATA_SOURCES.map((src) => (
                <li key={src.href}>
                  <a className={styles.link} href={src.href} target="_blank" rel="noreferrer">
                    {src.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.column} aria-labelledby="footer-colophon">
            <h2 id="footer-colophon" className={styles.heading}>
              Colophon
            </h2>
            <p className={styles.colophon}>
              An editorial, read-only encyclopedia. Star Wars and all related characters, names, and
              imagery are the property of Lucasfilm Ltd. This site is an independent reference work
              and is not affiliated with or endorsed by Lucasfilm.
            </p>
            <p className={styles.fine}>
              © {year} {site.author}
            </p>
          </section>
        </div>
      </Container>
    </footer>
  );
}
