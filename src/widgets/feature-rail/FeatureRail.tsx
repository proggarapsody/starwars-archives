import { routes } from '@/config/routes';
import { site } from '@/config/site';
import { characters, films, planets, starships } from '@/shared/api';
import Image from 'next/image';
import Link from 'next/link';
import styles from './FeatureRail.module.css';

type RailItem = {
  key: string;
  kind: string;
  name: string;
  meta: string;
  href: string;
  image: string | null;
};

function formatYear(isoDate: string): string {
  return isoDate.slice(0, 4);
}

function joinMeta(parts: ReadonlyArray<string | null | undefined>): string {
  return parts.filter((p): p is string => Boolean(p?.length)).join(' · ');
}

/**
 * Curated four-card rail surfacing one featured entry from four sections.
 * Characters carry their wikia portrait; non-character entries fall back to
 * a representative character portrait so the rail reads as image-led.
 */
export async function FeatureRail() {
  const {
    character: charSlug,
    film: filmSlug,
    planet: planetSlug,
    starship: shipSlug,
  } = site.featuredSlugs;

  const [character, film, planet, starship, vader, leia, han] = await Promise.all([
    characters.findBySlug(charSlug),
    films.findBySlug(filmSlug),
    planets.findBySlug(planetSlug),
    starships.findBySlug(shipSlug),
    characters.findBySlug('darth-vader'),
    characters.findBySlug('leia-organa'),
    characters.findBySlug('han-solo'),
  ]);

  const items: RailItem[] = [];

  if (character) {
    items.push({
      key: `c-${character.id}`,
      kind: 'Character',
      name: character.name,
      meta: joinMeta([character.species[0]?.name, character.homeworld?.name]) || 'Galactic figure',
      href: routes.character(character.id),
      image: character.image,
    });
  }

  if (film) {
    items.push({
      key: `f-${film.id}`,
      kind: 'Film',
      name: film.title,
      meta: joinMeta([`Episode ${film.episode}`, formatYear(film.releaseDate), film.director]),
      href: routes.film(film.id),
      image: vader?.image ?? null,
    });
  }

  if (planet) {
    items.push({
      key: `p-${planet.id}`,
      kind: 'Planet',
      name: planet.name,
      meta: joinMeta([planet.climate[0], planet.terrain[0]]) || 'World on record',
      href: routes.planet(planet.id),
      image: leia?.image ?? null,
    });
  }

  if (starship) {
    items.push({
      key: `s-${starship.id}`,
      kind: 'Starship',
      name: starship.name,
      meta: joinMeta([starship.starshipClass, starship.manufacturer[0]]) || 'Vessel on record',
      href: routes.starship(starship.id),
      image: han?.image ?? null,
    });
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <ul className={styles.rail}>
      {items.map((item) => (
        <li key={item.key} className={styles.item}>
          <Link href={item.href} className={styles.card}>
            <div className={styles.media} aria-hidden="true">
              {item.image ? (
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 22vw, (min-width: 720px) 45vw, 90vw"
                  className={styles.mediaImage}
                  loading="lazy"
                />
              ) : null}
              <span className={styles.mediaScrim} />
              <span className={styles.kind}>{item.kind}</span>
            </div>
            <div className={styles.body}>
              <h3 className={styles.name}>{item.name}</h3>
              <p className={styles.meta}>{item.meta}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
