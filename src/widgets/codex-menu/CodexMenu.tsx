import { routes } from '@/config/routes';
import { characters, films, planets, species, starships, vehicles } from '@/shared/api';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CodexMenu.module.css';

type CodexEntry = {
  key: 'character' | 'film' | 'planet' | 'species' | 'starship' | 'vehicle';
  title: string;
  description: string;
  href: string;
  count: number;
  unit: string;
  /** A canonical character slug whose portrait represents this category. */
  representative: string;
};

/**
 * Image-led menu of the six codex sections. Each tile uses a representative
 * character portrait as a backdrop with the category name overlaid.
 */
export async function CodexMenu() {
  const [characterList, filmList, planetList, speciesList, starshipList, vehicleList] =
    await Promise.all([
      characters.findAll(),
      films.findAll(),
      planets.findAll(),
      species.findAll(),
      starships.findAll(),
      vehicles.findAll(),
    ]);

  const entries: readonly CodexEntry[] = [
    {
      key: 'character',
      title: 'Characters',
      description: 'Jedi, Sith, smugglers, droids.',
      href: routes.characters,
      count: characterList.length,
      unit: 'entries',
      representative: 'luke-skywalker',
    },
    {
      key: 'film',
      title: 'Films',
      description: 'The saga in canonical order.',
      href: routes.films,
      count: filmList.length,
      unit: 'films',
      representative: 'darth-vader',
    },
    {
      key: 'planet',
      title: 'Planets',
      description: 'From the Outer Rim to the Core.',
      href: routes.planets,
      count: planetList.length,
      unit: 'worlds',
      representative: 'leia-organa',
    },
    {
      key: 'species',
      title: 'Species',
      description: 'A field guide to the galaxy.',
      href: routes.species,
      count: speciesList.length,
      unit: 'species',
      representative: 'chewbacca',
    },
    {
      key: 'starship',
      title: 'Starships',
      description: 'Cruisers, freighters, hyperdrives.',
      href: routes.starships,
      count: starshipList.length,
      unit: 'vessels',
      representative: 'han-solo',
    },
    {
      key: 'vehicle',
      title: 'Vehicles',
      description: 'Walkers, speeders, gunships.',
      href: routes.vehicles,
      count: vehicleList.length,
      unit: 'craft',
      representative: 'boba-fett',
    },
  ];

  const reps = await Promise.all(entries.map((e) => characters.findBySlug(e.representative)));

  return (
    <nav className={styles.menu} aria-label="Codex sections">
      <ul className={styles.grid}>
        {entries.map((entry, i) => {
          const rep = reps[i];
          return (
            <li key={entry.key} className={styles.cell}>
              <Link href={entry.href} className={styles.tile}>
                <div className={styles.media} aria-hidden="true">
                  {rep?.image ? (
                    <Image
                      src={rep.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 720px) 50vw, 100vw"
                      className={styles.mediaImage}
                      loading="lazy"
                    />
                  ) : null}
                  <span className={styles.mediaScrim} />
                </div>
                <div className={styles.body}>
                  <p className={styles.count}>
                    <span className={styles.countNumber}>{entry.count}</span>
                    <span className={styles.countUnit}>{entry.unit}</span>
                  </p>
                  <h3 className={styles.title}>{entry.title}</h3>
                  <p className={styles.description}>{entry.description}</p>
                  <span className={styles.arrow} aria-hidden="true">
                    Browse &rarr;
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
