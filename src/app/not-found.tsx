import { routes } from '@/config/routes';
import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className={styles.main}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>These aren't the records you're looking for.</h1>
      <p className={styles.lede}>The entry you requested doesn't exist in the Archives.</p>
      <Link href={routes.home} className={styles.link}>
        Return to the home page
      </Link>
    </main>
  );
}
