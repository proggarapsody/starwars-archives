# Architecture

## Approach

**Feature-Sliced Design (FSD), lite variant, adapted for Next.js App Router.** See [ADR-0002](adr/0002-fsd-lite-in-next-app-router.md) for reasoning. Borrow FSD's layered vocab (entities, features, widgets, screens, shared); drop app-layer folder — Next's `src/app/layout.tsx` does that natively.

## Layers

Imports go **down only**. Higher layer imports any lower; same-layer cross-slice forbidden. No linter enforces — see [ADR-0002](adr/0002-fsd-lite-in-next-app-router.md) for why.

```
config/          ← top-level constants, env, route map, theme tokens, site metadata
  ▲
  │  imported by everything below
  │
src/app/         ← Next App Router. Routes, layouts, route handlers, metadata.
                   The root layout doubles as FSD "app" layer (providers, fonts, globals).
  ▲
src/screens/     ← Page composition. One folder per Next route's view. The Next page.tsx
                   is a 3-line wrapper that renders the corresponding screen.
  ▲
src/widgets/     ← Composite UI blocks reused across screens (SiteHeader, EntryHero,
                   RelatedEntriesRail). Stateful but not interactive in the "feature" sense.
  ▲
src/features/    ← User-facing interactive units (search-codex, theme-toggle, force-tinted-ui).
                   Each feature owns its UI, logic, and any client-only state.
  ▲
src/entities/    ← Domain objects. One folder per entity type (character, film, planet, species,
                   starship, vehicle). Owns the entity's types, repository, and presentational UI
                   (CharacterCard, FilmHero, etc.).
  ▲
src/shared/      ← Primitives. ui/ (Button, Card, Badge, Skeleton), api/ (data source + base
                   repository), lib/ (hooks, utils, motion modules), styles/ (globals only).
```

## Folder map

```
starwars-archives/
├── src/
│   ├── app/
│   │   ├── layout.tsx               Root layout. Fonts, theme attribute, providers, global styles.
│   │   ├── page.tsx                 Home: <HomeScreen />
│   │   ├── (codex)/                 Route group — does not affect URL
│   │   │   ├── characters/
│   │   │   │   ├── page.tsx         List: <CharactersListScreen />
│   │   │   │   └── [slug]/page.tsx  Detail: <CharacterDetailScreen slug={slug} />
│   │   │   ├── films/[slug]/page.tsx
│   │   │   ├── planets/[slug]/page.tsx
│   │   │   ├── species/[slug]/page.tsx
│   │   │   ├── starships/[slug]/page.tsx
│   │   │   └── vehicles/[slug]/page.tsx
│   │   ├── about/page.tsx
│   │   ├── sources/page.tsx
│   │   ├── api/page.tsx             Public API docs landing
│   │   ├── api/v1/
│   │   │   ├── characters/route.ts
│   │   │   ├── characters/[slug]/route.ts
│   │   │   └── ...
│   │   ├── not-found.tsx
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── opengraph-image.tsx      Default OG image
│   │
│   ├── screens/
│   │   ├── home/
│   │   ├── characters-list/
│   │   ├── character-detail/
│   │   ├── films-list/
│   │   ├── film-detail/
│   │   └── ...
│   │
│   ├── widgets/
│   │   ├── site-header/
│   │   ├── site-footer/
│   │   ├── entry-hero/
│   │   ├── related-entries-rail/
│   │   └── stat-block/
│   │
│   ├── features/
│   │   ├── search-codex/
│   │   ├── theme-toggle/            The lightsaber UI
│   │   └── force-tinted-ui/
│   │
│   ├── entities/
│   │   ├── character/
│   │   │   ├── model/               types.ts, schema validators
│   │   │   ├── api/                 CharacterRepository
│   │   │   └── ui/                  CharacterCard, CharacterStatBlock, etc.
│   │   ├── film/
│   │   ├── planet/
│   │   ├── species/
│   │   ├── starship/
│   │   └── vehicle/
│   │
│   └── shared/
│       ├── api/
│       │   ├── data-source.ts       CodexDataSource interface
│       │   ├── json-data-source.ts  JsonCodexDataSource implementation
│       │   └── repository.ts        Base Repository<T> class
│       ├── data/                    Bundled normalized JSON (committed)
│       │   ├── characters.json
│       │   ├── films.json
│       │   ├── planets.json
│       │   ├── species.json
│       │   ├── starships.json
│       │   └── vehicles.json
│       ├── ui/
│       │   ├── button/
│       │   ├── card/
│       │   ├── badge/
│       │   ├── skeleton/
│       │   └── ...
│       ├── lib/
│       │   ├── motion/              GSAP modules: lightsaber-ignite, force-tint, etc.
│       │   ├── format/              Quantity formatters (height, mass, etc.)
│       │   ├── hooks/
│       │   └── slug.ts
│       └── styles/
│           ├── globals.css          Resets, base typography, theme blocks
│           └── tokens.css           Imported by globals; references config/theme
│
├── config/
│   ├── site.ts                      Site name, OG defaults, social links
│   ├── routes.ts                    Route map for nav, sitemap, breadcrumbs
│   ├── env.ts                       Typed env access (z.object().parse(process.env))
│   ├── theme/
│   │   ├── tokens.ts                Token definitions (TS source of truth)
│   │   ├── jedi.css                 Jedi palette (CSS custom properties)
│   │   └── sith.css                 Sith palette
│   └── features.ts                  Feature flags (currently empty)
│
├── scripts/
│   ├── build-data.ts                Snapshot generator
│   └── build-data/                  Per-source loaders, normalizers, mergers
│
├── public/
│   └── ...
│
└── tests/
    └── playwright/                  E2E smoke tests (post-MVP)
```

