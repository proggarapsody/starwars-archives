import { routes } from '@/config/routes';
import type { Character } from '@/entities/character/model/types';
import Image from 'next/image';
import Link from 'next/link';
import styles from './CharacterCard.module.css';

type CharacterCardProps = {
  character: Character;
};

/**
 * Wikia-style character tile: PNG portrait, name overlay, side indicator
 * along the top edge (light = green, dark = red, none = neutral).
 */
export function CharacterCard({ character }: CharacterCardProps) {
  const homeworld = character.homeworld?.name ?? 'Unknown';
  const species = character.species[0]?.name ?? 'Unknown';

  return (
    <Link href={routes.character(character.id)} className={styles.card} data-side={character.side}>
      <span className={styles.sideBar} aria-hidden="true" />
      <div className={styles.media}>
        {character.image ? (
          <Image
            src={character.image}
            alt={character.name}
            fill
            sizes="(min-width: 1024px) 22vw, (min-width: 720px) 33vw, 50vw"
            className={styles.image}
            loading="lazy"
          />
        ) : (
          <div className={styles.imagePlaceholder} aria-hidden="true">
            {character.name.charAt(0)}
          </div>
        )}
        <span className={styles.scrim} aria-hidden="true" />
        <span className={styles.sideTag}>{sideLabel(character.side)}</span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.name}>{character.name}</h3>
        <dl className={styles.meta}>
          <div className={styles.metaRow}>
            <dt>Species</dt>
            <dd>{species}</dd>
          </div>
          <div className={styles.metaRow}>
            <dt>Homeworld</dt>
            <dd>{homeworld}</dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}

function sideLabel(side: Character['side']): string {
  switch (side) {
    case 'light':
      return 'Light';
    case 'dark':
      return 'Dark';
    default:
      return 'Neutral';
  }
}
