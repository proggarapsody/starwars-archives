# ADR-0003: CSS Modules + native nesting over Tailwind

- **Status:** Accepted
- **Date:** 2026-05-18

## Context

The project's brief is "high-end visual design — premium, editorial, stylish to play with." The styling choice has to support a craft-led design process where most of the screens are visually distinct (entity hero pages, Jedi/Sith theme system, lightsaber toggle, eventual Galactic Map).

Three options:

1. **Tailwind v4** — utility classes. Fastest iteration speed. Used by the reference project (`cryptoideas-webapp`). 2026's de facto default for Next.
2. **CSS-in-JS** (styled-components, Emotion, vanilla-extract) — runtime or build-time CSS generation. Type-safe. Heavier mental model.
3. **CSS Modules** with vanilla CSS and native nesting — class-scoped CSS, one file per component, no preprocessor.

## Decision

Use **vanilla CSS Modules with native CSS nesting**. PostCSS for autoprefixer and basic processing only — no SCSS, no Tailwind, no CSS-in-JS.

Design tokens live as CSS custom properties under `config/theme/{jedi,sith}.css`. Component CSS Modules reference custom properties only — no hex codes, no pixel values.

## Consequences

### Positive

- **Bespoke design is the path of least resistance.** When most screens are visually unique (hero pages, theme system, motion-heavy moments), utility-class libraries become friction rather than acceleration.
- **Token discipline is enforceable by review.** A grep for `#[0-9a-f]` in `.module.css` catches every violation. With Tailwind, custom one-off values can sneak in as arbitrary values (`bg-[#0a1330]`) and they look just like real Tailwind.
- **Native CSS nesting is shipped in every modern browser since 2023.** No preprocessor needed. Faster builds, simpler tooling.
- **Smaller production CSS bundle.** Component-scoped CSS that's actually used. Tailwind v4 is good at purging, but CSS Modules + light component library is smaller still.
- **CSS Modules SSR cleanly.** No runtime CSS-in-JS hydration mismatch concerns.
- **Theme switching is a CSS-only concern.** Tokens swap on `[data-theme]`; no JS theme context provider, no re-renders.
- **The constraint forces a real component library.** Without utilities, `shared/ui` has to be tight: Button, Card, Badge, Skeleton, Hero, Rail. That's a feature.

### Negative

- **Slower per-screen iteration during initial styling.** Editing two files (component + module.css) instead of one. The "preview, tweak class, preview, tweak class" loop is slightly less tight.
- **Diverges from the reference project's house style** (`cryptoideas-webapp` uses Tailwind). Documented; not a real cost for a solo project, but worth flagging.
- **No utility-class quick fixes.** Adding `mt-4` requires opening the module file. For a small flex-tweak, this is mild friction.
- **Authoring discipline matters more.** Without Tailwind's spacing scale baked in, the author has to consciously use spacing tokens. The token-only rule (no raw px in modules) is the corrective.

## Alternatives considered

### Tailwind v4

Fast, well-known, great DX for utility-heavy interfaces (dashboards, admin tools).

Rejected because: this project is design-heavy and editorial. Most screens are unique. Tailwind's strength (rapid consistent surface treatment for many similar components) is the wrong fit. Also: portfolio piece — diverging from Tailwind shows the author can work without it, which is itself a signal.

### CSS-in-JS (vanilla-extract)

Type-safe, build-time, zero runtime. Closest to CSS Modules with TS goodies.

Rejected because: CSS Modules already does class-scoping, native nesting covers what Sass mixins used to, and the token-as-custom-property model is simpler than vanilla-extract's `createTheme` + `createVar` ceremony. The TS-side type safety on tokens is a real benefit, but a typed `tokens.ts` mirror works fine for that without changing the styling engine.

### Tailwind v4 with a theme plugin

A middle path. Tailwind for layout/utility, custom plugin for Jedi/Sith theming.

Rejected because: it's the worst of both worlds. You write Tailwind for layout *and* CSS for theming, with both having to stay in sync.

## Reversal cost

**Moderate.** Migrating to Tailwind would mean:

- Adding Tailwind, config, and content paths.
- Rewriting every component's class composition.
- Replacing every CSS Module's selectors with utility classes.
- Mapping every custom property to a Tailwind theme value.

That's a couple of weeks of mechanical work. Not catastrophic, but not free.

Migrating to vanilla-extract or similar CSS-in-JS would be cheaper — the same `.module.css` files map fairly directly to vanilla-extract's `style()` calls.

The decision is sticky because of the bespoke-design fit, not because the migration is impossible.
