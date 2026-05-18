# Taste — Visual Identity, Typography, Motion

Read before designing/implementing visible UI. Brief.

## Identity

**Star Wars Archives** = read-only, premium-feel encyclopedia. Framing: *editorial archive*, not *interactive game*. Jedi temple library, not arcade UI.

Two faces, user-switched:

- **Jedi** — warm parchment, deep navy ink, kyber blue accents, slight gold. Holocron scroll vibe.
- **Sith** — warm near-black, bone-white text, crimson ember accents, slight gold. Imperial datapad vibe.

Toggle = lightsaber ignite/extinguish — site's signature interactive moment.

## Anti-defaults

Reject:

- ❌ Pure `#000000` bg — Sith uses warm near-black `#0b0908`.
- ❌ Pure `#ffffff` bg — Jedi uses parchment `#efe7d6`.
- ❌ Inter as only font. Use Fraunces (display) + Geist (body).
- ❌ Generic `box-shadow: 0 1px 3px rgba(0,0,0,0.1)`. Shadows *tinted* — carry theme accent hue at low opacity.
- ❌ Three equal-column card grids as default. Use 2-col zig-zag, asymmetric grids, or single-col editorial.
- ❌ Title Case Headlines. Sentence case only.
- ❌ Centered everything. Left-aligned with deliberate exceptions.
- ❌ Pill "New"/"Beta" badges. Use small caps text labels.
- ❌ "Elevate", "Seamless", "Unleash", "Next-Gen", "Discover the galaxy" — banned. Plain prose.
- ❌ AI gradient (purple→blue) for decorative elements.
- ❌ Lucide/Feather icons. Use Phosphor or small custom set.

## Color tokens

Colors = CSS custom props in `config/theme/jedi.css` and `config/theme/sith.css`, applied via `[data-theme="jedi"]` / `[data-theme="sith"]` on `<html>`.

### Jedi (light side)

| Token | Hex | Use |
|---|---|---|
| `--bg-canvas` | `#efe7d6` | Page bg — warm parchment |
| `--bg-surface` | `#f7f1e3` | Cards, headers — bone |
| `--bg-elevated` | `#fbf6ea` | Modals, popovers |
| `--text-primary` | `#0a1330` | Body — deep navy ink |
| `--text-secondary` | `#3b465e` | Captions, metadata |
| `--text-muted` | `#76808f` | Disabled, fine print |
| `--accent` | `#3b78c9` | Kyber blue (desaturated, not neon) |
| `--accent-soft` | `rgba(59, 120, 201, 0.12)` | Hover bg, glow base |
| `--gold` | `#c39a4b` | Tertiary highlights |
| `--border` | `rgba(10, 19, 48, 0.12)` | Subtle dividers |
| `--shadow-color` | `rgba(10, 19, 48, 0.18)` | Tinted navy shadow |

### Sith (dark side)

| Token | Hex | Use |
|---|---|---|
| `--bg-canvas` | `#0b0908` | Page bg — warm near-black |
| `--bg-surface` | `#171110` | Cards, headers |
| `--bg-elevated` | `#221816` | Modals, popovers |
| `--text-primary` | `#ede8df` | Body — bone white |
| `--text-secondary` | `#a59a8b` | Captions, metadata |
| `--text-muted` | `#766c61` | Disabled |
| `--accent` | `#a8262a` | Crimson ember (desaturated) |
| `--accent-soft` | `rgba(168, 38, 42, 0.16)` | Hover bg, glow base |
| `--gold` | `#c39a4b` | Tertiary — same as Jedi |
| `--border` | `rgba(237, 232, 223, 0.10)` | Subtle dividers |
| `--shadow-color` | `rgba(168, 38, 42, 0.20)` | Tinted crimson shadow |

### Side-tinted accents (Force-Tinted UI)

Independent of global theme. Applied via `--side-tint` on hover of side-tagged entry.

| Side | `--side-tint` |
|---|---|
| `light` | `#3b78c9` (kyber blue) |
| `dark` | `#a8262a` (crimson) |
| `none` | `transparent` |

## Typography

