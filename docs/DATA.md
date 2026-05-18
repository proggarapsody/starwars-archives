# Data

## Provenance

The bundled snapshot in `src/shared/data/` is generated from three upstream sources, merged and normalized.

| Source | License | Used for | URL |
|---|---|---|---|
| **akabab/starwars-api** | MIT | Characters: structured fields (height, mass, born/died, masters, apprentices, affiliations, image URLs) | https://github.com/akabab/starwars-api |
| **swapi.info** (SivaramPg/swapi.info) | open | Films, Planets, Species, Starships, Vehicles: structured stats | https://swapi.info |
| **fgeorges/star-wars-dataset** | MIT | Prose descriptions (Wikipedia-derived) for all entity types | https://github.com/fgeorges/star-wars-dataset |

**Dropped sources** (considered, rejected):

- `starwars-databank` — broad entity count (964 characters, 326 locations, etc.) but each record only has `{ name, description, image }` — no structured fields for filtering or cross-linking. Breadth without depth.
- `swapi.dev` — schema-equivalent to swapi.info but with stringly-typed numbers (`"mass": "77"`). swapi.info is the cleaner fork.
- `swapi.tech` — different schema, less consistent.
- `evelinag/StarWars-social-network` — scene-by-scene character co-appearance. Dropped along with the mentorship/co-appearance feature in the planning pivot.
- `Wikidata SPARQL` — gold-standard for licensing (CC0) and structure, but adds query overhead. Reserve for a future enrichment pass if needed.
- Hand-curated additions for Mandalorian/Andor-era entries — out of scope for v1.

## Normalized schema

Every entity is a plain typed record (no classes). Quantities carry units in the type, not the value. `null` is the only "unknown" — no sentinel strings like `"n/a"` or `"unknown"`. Cross-entity refs are inline objects with slug, name, and href — never opaque URLs.

```ts
// Shared
type EntityRef<T extends EntityType> = {
  id: Slug;
  name: string;
  href: `/api/v1/${T}s/${Slug}`;
  type: T;
};

type Side = 'light' | 'dark' | 'none';   // Hand-tagged. Drives Force-Tinted UI.
type Era = 'BBY' | 'ABY';

// Character
type Character = {
  id: Slug;
  name: string;
  description: string;                    // Prose from fgeorges
  image: string | null;                   // Wikia CDN URL
  side: Side;                             // Hand-tagged
  gender: 'male' | 'female' | 'other' | 'droid' | null;
  birthYear: { value: number; era: Era } | null;
  deathYear: { value: number; era: Era } | null;
  height: { cm: number } | null;
  mass: { kg: number } | null;
  appearance: {
    hairColor: string | null;
    eyeColor: string | null;
    skinColor: string | null;
  };
  cybernetics: string | null;
  homeworld: EntityRef<'planet'> | null;
  species: EntityRef<'species'>[];
  films: EntityRef<'film'>[];
  starships: EntityRef<'starship'>[];
  vehicles: EntityRef<'vehicle'>[];
  affiliations: string[];                 // Faction names — not entities in v1
  masters: string[];                      // Plain names — not entities (some are non-canonical)
  apprentices: string[];
};

// Film, Planet, Species, Starship, Vehicle — same shape principles, see entities/*/model/types.ts
```

## Build script

The snapshot is **manual**: `bun run build:data`. Not part of `next build`. The script lives at `scripts/build-data.ts` and is decomposed into per-source loaders and per-entity normalizers in `scripts/build-data/`.

```
scripts/
└── build-data/
    ├── index.ts             Orchestrator: fetch → normalize → merge → write
    ├── sources/
    │   ├── akabab.ts        Fetcher + types for akabab characters
    │   ├── swapi-info.ts    Fetcher + types for swapi.info entities
    │   └── fgeorges.ts      Fetcher + types for fgeorges descriptions
    ├── normalize/
    │   ├── character.ts
    │   ├── film.ts
    │   ├── planet.ts
    │   ├── species.ts
    │   ├── starship.ts
    │   ├── vehicle.ts
    │   ├── quantity.ts      "172" → { cm: 172 }, "unknown" → null
    │   ├── slug.ts          "A New Hope" → "a-new-hope"
    │   └── ref.ts           Resolves cross-entity references to EntityRef<T>
    ├── merge/
    │   └── character.ts     Merge akabab + fgeorges description into normalized Character
    └── tagging/
        └── sides.json       Hand-curated character → side ('light'|'dark'|'none')
```

Every transform function is TDD'd. Run `bun run test scripts/build-data` to verify.

## When to re-run

- After upstream source updates (rare).
- After editing `scripts/build-data/tagging/*` (hand-curated overrides).
- After changing the normalized schema.

Output is committed JSON — re-running on every build is wasteful and breaks deterministic builds.

## Image hosting

Character images are hot-linked from the Wikia CDN (`vignette.wikia.nocookie.net` and the older `lumiere-a.akamaihd.net` are NOT used — akabab points to Wikia). Configure `next/image` in `next.config.ts`:

```ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'vignette.wikia.nocookie.net' },
    { protocol: 'https', hostname: 'static.wikia.nocookie.net' },
  ],
}
```

**Risks of hot-linking:**
- Third-party CDN dependency — if Wikia changes URL structure, images break.
- Reliability and latency depend on Wikia's CDN, not Vercel's.
- Lucasfilm owns the underlying imagery; hosting locally vs hot-linking does not change the IP position.

**Mitigation:** every `next/image` usage has a fallback poster image. The fallback lives at `/public/images/fallback-portrait.png`.

## Schema validation

Every normalized record is validated against a Zod (or `valibot`) schema at the end of the build step. If validation fails, the build aborts. This is the only place we use a validation library — repositories trust the typed JSON at runtime.

## What is not in the snapshot

- TV series characters not in films (Andor, Mandalorian, Clone Wars, Rebels).
- Books, comics, games.
- Locations finer-grained than Planet (e.g. Mos Eisley as a sub-planet location).
- Organizations as entities (they live as affiliation strings on characters only).
- Droids as a distinct entity type — they're characters (C-3PO, R2-D2, BB-8).

If we ever expand: Wikidata SPARQL is the most legitimate upstream for any of the above.

## License + attribution

Listed in `/sources` route in the app. Mirrors this file's "Provenance" table. Lucasfilm Ltd. attribution required for any imagery in the deployed site.
