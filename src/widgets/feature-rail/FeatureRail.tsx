import { routes } from '@/config/routes';
import { site } from '@/config/site';
import { characters, films, planets, starships } from '@/shared/api';
import { SmallCapsLabel } from '@/shared/ui';
import Link from 'next/link';
import styles from './FeatureRail.module.css';

type RailItem = {
  key: 'character' | 'film' | 'planet' | 'starship';
  kind: string;
  name: string;
  meta: string;
  href: string;
};

function formatYear(isoDate: string): string {
  return isoDate.slice(0, 4);
}

function joinMeta(parts: ReadonlyArray<string | null | undefined>): string {
  return parts.filter((p): p is string => Boolean(p?.length)).join(' · ');
}

/**
 * Curated sample rail surfacing one entry from four entity sections.
 * Server component: picks are explicit slugs from `site.featuredSlugs` and
 * resolved through the matching repositories. Detail routes do not exist
 * yet — links will 404 until the detail-page slice lands.
 */
export async function FeatureRail() {
  const {
    character: charSlug,
    film: filmSlug,
    planet: planetSlug,
    starship: shipSlug,
  } = site.featuredSlugs;

  const [character, film, planet, starship] = await Promise.all([
    characters.findBySlug(charSlug),
    films.findBySlug(filmSlug),
    planets.findBySlug(planetSlug),
    starships.findBySlug(shipSlug),
  ]);

  const items: RailItem[] = [];

  if (character) {
    const speciesName = character.species[0]?.name ?? null;
    const homeworldName = character.homeworld?.name ?? null;
    items.push({
      key: 'character',
      kind: 'Character',
      name: character.name,
      meta: joinMeta([speciesName, homeworldName]) || 'Galactic figure',
      href: routes.character(character.id),
    });
  }

  if (film) {
    items.push({
      key: 'film',
      kind: 'Film',
      name: film.title,
      meta: joinMeta([`Episode ${film.episode}`, formatYear(film.releaseDate), film.director]),
      href: routes.film(film.id),
    });
  }

  if (planet) {
    const climate = planet.climate[0] ?? null;
    const terrain = planet.terrain[0] ?? null;
    items.push({
      key: 'planet',
      kind: 'Planet',
      name: planet.name,
      meta: joinMeta([climate, terrain]) || 'World on record',
      href: routes.planet(planet.id),
    });
  }

  if (starship) {
    const manufacturer = starship.manufacturer[0] ?? null;
    items.push({
      key: 'starship',
      kind: 'Starship',
      name: starship.name,
      meta: joinMeta([starship.starshipClass, manufacturer]) || 'Vessel on record',
      href: routes.starship(starship.id),
    });
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className={styles.rail} aria-label="Featured entries">
      <ul className={styles.list}>
        {items.map((item, index) => (
          <li key={item.key} className={styles.item} data-offset={index % 4}>
            <Link href={item.href} className={styles.link}>
              <SmallCapsLabel className={styles.kind}>{item.kind}</SmallCapsLabel>
              <h3 className={styles.name}>{item.name}</h3>
              <p className={styles.meta}>{item.meta}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