## SOLID at the data layer

Data layer only place needing OOP discipline. UI = plain typed records + fns.

### Single Responsibility

One repo per entity type. `CharacterRepository.findBySlug` knows nothing of films. Cross-entity composition -> screens or dedicated services like `RelatedEntriesService`.

### Open / Closed

New filter? Add method to repo or extend query-spec obj. Don't modify existing methods.

### Liskov

`JsonCodexDataSource` implements `CodexDataSource`. Future impls (Postgres, KV) must be drop-in — same signatures, return types, error semantics.

### Interface Segregation

`CodexDataSource` exposes one method per entity-collection getter (`getCharacters`, `getFilms`, …). UI consumers depend on specific repo, not whole data source.

### Dependency Inversion

Repos depend on `CodexDataSource` interface, not concrete JSON loader. Wired in `shared/api/index.ts` as single composition root.

```ts
// src/shared/api/index.ts (sketch)
const dataSource: CodexDataSource = new JsonCodexDataSource();
export const characters = new CharacterRepository(dataSource);
export const films = new FilmRepository(dataSource);
// ...
```

## Client / server boundary

- **Default to RSC.** All UI is RSC unless needs interactivity.
- **Client components** have `"use client"` top, filename ends `.client.tsx`, live in `ui/` subfolder under their slice. Suffix -> boundary grep-able.
- **Data fetching** always server-side (RSC or route handlers), never client.
- **GSAP modules** in `shared/lib/motion/` imported only by client components — touch DOM.

```
src/features/theme-toggle/
├── index.ts                         Public export
├── model/
│   └── theme.ts                     Theme type, persistence helpers
└── ui/
    └── LightsaberToggle.client.tsx  Client — uses GSAP for the ignite animation
```

## API surface

Public REST API at `/api/v1` + internal RSC reads share same repo code. No dup, no separate "client"/"server" APIs. See [`API.md`](API.md) for endpoints.

```
GET /api/v1/characters?affiliation=jedi-order   ← App Router route handler
                                                    calls characters.find({ affiliation: 'jedi-order' })

CharactersListScreen (RSC)                      ← Server Component
                                                    also calls characters.find({ affiliation: 'jedi-order' })
```

## Tokens

All visual values in `config/theme/`. Component CSS Modules ref custom properties only. See [`TASTE.md`](TASTE.md) for values.

```css
/* ❌ Bad — hex in component CSS */
.card { background: #efe7d6; padding: 24px; }

/* ✅ Good — token reference */
.card { background: var(--bg-surface); padding: var(--space-6); }
```

## Out of scope

- **Steiger** (FSD linter). Conventions documented, not enforced. Tradeoff accepted in [ADR-0002](adr/0002-fsd-lite-in-next-app-router.md).
- **Public Slice Index (PSI).** Cross-slice imports use direct paths. Less ceremony, slightly less encapsulation.
- **Tailwind.** See [ADR-0003](adr/0003-css-modules-over-tailwind.md).
- **Motion library.** Native CSS handles 70% of motion; GSAP for bespoke timelines. No framer-motion, no Motion.