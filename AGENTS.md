# AGENTS.md

Terse index for AI agents on this repo. Read [`CONTRIBUTING.md`](CONTRIBUTING.md) for full dev workflow.

## What this project is

Modern rebuild of [starwars-wiki](https://github.com/proggarapsody/starwars-wiki) (2022) as read-only, premium-feel Star Wars encyclopedia ("Star Wars Archives"). Static data, public REST API, Jedi/Sith theme system. **No DB, no auth, no user content.**

## Reference implementations

- [`/Users/aleksey/development/projects/earnie/cryptoideas-webapp`](../earnie/cryptoideas-webapp) — house-style ref for FSD layout. Diverge on App Router routing + CSS Modules over Tailwind.
- [`/Users/aleksey/development/projects/bitbottle`](../bitbottle) — docs pattern ref (this file mirrors its AGENTS.md shape).
- [`/tmp/starwars-wiki`](/tmp/starwars-wiki) — clone of 2022 original. **Don't lift code from it.** Memory anchor only for saber-toggle + theme-flip mechanics.

## Design principles

Read before designing any new component, screen, route, API surface, or visual moment.

- [`docs/TASTE.md`](docs/TASTE.md) — visual identity, Jedi/Sith palettes, typography, motion, anti-patterns.
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — FSD-lite layering in Next App Router, SOLID at data layer, folder map, client/server boundary conventions.

## Domain

- [`docs/CONTEXT.md`](docs/CONTEXT.md) — domain glossary. Grow lazily as terms resolve. Glossary only — no impl details.

## Data

- [`docs/DATA.md`](docs/DATA.md) — source provenance (akabab, swapi.info, fgeorges), build-script docs, normalized schema, image hosting strategy.

## API

- [`docs/API.md`](docs/API.md) — public REST surface at `/api/v1`, conventions, error envelope.

## Architectural decisions

- [`docs/adr/0001-bundled-json-snapshot.md`](docs/adr/0001-bundled-json-snapshot.md) — JSON snapshot in repo over live SWAPI fetches.
- [`docs/adr/0002-fsd-lite-in-next-app-router.md`](docs/adr/0002-fsd-lite-in-next-app-router.md) — FSD-lite folder layering in App Router.
- [`docs/adr/0003-css-modules-over-tailwind.md`](docs/adr/0003-css-modules-over-tailwind.md) — vanilla CSS Modules + native nesting, no Tailwind.

## Workflow

- [`docs/agent-primer.md`](docs/agent-primer.md) — required reading for any subagent implementing new scope.
- [`docs/workflows/git-flow.md`](docs/workflows/git-flow.md) — branching, PR flow, CI gates, merge strategies.
- [`docs/workflows/tdd-cycle.md`](docs/workflows/tdd-cycle.md) — red-green-refactor loop for this project.

## Key rules for AI agents

- **Branches + commits:** branch from `dev`; open PR to `dev`. `main` release-only — `dev → main` PRs deploy. Never push direct to `dev` or `main`. See [`docs/workflows/git-flow.md`](docs/workflows/git-flow.md). Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`).
- **TDD default.** No prod code without failing test first. Exceptions: pure visual layout, no behavior (no clicks, no state, no conditional render). When in doubt, write test.
- **Stack:** Next 15 (App Router) + React 19 + TypeScript strict + Bun + Biome + CSS Modules. No Tailwind. No framer-motion / Motion. GSAP only for bespoke timeline moments (see `docs/TASTE.md`).
- **FSD-lite layers** (top-down): `app/` (Next routes) → `screens/` → `widgets/` → `features/` → `entities/` → `shared/`. Plus `config/` top level. **Imports go down only**, never up. Same-layer cross-slice imports forbidden.
- **Client/server boundary:** default RSC. Client components in `ui/` subfolders, end in `.client.tsx`. Grep-able boundary.
- **Data layer:** all reads through repository classes in `shared/api/`. RSCs + API routes call repos — no duplication, no direct JSON imports in components.
- **CSS tokens:** all colors, spacing, fonts, motion timings as CSS custom properties under `:root` + theme blocks. No hex codes or pixel values in component CSS Modules.
- **No `any`.** No `as` casts except in tests via shoehorn.
- **No `console.log` in committed code.** Use typed logger in `shared/lib/log.ts` (added Phase 1) if needed.
- **Pre-commit (Lefthook):** Biome format + check, typecheck, vitest on data layer. CI re-runs all.
- **Images:** hot-linked from Wikia CDN via `next/image` `remotePatterns`. Document new remote pattern in `docs/DATA.md`.

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

[`BACKLOG.md`](BACKLOG.md) — features deferred from v1. Galactic Map lives here.