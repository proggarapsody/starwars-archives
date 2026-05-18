# Contributing

## Setup

```sh
bun install                  # install dependencies (Bun 1.1+)
bunx lefthook install        # wire up pre-commit hooks
bun run build:data           # generate src/shared/data/*.json from upstream sources
bun run dev                  # http://localhost:3000
```

## Day-to-day commands

| Command | What it does |
|---|---|
| `bun run dev` | Next dev server |
| `bun run build` | Production build |
| `bun run start` | Run production build locally |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run lint` | `biome check .` |
| `bun run format` | `biome format --write .` |
| `bun run test` | Vitest, watch off |
| `bun run test:watch` | Vitest, watch on |
| `bun run build:data` | Fetch + normalize the data snapshot |

## Branches + commits

- Branches: `feature/<slug>` / `fix/<slug>` / `docs/<slug>` / `chore/<slug>`.
- Never push directly to `main`. Open a PR.
- Commit messages: [Conventional Commits](https://www.conventionalcommits.org/). Enforced by commitlint via Lefthook.
  - `feat:` new feature
  - `fix:` bug fix
  - `docs:` docs only
  - `chore:` tooling, deps, config
  - `refactor:` no behavior change
  - `test:` test-only changes
  - `style:` formatting (rare — Biome handles most)

## Test-Driven Development

**Iron rule: no production code without a failing test first.** See [`docs/workflows/tdd-cycle.md`](docs/workflows/tdd-cycle.md).

**TDD scope for this project:**

| Layer | TDD required? |
|---|---|
| `scripts/build-data.ts` | Yes — every transform function |
| `shared/api/` (repositories) | Yes — every query method |
| `shared/lib/` (utilities, hooks) | Yes |
| `shared/ui/` primitives (Button, Badge, Card) | Yes — behavior, props, accessibility |
| `entities/*/ui/` (CharacterCard, FilmHero, etc.) | Yes — conditional rendering, interactive states |
| `features/*` (interactive units like search) | Yes |
| `widgets/*` (composite blocks) | If they have logic; pure layout = no |
| `screens/*` | If they orchestrate state; pure composition = no |
| `app/*` (Next routes) | Smoke test only (Playwright, post-MVP) |

When unsure: write the test. The test failing pre-implementation is the only proof the test actually tests something.

## Style

- TypeScript strict. No `any`. No `as` casts outside tests (use `@total-typescript/shoehorn` in tests).
- Biome enforces formatting and lint rules. Run `bun run format` if pre-commit complains.
- File naming:
  - Components: `PascalCase.tsx` for server, `PascalCase.client.tsx` for client
  - CSS Modules: `PascalCase.module.css` next to the component
  - Tests: `<file>.test.ts` / `<file>.test.tsx` next to the source
  - Utilities, hooks: `camelCase.ts`
- Imports: absolute via `@/` alias. Same-layer cross-slice imports forbidden. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
- CSS: tokens-only — no hex colors or pixel values in `.module.css`. All values reference CSS custom properties from `config/theme/`.

## Pre-merge checklist

Before requesting review:

- [ ] `bun run typecheck` passes
- [ ] `bun run lint` passes
- [ ] `bun run test` passes
- [ ] `bun run build` passes
- [ ] New components have CSS Modules (no inline styles)
- [ ] New tokens added to `config/theme/` (no hex / px in component CSS)
- [ ] No `console.*` calls in committed code
- [ ] New API endpoints documented in `docs/API.md`
- [ ] New domain terms added to `docs/CONTEXT.md`
- [ ] If a decision is hard to reverse and non-obvious, add an ADR under `docs/adr/`

## Visual / motion review

Before merging any UI work, audit against [`docs/TASTE.md`](docs/TASTE.md):

- No pure `#000000` or `#ffffff`. Use palette tokens.
- No generic `box-shadow: 0 1px 3px rgba(0,0,0,0.1)` — tinted shadows only.
- No three-equal-column grids without justification.
- No instant-snap transitions on interactive elements (200–300ms minimum).
- Reduced-motion respected on every GSAP module.
- Focus rings visible on every interactive element.
