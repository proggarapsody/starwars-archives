# ADR-0003: CSS Modules + native nesting over Tailwind

- **Status:** Accepted
- **Date:** 2026-05-18

## Context

Project brief: "high-end visual design — premium, editorial, stylish to play with." Styling must support craft-led design where most screens visually distinct (entity hero pages, Jedi/Sith theme system, lightsaber toggle, eventual Galactic Map).

Three options:

1. **Tailwind v4** — utility classes. Fastest iteration. Used by reference project (`cryptoideas-webapp`). 2026 de facto default for Next.
2. **CSS-in-JS** (styled-components, Emotion, vanilla-extract) — runtime or build-time CSS gen. Type-safe. Heavier mental model.
3. **CSS Modules** with vanilla CSS + native nesting — class-scoped CSS, one file per component, no preprocessor.

## Decision

Use **vanilla CSS Modules with native CSS nesting**. PostCSS for autoprefixer + basic processing only — no SCSS, no Tailwind, no CSS-in-JS.

Design tokens live as CSS custom properties under `config/theme/{jedi,sith}.css`. Component CSS Modules reference custom properties only — no hex codes, no pixel values.

## Consequences

### Positive

- **Bespoke design = path of least resistance.** When most screens visually unique (hero pages, theme system, motion-heavy moments), utility-class libs become friction not acceleration.
- **Token discipline enforceable by review.** Grep `#[0-9a-f]` in `.module.css` catches every violation. With Tailwind, one-off values sneak in as arbitrary values (`bg-[#0a1330]`) looking like real Tailwind.
- **Native CSS nesting shipped in every modern browser since 2023.** No preprocessor. Faster builds, simpler tooling.
- **Smaller prod CSS bundle.** Component-scoped CSS actually used. Tailwind v4 purges well, but CSS Modules + light component lib smaller still.
- **CSS Modules SSR cleanly.** No runtime CSS-in-JS hydration mismatch concerns.
- **Theme switching = CSS-only concern.** Tokens swap on `[data-theme]`; no JS theme context provider, no re-renders.
- **Constraint forces real component library.** Without utilities, `shared/ui` must be tight: Button, Card, Badge, Skeleton, Hero, Rail. Feature, not bug.

### Negative

- **Slower per-screen iteration during initial styling.** Edit two files (component + module.css) instead of one. "Preview, tweak class, preview" loop slightly less tight.
- **Diverges from reference project house style** (`cryptoideas-webapp` uses Tailwind). Documented; not real cost for solo project, but flag it.
- **No utility-class quick fixes.** Adding `mt-4` requires opening module file. For small flex-tweak, mild friction.
- **Authoring discipline matters more.** Without Tailwind's spacing scale baked in, author must consciously use spacing tokens. Token-only rule (no raw px in modules) is corrective.

## Alternatives considered

### Tailwind v4

Fast, well-known, great DX for utility-heavy interfaces (dashboards, admin tools).

Rejected: this project design-heavy + editorial. Most screens unique. Tailwind's strength (rapid consistent surface treatment for many similar components) wrong fit. Also: portfolio piece — diverging from Tailwind shows author can work without it, itself a signal.

### CSS-in-JS (vanilla-extract)

Type-safe, build-time, zero runtime. Closest to CSS Modules with TS goodies.

Rejected: CSS Modules already does class-scoping, native nesting covers what Sass mixins used to, token-as-custom-property model simpler than vanilla-extract's `createTheme` + `createVar` ceremony. TS-side type safety on tokens real benefit, but typed `tokens.ts` mirror works fine without changing styling engine.

### Tailwind v4 with theme plugin

Middle path. Tailwind for layout/utility, custom plugin for Jedi/Sith theming.

Rejected: worst of both worlds. Write Tailwind for layout *and* CSS for theming, both must stay in sync.

## Reversal cost

**Moderate.** Migrate to Tailwind means:

- Add Tailwind, config, content paths.
- Rewrite every component's class composition.
- Replace every CSS Module's selectors with utility classes.
- Map every custom property to Tailwind theme value.

Couple weeks of mechanical work. Not catastrophic, not free.

Migrate to vanilla-extract or similar CSS-in-JS cheaper — same `.module.css` files map fairly directly to vanilla-extract's `style()` calls.

Decision sticky due to bespoke-design fit, not migration impossibility.