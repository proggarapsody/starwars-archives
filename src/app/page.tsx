import styles from './page.module.css';

export default function HomePage() {
  return (
    <main className={styles.main}>
      <p className={styles.eyebrow}>Star Wars Archives</p>
      <h1 className={styles.title}>An archive, ignited.</h1>
      <p className={styles.lede}>
        A premium-feel, read-only encyclopedia of the Star Wars galaxy. Scaffold in place.
      </p>
    </main>
  );
}
