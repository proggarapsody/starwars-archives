# AGENTS.md

Terse index for AI agents working on this repo. Read [`CONTRIBUTING.md`](CONTRIBUTING.md) for the full dev workflow.

## What this project is

A modern rebuild of [starwars-wiki](https://github.com/proggarapsody/starwars-wiki) (2022) as a read-only, premium-feel Star Wars encyclopedia ("Star Wars Archives"). Static data, public REST API, Jedi/Sith theme system. **No DB, no auth, no user-generated content.**

## Reference implementations

- [`/Users/aleksey/development/projects/earnie/cryptoideas-webapp`](../earnie/cryptoideas-webapp) — house-style reference for FSD layout. We diverge from it on App Router routing and CSS Modules over Tailwind.
- [`/Users/aleksey/development/projects/bitbottle`](../bitbottle) — reference for the docs pattern (this file mirrors its AGENTS.md shape).
- [`/tmp/starwars-wiki`](/tmp/starwars-wiki) — clone of the 2022 original. **Do not lift code from it.** It exists only as a memory anchor for the saber-toggle and theme-flip mechanics.

## Design principles

Read before designing any new component, screen, route, API surface, or visual moment.

- [`docs/TASTE.md`](docs/TASTE.md) — visual identity, Jedi/Sith theme palettes, typography, motion principles, anti-patterns.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — FSD-lite layering inside Next App Router, SOLID at the data layer, folder map, client/server boundary conventions.

## Domain

- [`docs/CONTEXT.md`](docs/CONTEXT.md) — domain glossary. Grow it lazily as new terms resolve. Glossary only — no implementation details.

## Data

- [`docs/DATA.md`](docs/DATA.md) — source provenance (akabab, swapi.info, fgeorges), build-script docs, normalized schema, image hosting strategy.

## API

- [`docs/API.md`](docs/API.md) — public REST surface at `/api/v1`, conventions, error envelope.

## Architectural decisions

- [`docs/adr/0001-bundled-json-snapshot.md`](docs/adr/0001-bundled-json-snapshot.md) — JSON snapshot in repo over live SWAPI fetches.
- [`docs/adr/0002-fsd-lite-in-next-app-router.md`](docs/adr/0002-fsd-lite-in-next-app-router.md) — FSD-lite folder layering inside App Router.
- [`docs/adr/0003-css-modules-over-tailwind.md`](docs/adr/0003-css-modules-over-tailwind.md) — vanilla CSS Modules + native nesting instead of Tailwind.

## Workflow

- [`docs/agent-primer.md`](docs/agent-primer.md) — required reading for any subagent implementing a new scope.
- [`docs/workflows/git-flow.md`](docs/workflows/git-flow.md) — branching model, PR flow, CI gates, merge strategies.
- [`docs/workflows/tdd-cycle.md`](docs/workflows/tdd-cycle.md) — red-green-refactor loop, applied to this project.

## Key rules for AI agents

- **Branches + commits:** branch from `dev`; open PR to `dev`. `main` is release-only — `dev → main` PRs deploy. Never push directly to `dev` or `main`. See [`docs/workflows/git-flow.md`](docs/workflows/git-flow.md). Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`).
- **TDD is the default.** No production code without a failing test first. Exceptions: pure visual layout with no behavior (no clicks, no state, no conditional render). When in doubt, write the test.
- **Stack:** Next 15 (App Router) + React 19 + TypeScript strict + Bun + Biome + CSS Modules. No Tailwind. No framer-motion / Motion. GSAP only for bespoke timeline moments (see `docs/TASTE.md`).
- **FSD-lite layers** (top-down): `app/` (Next routes) → `screens/` → `widgets/` → `features/` → `entities/` → `shared/`. Plus `config/` at top level. **Imports go down only**, never up. Same-layer cross-slice imports forbidden.
- **Client/server boundary:** default to RSC. Client components live in `ui/` subfolders and end in `.client.tsx`. Grep-able boundary.
- **Data layer:** all reads go through repository classes in `shared/api/`. RSCs and API routes call repositories — no duplication, no direct JSON imports in components.
- **CSS tokens:** all colors, spacing, fonts, motion timings as CSS custom properties under `:root` and theme blocks. No hex codes or pixel values in component CSS Modules.
- **No `any`.** No `as` casts except in tests via shoehorn.
- **No `console.log` in committed code.** Use a typed logger in `shared/lib/log.ts` (added in Phase 1) if needed.
- **Pre-commit (Lefthook):** Biome format + check, typecheck, vitest on the data layer. CI re-runs everything.
- **Images:** hot-linked from Wikia CDN via `next/image` `remotePatterns`. Document any new remote pattern in `docs/DATA.md`.

## Repository layout (target)

```
src/
├── app/                  Next App Router (routes, layouts, route handlers)
│   ├── layout.tsx        Acts as FSD "app" layer: providers, fonts, global styles
│   ├── (codex)/          Route group for the 6 entity browsers
│   └── api/v1/           Public REST endpoints
├── screens/              Page composition (one folder per Next route's screen)
├── widgets/              Composite UI blocks (Header, Hero, Rail)
├── features/             Interactive units (search-codex, theme-toggle)
├── entities/             Domain objects + their UI + types
│   ├── character/
│   ├── film/
│   ├── planet/
│   ├── species/
│   ├── starship/
│   └── vehicle/
├── shared/
│   ├── api/              Repositories + data-source interface
│   ├── data/             Bundled normalized JSON snapshots
│   ├── ui/               Primitives (Button, Card, Badge, Skeleton)
│   ├── lib/              Hooks, utils, motion modules
│   └── styles/           Globals only — tokens live in config/
└── config/               Top-level: env, route map, theme tokens, site metadata

scripts/
└── build-data.ts         Fetches and normalizes the data snapshot

docs/                     See above
```

## Backlog

[`BACKLOG.md`](BACKLOG.md) — features explicitly deferred from v1. Galactic Map lives here.
