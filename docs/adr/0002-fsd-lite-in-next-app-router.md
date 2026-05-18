# ADR-0002: FSD-lite layering inside Next.js App Router

- **Status:** Accepted
- **Date:** 2026-05-18

## Context

The codebase needs a folder layout that scales beyond a flat `components/` heap. Three options were on the table:

1. **Idiomatic Next** — `src/app`, `src/components`, `src/lib`. Vercel's default. Minimal hierarchy. Reads as "no architectural opinion."
2. **Bulletproof React** — flat-ish `app / features / components / lib / types`. Pragmatic, less ceremony than FSD, but doesn't broadcast "designed" on a portfolio.
3. **Feature-Sliced Design (FSD)** — strict layered architecture: `app / pages / widgets / features / entities / shared`. Used by the author's reference project (cryptoideas-webapp). Distinctive on a portfolio; opinionated; has a real linter (Steiger).

FSD was designed for SPAs (Vite, Webpack), and its `app/` layer (providers, init) directly collides with Next's `src/app/` (the routing directory). FSD's `pages/` also collides with Next's legacy Pages Router.

## Decision

Adopt **FSD-lite**: the FSD vocabulary and layering rules, with adaptations for Next App Router.

Specifically:

- Keep the layers `screens / widgets / features / entities / shared`.
- Rename FSD's `pages/` to `screens/` to avoid confusion with Next's legacy Pages Router.
- **Drop** FSD's `app/` layer as a folder. Next's `src/app/layout.tsx` natively does what FSD's app layer does (providers, fonts, global styles). One less folder.
- Hoist config to top-level `config/` (env, route map, theme tokens, site metadata). In strict FSD this lives at `shared/config/`; hoisting it makes the boundary cleaner since these are project-wide concerns, not shared utilities.
- **Skip Steiger** (the FSD linter). Conventions are documented in `AGENTS.md`, `CONTRIBUTING.md`, and `docs/agent-primer.md`. Human/AI code review enforces them.
- **Skip PSI** (Public Slice Index — strict FSD requires `index.ts` on every slice with cross-slice imports going only through it). Direct imports are allowed. Less ceremony, slightly less encapsulation.

## Consequences

### Positive

- **Consistent architectural voice across the author's projects.** The reference project (`cryptoideas-webapp`) uses FSD. Recruiters reading both repos see a coherent design instinct.
- **Layers force orderly thinking.** A new feature has a clear home — and a clear list of layers it's *not* allowed to be in.
- **SOLID falls out naturally** at the boundary between `entities` (domain) and `shared/api` (data access).
- **Imports go down only.** A bug in `entities/character` cannot reach back into `screens/`. Refactoring `widgets/` cannot accidentally depend on a screen-specific concept.
- **No FSD-app folder.** One less indirection. Next's root layout is the natural place for global providers.

### Negative

- **Discipline without enforcement.** Without Steiger, an upward import or a cross-slice import is a code review issue, not a build error. For a solo project, that means the author has to self-police.
- **Newcomers won't recognize "screens"** if they're coming from canonical FSD docs that say `pages`. The rename is documented in `ARCHITECTURE.md` but it's still a small friction.
- **FSD's full discipline (PSI, Steiger) is not in play.** A future port to canonical FSD would require adding both. Trade-off accepted.
- **Some Next idioms feel awkward in FSD.** A `page.tsx` that's a 3-line wrapper around `<XxxScreen />` is more boilerplate than just putting the page content in `page.tsx` directly. This is a feature, not a bug — it keeps `app/` purely about routing and `screens/` purely about composition.

## Alternatives considered

### Strict FSD (with Steiger + PSI)

Most rigorous. Probably the "correct" answer for a team codebase.

Rejected because: solo portfolio project. The friction of `index.ts` updates per file and the cost of fighting Steiger over Next App Router's natural shape both exceeded the benefit. Documented conventions cover 90% of the value.

### Idiomatic Next

Simplest. `src/components`, `src/lib`. Done.

Rejected because: invisible on a portfolio. The whole point of the project is to demonstrate architectural taste, not just shipped features.

### Bulletproof React

Middle ground. `src/features` as the primary unit, with shared `components` and `lib`.

Rejected because: the reference project uses FSD. Switching frameworks per project signals indecision. FSD-lite preserves the consistency without paying the full FSD tax.

## Reversal cost

**Low.** Folder structure is moveable. If the author later wants strict FSD, add Steiger and add `index.ts` exports — both mechanical changes. If the author wants idiomatic Next, flatten `screens/ + widgets/ + features/ + entities/` into `components/` — again mechanical, no logic changes.

The decision is sticky mostly because of habit and consistency with the reference project, not because the code is locked in.
