# Agent Primer

Required reading for any AI subagent before implementing a new scope. Read this in full, then read the docs it points to.

## The 90-second context

**Project:** Star Wars Archives. Modern rebuild of a 2022 Next 12 wiki. Read-only, premium-feel encyclopedia of Star Wars entities (characters, films, planets, species, starships, vehicles). Bundled JSON snapshot, public REST API, Jedi ↔ Sith theme system with a lightsaber toggle.

**Stack:** Next 15 App Router + React 19 + TypeScript strict + Bun + Biome + CSS Modules + GSAP for bespoke motion. No Tailwind. No framer-motion / Motion. No DB. No auth.

**Architecture:** FSD-lite — `app / screens / widgets / features / entities / shared` + top-level `config/`. Imports go down only. See [`ARCHITECTURE.md`](ARCHITECTURE.md).

**Discipline:** TDD by default. CSS tokens-only. No `any`. Conventional Commits. See [`../CONTRIBUTING.md`](../CONTRIBUTING.md).

## What to read before starting

In order:

1. [`../AGENTS.md`](../AGENTS.md) — top-level index, key rules.
2. [`ARCHITECTURE.md`](ARCHITECTURE.md) — layer map, folder layout, SOLID at the data layer.
3. [`TASTE.md`](TASTE.md) — visual identity, palette, typography, motion. Read this *before* writing any CSS.
4. [`DATA.md`](DATA.md) — only if your scope touches the data layer or the build script.
5. [`API.md`](API.md) — only if your scope touches the public REST surface.
6. Relevant ADRs under [`adr/`](adr/) — only if your scope is about to undo one of them.

## Before you write code

- **Confirm the scope is in v1.** Cross-check against [`../BACKLOG.md`](../BACKLOG.md). If the scope is in the backlog, stop and confirm with the human.
- **Find the existing slice your work belongs in.** Don't create a new entity, feature, or widget without checking that an existing one shouldn't absorb the work.
- **Write the failing test first.** No production code without a failing test. The TDD scope table in [`../CONTRIBUTING.md`](../CONTRIBUTING.md) tells you whether the layer requires TDD. When unsure, write the test.

## Common patterns

### Reading entity data

```ts
// In a Server Component
import { characters } from '@/shared/api';

const luke = await characters.findBySlug('luke-skywalker');
const jedis = await characters.find({ affiliation: 'jedi-order' });
```

Never:
- Import the JSON from `@/shared/data/*.json` directly in a component.
- Fetch from the public `/api/v1/...` endpoints from RSCs or other route handlers. Call the repository.

### Adding a new screen

1. Create `src/screens/<screen-name>/index.tsx` exporting a default `XxxScreen` component.
2. Add the Next route under `src/app/...` that imports and renders the screen.
3. The Next `page.tsx` is a 3-line wrapper. All composition lives in the screen.

### Adding a new entity type (rare in v1)

This is a big change. Update in this order:

1. [`CONTEXT.md`](CONTEXT.md) — register the term.
2. `scripts/build-data/` — add the loader, normalizer, merge.
3. `src/entities/<entity>/model/types.ts` — the type.
4. `src/entities/<entity>/api/Repository.ts` — the repository class.
5. `src/shared/api/index.ts` — wire the repository into the composition root.
6. `src/app/(codex)/<entities>/` — list and detail routes.
7. `src/app/api/v1/<entities>/` — public API routes.
8. [`API.md`](API.md) — document the new endpoints.
9. [`DATA.md`](DATA.md) — document the source for the new entity.

### Adding motion

- Native CSS first. Transitions for state, scroll-driven animations for entry reveals, View Transitions for route changes.
- Only reach for GSAP when native CSS genuinely can't do the work. Each GSAP usage gets a named module in `src/shared/lib/motion/`, isolated, with a `prefers-reduced-motion` branch.

### Theming

- Never write a hex color or pixel value in a `.module.css` file. Always reference a CSS custom property defined in `config/theme/`.
- New token? Add it to `config/theme/tokens.ts`, then echo it into both `jedi.css` and `sith.css`.
- Don't gate behavior on `data-theme` in JS. CSS handles theme switching. JS only flips the attribute.

### Tests

- Tests live next to the source: `Foo.tsx` + `Foo.test.tsx`.
- Use `@total-typescript/shoehorn` for partial test data instead of `as` casts.
- Use Testing Library's user-event for interactions. Never call event handlers directly.
- Assertions are about behavior, not implementation. Don't assert on class names or internal state.

## Anti-patterns that will get your work rejected

- Production code without a failing test first.
- Hex colors or pixel values in component CSS.
- `any`, `as` casts outside tests.
- Direct JSON imports in components.
- Hot-link to a new third-party CDN without adding it to `next.config.ts` `remotePatterns` and documenting in [`DATA.md`](DATA.md).
- Cross-slice imports within the same layer.
- `framer-motion`, `motion`, `react-spring`, or any other motion library — these are not in the stack.
- Tailwind utility classes appearing anywhere — see [ADR-0003](adr/0003-css-modules-over-tailwind.md).
- A new file containing more than one exported component (split it).
- A file longer than ~300 lines without a structural reason (split it).
- `console.log` / `console.warn` / `console.error` left in committed code.

## When you're done

Run the pre-merge checklist from [`../CONTRIBUTING.md`](../CONTRIBUTING.md). Don't claim work is done without `bun run typecheck && bun run lint && bun run test && bun run build` passing.
