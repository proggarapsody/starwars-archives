import { routes } from '@/config/routes';
import { characters, films, planets, species, starships, vehicles } from '@/shared/api';
import { SmallCapsLabel } from '@/shared/ui';
import Link from 'next/link';
import styles from './CodexMenu.module.css';

type CodexEntry = {
  key: 'character' | 'film' | 'planet' | 'species' | 'starship' | 'vehicle';
  title: string;
  description: string;
  href: string;
  count: number;
  /** Noun used in the small-caps count label, e.g. "82 characters". */
  unit: string;
};

/**
 * Editorial menu of the six codex sections. Server component: counts are
 * resolved at build time through the repositories. Layout is an asymmetric
 * two-column zig-zag — explicitly NOT a 3×2 equal grid (per docs/TASTE.md).
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
      description:
        'Jedi, Sith, smugglers, droids — the figures the saga turns on, with the side affiliations that shape them.',
      href: routes.characters,
      count: characterList.length,
      unit: 'characters',
    },
    {
      key: 'film',
      title: 'Films',
      description:
        'The episodic films in canonical order, with director, year, and the threads each one carries forward.',
      href: routes.films,
      count: filmList.length,
      unit: 'films',
    },
    {
      key: 'planet',
      title: 'Planets',
      description:
        'Worlds at the edge of the Outer Rim and at the heart of the Core — climate, terrain, and population at a glance.',
      href: routes.planets,
      count: planetList.length,
      unit: 'planets',
    },
    {
      key: 'species',
      title: 'Species',
      description:
        'A field guide to the sapient and non-sapient species of the galaxy, by classification, language, and lifespan.',
      href: routes.species,
      count: speciesList.length,
      unit: 'species',
    },
    {
      key: 'starship',
      title: 'Starships',
      description:
        'Capital cruisers and freighters built for hyperspace, with class, manufacturer, and hyperdrive rating.',
      href: routes.starships,
      count: starshipList.length,
      unit: 'starships',
    },
    {
      key: 'vehicle',
      title: 'Vehicles',
      description:
        'Atmospheric and ground craft — walkers, speeders, gunships — with class, manufacturer, and top speed.',
      href: routes.vehicles,
      count: vehicleList.length,
      unit: 'vehicles',
    },
  ];

  return (
    <nav className={styles.menu} aria-label="Codex sections">
      <ul className={styles.list}>
        {entries.map((entry, index) => (
          <li
            key={entry.key}
            className={styles.item}
            data-align={index % 2 === 0 ? 'start' : 'end'}
          >
            <Link href={entry.href} className={styles.link}>
              <h3 className={styles.title}>{entry.title}</h3>
              <p className={styles.description}>{entry.description}</p>
              <SmallCapsLabel className={styles.count}>
                {entry.count} {entry.unit}
              </SmallCapsLabel>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
