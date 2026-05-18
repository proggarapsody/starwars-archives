# ADR-0002: FSD-lite layering inside Next.js App Router

- **Status:** Accepted
- **Date:** 2026-05-18

## Context

Codebase need folder layout scaling beyond flat `components/` heap. Three options:

1. **Idiomatic Next** — `src/app`, `src/components`, `src/lib`. Vercel default. Minimal hierarchy. Read as "no architectural opinion."
2. **Bulletproof React** — flat-ish `app / features / components / lib / types`. Pragmatic, less ceremony than FSD, but no "designed" signal on portfolio.
3. **Feature-Sliced Design (FSD)** — strict layered: `app / pages / widgets / features / entities / shared`. Used by author reference project (cryptoideas-webapp). Distinctive on portfolio; opinionated; real linter (Steiger).

FSD designed for SPAs (Vite, Webpack). FSD `app/` layer (providers, init) collide with Next `src/app/` (routing dir). FSD `pages/` also collide with Next legacy Pages Router.

## Decision

Adopt **FSD-lite**: FSD vocabulary + layering rules, adapted for Next App Router.

Specifically:

- Keep layers `screens / widgets / features / entities / shared`.
- Rename FSD `pages/` → `screens/` to dodge Next legacy Pages Router confusion.
- **Drop** FSD `app/` layer as folder. Next `src/app/layout.tsx` natively do FSD app layer job (providers, fonts, global styles). One less folder.
- Hoist config to top-level `config/` (env, route map, theme tokens, site metadata). Strict FSD put this at `shared/config/`; hoisting clean boundary — project-wide concerns, not shared utilities.
- **Skip Steiger** (FSD linter). Conventions documented in `AGENTS.md`, `CONTRIBUTING.md`, `docs/agent-primer.md`. Human/AI code review enforce.
- **Skip PSI** (Public Slice Index — strict FSD require `index.ts` on every slice, cross-slice imports only via it). Direct imports allowed. Less ceremony, slightly less encapsulation.

## Consequences

### Positive

- **Consistent architectural voice across author projects.** Reference project (`cryptoideas-webapp`) use FSD. Recruiters reading both repos see coherent design instinct.
- **Layers force orderly thinking.** New feature has clear home — and clear list of layers it *not* allowed in.
- **SOLID fall out naturally** at boundary between `entities` (domain) and `shared/api` (data access).
- **Imports go down only.** Bug in `entities/character` cannot reach back into `screens/`. Refactor `widgets/` cannot accidentally depend on screen-specific concept.
- **No FSD-app folder.** One less indirection. Next root layout = natural place for global providers.

### Negative

- **Discipline without enforcement.** No Steiger → upward import or cross-slice import = review issue, not build error. Solo project → author self-police.
- **Newcomers won't recognize "screens"** if coming from canonical FSD docs saying `pages`. Rename documented in `ARCHITECTURE.md` but still small friction.
- **FSD full discipline (PSI, Steiger) not in play.** Future port to canonical FSD require adding both. Trade-off accepted.
- **Some Next idioms feel awkward in FSD.** `page.tsx` as 3-line wrapper around `<XxxScreen />` = more boilerplate than putting page content in `page.tsx` directly. Feature, not bug — keep `app/` purely routing, `screens/` purely composition.

## Alternatives considered

### Strict FSD (with Steiger + PSI)

Most rigorous. Probably "correct" answer for team codebase.

Rejected: solo portfolio project. Friction of `index.ts` updates per file + cost of fighting Steiger over Next App Router natural shape exceed benefit. Documented conventions cover 90% of value.

### Idiomatic Next

Simplest. `src/components`, `src/lib`. Done.

Rejected: invisible on portfolio. Whole point of project = demonstrate architectural taste, not just shipped features.

### Bulletproof React

Middle ground. `src/features` as primary unit, with shared `components` and `lib`.

Rejected: reference project use FSD. Switching frameworks per project signal indecision. FSD-lite preserve consistency without full FSD tax.

## Reversal cost

**Low.** Folder structure moveable. Author later want strict FSD → add Steiger + `index.ts` exports — both mechanical. Author want idiomatic Next → flatten `screens/ + widgets/ + features/ + entities/` into `components/` — again mechanical, no logic changes.

Decision sticky mostly from habit + consistency with reference project, not code lock-in.