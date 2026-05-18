import { routes } from '@/config/routes';
import type { Character } from '@/entities/character/model/types';
import { MetaList, type MetaListItem, Surface } from '@/shared/ui';
import Link from 'next/link';
import styles from './CharacterCard.module.css';

type CharacterCardProps = {
  character: Character;
};

/**
 * Editorial-archive card for the characters index. The whole surface is the
 * link target; hover reveals a 1px inset ring tinted by the character's side
 * (Light → kyber, Dark → crimson, none → transparent) via `data-side`.
 */
export function CharacterCard({ character }: CharacterCardProps) {
  const homeworld = character.homeworld?.name ?? 'unknown';
  const species = character.species[0]?.name ?? 'unknown';

  const meta: MetaListItem[] = [
    { label: 'Homeworld', value: homeworld },
    { label: 'Species', value: species },
  ];

  return (
    <Link href={routes.character(character.id)} className={styles.card} data-side={character.side}>
      <Surface className={styles.surface}>
        <h3 className={styles.name}>{character.name}</h3>
        <p className={styles.affiliation}>{sideLabel(character.side)}</p>
        <MetaList items={meta} aria-label={`${character.name} details`} />
      </Surface>
    </Link>
  );
}

function sideLabel(side: Character['side']): string {
  switch (side) {
    case 'light':
      return 'Light side';
    case 'dark':
      return 'Dark side';
    default:
      return 'Unaligned';
  }
}
