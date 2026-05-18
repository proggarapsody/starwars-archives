# Agent Primer

Required read for any AI subagent before new scope. Read full, then read docs it points to.

## The 90-second context

**Project:** Star Wars Archives. Modern rebuild of 2022 Next 12 wiki. Read-only, premium-feel encyclopedia of Star Wars entities (characters, films, planets, species, starships, vehicles). Bundled JSON snapshot, public REST API, Jedi ↔ Sith theme system w/ lightsaber toggle.

**Stack:** Next 15 App Router + React 19 + TypeScript strict + Bun + Biome + CSS Modules + GSAP for bespoke motion. No Tailwind. No framer-motion / Motion. No DB. No auth.

**Architecture:** FSD-lite — `app / screens / widgets / features / entities / shared` + top-level `config/`. Imports go down only. See [`ARCHITECTURE.md`](ARCHITECTURE.md).

**Discipline:** TDD default. CSS tokens-only. No `any`. Conventional Commits. See [`../CONTRIBUTING.md`](../CONTRIBUTING.md).

## What to read before starting

Order:

1. [`../AGENTS.md`](../AGENTS.md) — top-level index, key rules.
2. [`ARCHITECTURE.md`](ARCHITECTURE.md) — layer map, folder layout, SOLID at data layer.
3. [`TASTE.md`](TASTE.md) — visual identity, palette, typography, motion. Read *before* writing CSS.
4. [`DATA.md`](DATA.md) — only if scope touches data layer or build script.
5. [`API.md`](API.md) — only if scope touches public REST surface.
6. Relevant ADRs under [`adr/`](adr/) — only if scope about to undo one.

## Before you write code

- **Confirm scope in v1.** Cross-check [`../BACKLOG.md`](../BACKLOG.md). If in backlog, stop + confirm w/ human.
- **Find existing slice your work belongs in.** No new entity/feature/widget without checking existing one shouldn't absorb work.
- **Write failing test first.** No prod code without failing test. TDD scope table in [`../CONTRIBUTING.md`](../CONTRIBUTING.md) says if layer requires TDD. Unsure → write test.

## Common patterns

### Reading entity data

```ts
// In a Server Component
import { characters } from '@/shared/api';

const luke = await characters.findBySlug('luke-skywalker');
const jedis = await characters.find({ affiliation: 'jedi-order' });
```

Never:
- Import JSON from `@/shared/data/*.json` directly in component.
- Fetch from public `/api/v1/...` endpoints from RSCs or route handlers. Call repository.

### Adding a new screen

1. Create `src/screens/<screen-name>/index.tsx` exporting default `XxxScreen` component.
2. Add Next route under `src/app/...` that imports + renders screen.
3. Next `page.tsx` is 3-line wrapper. All composition lives in screen.

### Adding a new entity type (rare in v1)

Big change. Update in order:

1. [`CONTEXT.md`](CONTEXT.md) — register term.
2. `scripts/build-data/` — add loader, normalizer, merge.
3. `src/entities/<entity>/model/types.ts` — type.
4. `src/entities/<entity>/api/Repository.ts` — repository class.
5. `src/shared/api/index.ts` — wire repository into composition root.
6. `src/app/(codex)/<entities>/` — list + detail routes.
7. `src/app/api/v1/<entities>/` — public API routes.
8. [`API.md`](API.md) — document new endpoints.
9. [`DATA.md`](DATA.md) — document source for new entity.

### Adding motion

- Native CSS first. Transitions for state, scroll-driven animations for entry reveals, View Transitions for route changes.
- Reach for GSAP only when native CSS can't do work. Each GSAP usage gets named module in `src/shared/lib/motion/`, isolated, w/ `prefers-reduced-motion` branch.

### Theming

- Never write hex or px in `.module.css`. Always reference CSS custom property from `config/theme/`.
- New token? Add to `config/theme/tokens.ts`, echo into both `jedi.css` + `sith.css`.
- Don't gate behavior on `data-theme` in JS. CSS handles theme switch. JS only flips attribute.

### Tests

- Tests next to source: `Foo.tsx` + `Foo.test.tsx`.
- Use `@total-typescript/shoehorn` for partial test data instead of `as` casts.
- Use Testing Library user-event for interactions. Never call event handlers directly.
- Assert behavior, not implementation. No assert on class names or internal state.

## Anti-patterns that will get your work rejected

- Prod code without failing test first.
- Hex or px in component CSS.
- `any`, `as` casts outside tests.
- Direct JSON imports in components.
- Hot-link new third-party CDN without adding to `next.config.ts` `remotePatterns` + documenting in [`DATA.md`](DATA.md).
- Cross-slice imports within same layer.
- `framer-motion`, `motion`, `react-spring`, or other motion lib — not in stack.
- Tailwind utility classes anywhere — see [ADR-0003](adr/0003-css-modules-over-tailwind.md).
- New file w/ more than one exported component (split).
- File longer than ~300 lines without structural reason (split).
- `console.log` / `console.warn` / `console.error` left in committed code.

## When you're done

Run pre-merge checklist from [`../CONTRIBUTING.md`](../CONTRIBUTING.md). Don't claim done without `bun run typecheck && bun run lint && bun run test && bun run build` passing.