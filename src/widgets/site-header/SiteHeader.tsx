import { primaryNav, routes } from '@/config/routes';
import { site } from '@/config/site';
import { ThemeToggle } from '@/features/theme-toggle';
import { Container } from '@/shared/ui';
import Link from 'next/link';
import styles from './SiteHeader.module.css';

/**
 * Site-wide header. Server component. Composes brand wordmark, primary nav,
 * and the client-side theme toggle. Mobile (< 720px) collapses the nav into
 * a JS-free `<details>` disclosure.
 */
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Container as="div" className={styles.inner}>
        <Link href={routes.home} className={styles.brand} aria-label={site.name}>
          <span className={styles.brandMark} aria-hidden="true">
            SW
          </span>
          <span>{site.name}</span>
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          <ul className={styles.navList}>
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.navLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <details className={styles.disclosure}>
            <summary className={styles.summary} aria-label="Browse codex sections">
              Menu
            </summary>
            <div className={styles.sheet}>
              <ul className={styles.sheetList}>
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={styles.sheetLink}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </details>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