- **Display**: [Fraunces](https://fonts.google.com/specimen/Fraunces) — variable, optical-size + weight + soft axes. All headlines.
- **Body/UI**: [Geist Sans](https://vercel.com/font) — variable. Everything else.
- **Mono**: [Geist Mono](https://vercel.com/font) — only API docs page + inline code.

Loaded via `next/font/local` (Geist) + `next/font/google` (Fraunces). Latin subset. No FOIT/FOUT — variable fonts so weight transitions free.

### Scale

```
--font-size-display:   clamp(3.5rem, 8vw, 7rem)     56–112px
--font-size-h1:        clamp(2.5rem, 5vw, 4rem)     40–64px
--font-size-h2:        clamp(2rem, 4vw, 3rem)       32–48px
--font-size-h3:        1.5rem                       24px
--font-size-body:      1rem                         16px
--font-size-small:     0.875rem                     14px
--font-size-fine:      0.75rem                      12px
```

### Weights

- Display: Fraunces 600, optical size: large, soft: 60
- H1–H3: Fraunces 500, optical size: medium, soft: 30
- Body: Geist 400
- UI labels/emphasis: Geist 500
- Subtle labels (metadata): Geist 400 + tabular-nums

### Tracking

- Display: `letter-spacing: -0.03em`
- H1–H3: `letter-spacing: -0.02em`
- Body: `letter-spacing: 0`
- Small caps labels (rare): `letter-spacing: 0.08em`, `text-transform: uppercase`, weight 600

### Other rules

- `text-wrap: balance` on every heading.
- `text-wrap: pretty` on every paragraph.
- `font-variant-numeric: tabular-nums` on every numeric stat.
- Max paragraph width: 65ch. Wider = broken.
- Line height: 1.15 display, 1.25 headings, 1.6 body.

## Spacing

8-pt scale tokens. Use these — no raw pixels in component CSS.

```
--space-0:  0
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
--space-32: 128px
--space-40: 160px
```

Section padding leans **larger** than feels natural. Generous breathing room = biggest "premium" signal.

## Surfaces

- **Cards** = surfaces, not bordered boxes. Use `--bg-surface`, no border, no shadow by default. Add subtle tinted shadow only when card needs lift (overlay, modal).
- **Borders** only where they convey real structure. Default to spacing-based separation.
- **Border radius**: `--radius-1: 4px`, `--radius-2: 8px`, `--radius-3: 12px`. Vary by component — tighter inner, softer containers.
- **Backgrounds** *never* flat for full-bleed sections. Add subtle grain or low-opacity bg image (especially Sith, where pure black feels cheap).

## Motion

**Default = native CSS.** GSAP only for bespoke choreographed moments.

### Native CSS (most of site)

- Hover/state transitions: 200–300ms cubic-bezier(0.22, 1, 0.36, 1).
- Scroll-driven entry reveals: `animation-timeline: view()` + `animation-range: entry 0% cover 30%`.
- View Transitions for route changes: `view-transition-name` on hero images + card→detail hand-offs.
- Press feedback: `transform: scale(0.98)` on `:active`.
- Focus rings: always visible, 2px solid `--accent` outline + 2px offset.

### GSAP modules (named, isolated, in `shared/lib/motion/`)

- `lightsaber-ignite.ts` — blade extension on theme toggle. ~300ms.
- `force-tint.ts` — cursor-following side-tinted glow on entry hover.
- (More as needed. Each self-contained, ~50–150 lines.)

### Reduced motion

Every motion module respects `prefers-reduced-motion: reduce`:

- Native CSS: wrap durations in media query setting to 0.01ms.
- GSAP: `gsap.set` to snap to end state instead of animating.

### Easing

Default: `cubic-bezier(0.22, 1, 0.36, 1)` (gentle out-curve). Avoid linear, `ease`, browser default.

## Iconography

- **Primary**: [Phosphor](https://phosphoricons.com) (variable weight, free, distinctive).
- **Custom**: lightsaber hilt for theme toggle (SVG, hand-authored).
- Stroke weight: consistent — default Phosphor 1.5px (Regular).
- Never mix icon sets. Never Lucide/Feather.

## Imagery

- Character images: hot-linked from Wikia CDN via `next/image`. See [`DATA.md`](DATA.md).
- Hero/bg imagery: TBD per feature. Default high-quality, low-opacity, tinted to theme.
- No stock photos. No "diverse team" imagery. Fiction.
- Every image has meaningful `alt`. No `alt=""` on content images.

## States required for every interactive surface

| State | Required? |
|---|---|
| Default | yes |
| Hover | yes |
| Focus-visible | yes |
| Active/pressed | yes |
| Disabled | yes, with meaningful visual change |
| Loading (where applicable) | skeleton, not spinner |
| Empty (where applicable) | composed, not bare text |
| Error (where applicable) | inline, plain language |

## Anti-patterns — audit before merging UI

Tighter version of `redesign-existing-projects` skill audit. Run mentally before review:

- [ ] No pure black/white anywhere — palette tokens only.
- [ ] No untinted shadows.
- [ ] No three-equal-column grids without specific reason.
- [ ] No `height: 100vh` — use `100dvh`.
- [ ] No instant transitions on interactive elements.
- [ ] No missing focus rings.
- [ ] No spinners — skeletons matching final layout.
- [ ] No empty states = "Nothing here."
- [ ] No `alert()` for anything.
- [ ] No commented-out code.
- [ ] No hex/pixel values inside `.module.css` files.
- [ ] No title case headers — sentence case.
- [ ] No exclamation marks in success messages.
- [ ] No "Oops!" in error messages — be direct.
- [ ] No orphan words on last line of heading — `text-wrap: balance` everywhere.
- [ ] No mismatched alignment in side-by-side cards.

## Inspiration anchors

When in doubt, vibe-check:

- Criterion Collection site (editorial, generous space)
- Apple product detail pages (typography, optical alignment)
- Linear docs (calm density, gold/cream + ink palette in light mode)
- Vercel blog (typography-first hero sections)

*Not* inspiration:

- starwars.com (corporate, busy)
- swapi.dev (default Bootstrap)
- Any Fandom wiki (ad-laden, dense, generic)