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
| `bun run build` | Prod build |
| `bun run start` | Run prod build locally |
| `bun run typecheck` | `tsc --noEmit` |
| `bun run lint` | `biome check .` |
| `bun run format` | `biome format --write .` |
| `bun run test` | Vitest, watch off |
| `bun run test:watch` | Vitest, watch on |
| `bun run build:data` | Fetch + normalize data snapshot |

## Branches + commits

See [`docs/workflows/git-flow.md`](docs/workflows/git-flow.md) for full flow. Summary:

- **Long-lived:** `main` (release/deploy) + `dev` (integration). Never push direct.
- **Short-lived:** branch from `dev`. Prefixes: `feature/<slug>`, `fix/<slug>`, `refactor/<slug>`, `docs/<slug>`, `chore/<slug>`, `test/<slug>`.
- All changes via PR. PRs to `dev` must pass CI before merge. Periodically `dev` → `main` PR rolls release.
- Commit msgs: [Conventional Commits](https://www.conventionalcommits.org/), enforced by commitlint via Lefthook.
  - `feat:` new feature
  - `fix:` bug fix
  - `docs:` docs only
  - `chore:` tooling, deps, config
  - `refactor:` no behavior change
  - `test:` test-only changes
  - `style:` formatting (rare — Biome handles most)

## Test-Driven Development

**Iron rule: no prod code without failing test first.** See [`docs/workflows/tdd-cycle.md`](docs/workflows/tdd-cycle.md).

**TDD scope:**

| Layer | TDD required? |
|---|---|
| `scripts/build-data.ts` | Yes — every transform fn |
| `shared/api/` (repositories) | Yes — every query method |
| `shared/lib/` (utilities, hooks) | Yes |
| `shared/ui/` primitives (Button, Badge, Card) | Yes — behavior, props, a11y |
| `entities/*/ui/` (CharacterCard, FilmHero, etc.) | Yes — conditional rendering, interactive states |
| `features/*` (interactive units like search) | Yes |
| `widgets/*` (composite blocks) | If logic; pure layout = no |
| `screens/*` | If orchestrate state; pure composition = no |
| `app/*` (Next routes) | Smoke test only (Playwright, post-MVP) |

When unsure: write test. Test failing pre-impl = only proof test tests something.

## Style

- TypeScript strict. No `any`. No `as` casts outside tests (use `@total-typescript/shoehorn` in tests).
- Biome enforces format + lint. Run `bun run format` if pre-commit complains.
- File naming:
  - Components: `PascalCase.tsx` server, `PascalCase.client.tsx` client
  - CSS Modules: `PascalCase.module.css` next to component
  - Tests: `<file>.test.ts` / `<file>.test.tsx` next to source
  - Utilities, hooks: `camelCase.ts`
- Imports: absolute via `@/` alias. Same-layer cross-slice imports forbidden. See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
- CSS: tokens-only — no hex or px in `.module.css`. All values ref CSS custom props from `config/theme/`.

## Pre-merge checklist

Before review:

- [ ] `bun run typecheck` passes
- [ ] `bun run lint` passes
- [ ] `bun run test` passes
- [ ] `bun run build` passes
- [ ] New components have CSS Modules (no inline styles)
- [ ] New tokens in `config/theme/` (no hex/px in component CSS)
- [ ] No `console.*` in committed code
- [ ] New API endpoints documented in `docs/API.md`
- [ ] New domain terms added to `docs/CONTEXT.md`
- [ ] Hard-to-reverse + non-obvious decision → add ADR under `docs/adr/`

## Visual / motion review

Before merging UI work, audit against [`docs/TASTE.md`](docs/TASTE.md):

- No pure `#000000` or `#ffffff`. Use palette tokens.
- No generic `box-shadow: 0 1px 3px rgba(0,0,0,0.1)` — tinted shadows only.
- No three-equal-column grids without justification.
- No instant-snap transitions on interactive elements (200–300ms min).
- Reduced-motion respected on every GSAP module.
- Focus rings visible on every interactive element.