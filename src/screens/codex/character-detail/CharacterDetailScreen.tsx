import { routes } from '@/config/routes';
import type { Character } from '@/entities/character/model/types';
import { formatNumberOrUnknown } from '@/shared/lib/format/number';
import { Container, SmallCapsLabel } from '@/shared/ui';
import Image from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import styles from './CharacterDetailScreen.module.css';

type DossierEntry = {
  label: string;
  value: ReactNode;
  numeric?: boolean;
};

type CharacterDetailScreenProps = {
  character: Character;
};

/**
 * Editorial dossier for a single character. RSC; pure layout over the
 * `Character` projection from the repository. Side-tint (kyber / crimson /
 * unaligned) is applied via `data-side` on the root and surfaces as a 1px
 * hairline on portrait frame, eyebrow rule, and relation arrows.
 */
export function CharacterDetailScreen({ character }: CharacterDetailScreenProps) {
  const dossier = buildDossier(character);
  const appearance = buildAppearance(character);
  const sideLabel = SIDE_LABEL[character.side];

  return (
    <Container as="article" className={styles.screen} data-side={character.side}>
      <nav className={styles.back} aria-label="Breadcrumb">
        <Link href={routes.characters} className={styles.backLink}>
          <span className={styles.backArrow} aria-hidden="true">
            &larr;
          </span>
          <span>All characters</span>
        </Link>
      </nav>

      <header className={styles.hero}>
        <div className={styles.heroText}>
          <SmallCapsLabel as="p" className={styles.eyebrow}>
            <span>Character</span>
            <span className={styles.eyebrowDot} aria-hidden="true">
              &middot;
            </span>
            <span>{sideLabel}</span>
          </SmallCapsLabel>
          <h1 className={styles.name}>{character.name}</h1>
          {character.description ? <p className={styles.lede}>{character.description}</p> : null}
          {character.affiliations.length > 0 ? (
            <ul className={styles.affiliations} aria-label="Primary affiliations">
              {character.affiliations.slice(0, 3).map((aff) => (
                <li key={aff} className={styles.affiliationsItem}>
                  {aff}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <figure className={styles.heroFigure}>
          {character.image ? (
            <Image
              src={character.image}
              alt={`${character.name} — archival portrait`}
              fill
              sizes="(min-width: 960px) 36vw, 90vw"
              className={styles.heroImage}
              priority
            />
          ) : (
            <div className={styles.heroImagePlaceholder} aria-hidden="true" />
          )}
          <span className={styles.heroFrame} aria-hidden="true" />
        </figure>
      </header>

      {dossier.length > 0 ? (
        <section className={styles.dossier} aria-label="Vital record">
          <dl className={styles.dossierGrid}>
            {dossier.map((item) => (
              <div key={item.label} className={styles.dossierCell}>
                <dt className={styles.dossierTerm}>{item.label}</dt>
                <dd
                  className={
                    item.numeric
                      ? `${styles.dossierValue} ${styles.dossierValueNumeric}`
                      : styles.dossierValue
                  }
                >
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {appearance.length > 0 || character.cybernetics ? (
        <section className={styles.appearance} aria-labelledby="appearance-heading">
          <SmallCapsLabel as="h2" id="appearance-heading" className={styles.subhead}>
            Appearance
          </SmallCapsLabel>
          <div className={styles.appearanceBody}>
            {appearance.length > 0 ? (
              <dl className={styles.appearanceGrid}>
                {appearance.map((item) => (
                  <div key={item.label} className={styles.dossierCell}>
                    <dt className={styles.dossierTerm}>{item.label}</dt>
                    <dd className={styles.dossierValue}>{item.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {character.cybernetics ? (
              <p className={styles.cybernetics}>
                <span className={styles.cyberneticsLabel}>Cybernetics</span>
                {character.cybernetics}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}

      {character.masters.length > 0 || character.apprentices.length > 0 ? (
        <section className={styles.lineage} aria-labelledby="lineage-heading">
          <SmallCapsLabel as="h2" id="lineage-heading" className={styles.subhead}>
            Lineage
          </SmallCapsLabel>
          <div className={styles.lineageGrid}>
            {character.masters.length > 0 ? (
              <div className={styles.lineageColumn}>
                <p className={styles.lineageRole}>Trained by</p>
                <ul className={styles.lineageList}>
                  {character.masters.map((master) => (
                    <li key={master}>{master}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            {character.apprentices.length > 0 ? (
              <div className={styles.lineageColumn}>
                <p className={styles.lineageRole}>Trained</p>
                <ul className={styles.lineageList}>
                  {character.apprentices.map((app) => (
                    <li key={app}>{app}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {character.affiliations.length > 0 ? (
        <section className={styles.affiliationsFull} aria-labelledby="affiliations-heading">
          <SmallCapsLabel as="h2" id="affiliations-heading" className={styles.subhead}>
            Affiliations
          </SmallCapsLabel>
          <ul className={styles.affiliationsList}>
            {character.affiliations.map((aff) => (
              <li key={aff} className={styles.affiliationsListItem}>
                {aff}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Relations character={character} />

      <footer className={styles.footer}>
        <Link href={routes.characters} className={styles.footerLink}>
          <span>Return to characters</span>
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </footer>
    </Container>
  );
}

function Relations({ character }: { character: Character }) {
  const rails = [
    { id: 'films', label: 'Films', items: character.films, routeFor: routes.film },
    { id: 'starships', label: 'Starships', items: character.starships, routeFor: routes.starship },
    { id: 'vehicles', label: 'Vehicles', items: character.vehicles, routeFor: routes.vehicle },
  ] as const;

  const visible = rails.filter((r) => r.items.length > 0);
  if (visible.length === 0) return null;

  return (
    <section className={styles.relations} aria-labelledby="relations-heading">
      <SmallCapsLabel as="h2" id="relations-heading" className={styles.subhead}>
        Connections
      </SmallCapsLabel>
      <div className={styles.relationsGrid}>
        {visible.map((rail) => (
          <div key={rail.id} className={styles.relationsCol}>
            <p className={styles.relationsColLabel}>{rail.label}</p>
            <ul className={styles.relationsList}>
              {rail.items.map((ref) => (
                <li key={ref.id} className={styles.relationsItem}>
                  <Link href={rail.routeFor(ref.id)} className={styles.relationsLink}>
                    <span className={styles.relationsName}>{ref.name}</span>
                    <span className={styles.relationsArrow} aria-hidden="true">
                      &rarr;
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function buildDossier(character: Character): DossierEntry[] {
  const items: DossierEntry[] = [];

  if (character.birthYear) {
    items.push({
      label: 'Born',
      value: `${character.birthYear.value} ${character.birthYear.era}`,
      numeric: true,
    });
  }
  if (character.deathYear) {
    items.push({
      label: 'Died',
      value: `${character.deathYear.value} ${character.deathYear.era}`,
      numeric: true,
    });
  }
  if (character.homeworld) {
    items.push({
      label: 'Homeworld',
      value: (
        <Link href={routes.planet(character.homeworld.id)} className={styles.dossierLink}>
          {character.homeworld.name}
        </Link>
      ),
    });
  }
  const primarySpecies = character.species[0];
  if (primarySpecies) {
    items.push({
      label: 'Species',
      value: (
        <Link href={routes.speciesEntry(primarySpecies.id)} className={styles.dossierLink}>
          {primarySpecies.name}
        </Link>
      ),
    });
  }
  if (character.height) {
    items.push({
      label: 'Height',
      value: `${formatNumberOrUnknown(character.height.cm)} cm`,
      numeric: true,
    });
  }
  if (character.mass) {
    items.push({
      label: 'Mass',
      value: `${formatNumberOrUnknown(character.mass.kg)} kg`,
      numeric: true,
    });
  }
  if (character.gender) {
    items.push({ label: 'Gender', value: GENDER_LABEL[character.gender] });
  }

  return items;
}

function buildAppearance(character: Character): DossierEntry[] {
  const items: DossierEntry[] = [];
  if (character.appearance.hairColor) {
    items.push({ label: 'Hair', value: character.appearance.hairColor });
  }
  if (character.appearance.eyeColor) {
    items.push({ label: 'Eyes', value: character.appearance.eyeColor });
  }
  if (character.appearance.skinColor) {
    items.push({ label: 'Skin', value: character.appearance.skinColor });
  }
  return items;
}

const SIDE_LABEL: Record<Character['side'], string> = {
  light: 'Light side',
  dark: 'Dark side',
  none: 'Unaligned',
};

const GENDER_LABEL: Record<NonNullable<Character['gender']>, string> = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
  droid: 'Droid',
};
