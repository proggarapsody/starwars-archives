# Taste — Visual Identity, Typography, Motion

Read before designing or implementing any visible UI. This is the brief.

## Identity

**Star Wars Archives** is a read-only, premium-feel encyclopedia. The framing is *editorial archive*, not *interactive game*. Think Jedi temple library, not arcade UI.

Two faces of the same site, switched by the user:

- **Jedi** — warm parchment, deep navy ink, kyber blue accents, slight gold. Holocron scroll vibe.
- **Sith** — warm near-black, bone-white text, crimson ember accents, slight gold. Imperial datapad vibe.

The toggle between them — a lightsaber that ignites or extinguishes — is the site's signature interactive moment.

## Anti-defaults

Reject these defaults across the board:

- ❌ Pure `#000000` background — Sith uses warm near-black `#0b0908`.
- ❌ Pure `#ffffff` background — Jedi uses parchment `#efe7d6`.
- ❌ Inter as the only font. We use Fraunces (display) + Geist (body).
- ❌ Generic `box-shadow: 0 1px 3px rgba(0,0,0,0.1)`. Shadows are *tinted* — they carry the theme's accent hue at low opacity.
- ❌ Three equal-column card grids as the default content layout. Use 2-column zig-zag, asymmetric grids, or single-column editorial.
- ❌ Title Case Headlines. Sentence case only.
- ❌ Centered everything. Lean left-aligned with deliberate exceptions.
- ❌ Pill-shaped "New" / "Beta" badges. Use small caps text labels.
- ❌ "Elevate", "Seamless", "Unleash", "Next-Gen", "Discover the galaxy" — banned. Write plainly.
- ❌ AI gradient (purple→blue) for any decorative element.
- ❌ Lucide / Feather icons. Use Phosphor or a small custom set.

## Color tokens

All colors live as CSS custom properties under `config/theme/jedi.css` and `config/theme/sith.css`, applied via `[data-theme="jedi"]` and `[data-theme="sith"]` on `<html>`.

### Jedi (light side)

| Token | Hex | Use |
|---|---|---|
| `--bg-canvas` | `#efe7d6` | Page background — warm parchment |
| `--bg-surface` | `#f7f1e3` | Cards, headers — bone |
| `--bg-elevated` | `#fbf6ea` | Modals, popovers |
| `--text-primary` | `#0a1330` | Body text — deep navy ink |
| `--text-secondary` | `#3b465e` | Captions, metadata |
| `--text-muted` | `#76808f` | Disabled, fine print |
| `--accent` | `#3b78c9` | Kyber blue (desaturated, not neon) |
| `--accent-soft` | `rgba(59, 120, 201, 0.12)` | Hover backgrounds, glow base |
| `--gold` | `#c39a4b` | Tertiary highlights |
| `--border` | `rgba(10, 19, 48, 0.12)` | Subtle dividers |
| `--shadow-color` | `rgba(10, 19, 48, 0.18)` | Tinted navy shadow |

### Sith (dark side)

| Token | Hex | Use |
|---|---|---|
| `--bg-canvas` | `#0b0908` | Page background — warm near-black |
| `--bg-surface` | `#171110` | Cards, headers |
| `--bg-elevated` | `#221816` | Modals, popovers |
| `--text-primary` | `#ede8df` | Body text — bone white |
| `--text-secondary` | `#a59a8b` | Captions, metadata |
| `--text-muted` | `#766c61` | Disabled |
| `--accent` | `#a8262a` | Crimson ember (desaturated) |
| `--accent-soft` | `rgba(168, 38, 42, 0.16)` | Hover backgrounds, glow base |
| `--gold` | `#c39a4b` | Tertiary highlights — same as Jedi |
| `--border` | `rgba(237, 232, 223, 0.10)` | Subtle dividers |
| `--shadow-color` | `rgba(168, 38, 42, 0.20)` | Tinted crimson shadow |

### Side-tinted accents (Force-Tinted UI feature)

Independent of the global theme. Applied via `--side-tint` when hovering an entry tagged with a side.

| Side | `--side-tint` |
|---|---|
| `light` | `#3b78c9` (kyber blue) |
| `dark` | `#a8262a` (crimson) |
| `none` | `transparent` |

## Typography

- **Display**: [Fraunces](https://fonts.google.com/specimen/Fraunces) — variable, optical-size + weight + soft axes. For all headlines.
- **Body / UI**: [Geist Sans](https://vercel.com/font) — variable. For everything else.
- **Mono**: [Geist Mono](https://vercel.com/font) — only on the API docs page and inline code.

Loaded via `next/font/local` (Geist) and `next/font/google` (Fraunces). Subset to Latin. No FOIT, no FOUT — variable fonts so weight transitions are free.

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
- UI labels / emphasis: Geist 500
- Subtle labels (metadata): Geist 400 with tabular-nums

### Tracking

- Display: `letter-spacing: -0.03em`
- H1–H3: `letter-spacing: -0.02em`
- Body: `letter-spacing: 0`
- Small caps labels (rare): `letter-spacing: 0.08em`, `text-transform: uppercase`, weight 600

### Other rules

- `text-wrap: balance` on every heading.
- `text-wrap: pretty` on every paragraph.
- `font-variant-numeric: tabular-nums` on every numeric stat.
- Max paragraph width: 65ch. Wider reads as broken.
- Line height: 1.15 for display, 1.25 for headings, 1.6 for body.

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

Section padding leans **larger** than feels natural. Generous breathing room is the single biggest "premium" signal.

## Surfaces

- **Cards** are surfaces, not bordered boxes. Use `--bg-surface`, no border, no shadow by default. Add a subtle tinted shadow only when the card needs lift (overlay, modal).
- **Borders** only where they convey real structure. Default to spacing-based separation.
- **Border radius**: `--radius-1: 4px`, `--radius-2: 8px`, `--radius-3: 12px`. Vary by component — tighter on inner elements, softer on containers.
- **Backgrounds** are *never* flat for full-bleed sections. Add subtle grain or a low-opacity background image where appropriate (especially the Sith side, where pure black feels cheap).

## Motion

**Default to native CSS.** GSAP only for bespoke, choreographed moments.

### Native CSS (most of the site)

- Hover / state transitions: 200–300ms cubic-bezier(0.22, 1, 0.36, 1).
- Scroll-driven entry reveals: `animation-timeline: view()` with `animation-range: entry 0% cover 30%`.
- View Transitions for route changes: `view-transition-name` on hero images and card → detail page hand-offs.
- Press feedback: `transform: scale(0.98)` on `:active`.
- Focus rings: always visible, 2px solid `--accent` outline + 2px offset.

### GSAP modules (named, isolated, in `shared/lib/motion/`)

- `lightsaber-ignite.ts` — blade extension on theme toggle. ~300ms.
- `force-tint.ts` — cursor-following side-tinted glow on entry hover.
- (More as needed. Each module is self-contained, ~50–150 lines.)

### Reduced motion

Every motion module must respect `prefers-reduced-motion: reduce`:

- Native CSS: wrap durations in a media query that sets them to 0.01ms.
- GSAP: call `gsap.set` to snap to end state instead of animating.

### Easing

Default to: `cubic-bezier(0.22, 1, 0.36, 1)` (gentle out-curve). Avoid linear, avoid `ease`, avoid the browser default.

## Iconography

- **Primary set**: [Phosphor](https://phosphoricons.com) (variable weight, free, distinctive).
- **Custom**: lightsaber hilt for the theme toggle (SVG, hand-authored).
- Stroke weight: consistent across the set — default Phosphor 1.5px (Regular weight).
- Never mix icon sets. Never use Lucide / Feather.

## Imagery

- Character images: hot-linked from Wikia CDN via `next/image`. See [`DATA.md`](DATA.md).
- Hero / background imagery: TBD per feature. Default to high-quality, low-opacity, tinted to the theme.
- No stock photos. No "diverse team" imagery. This is fiction.
- Every image has meaningful `alt` text. No `alt=""` on content images.

## States that must exist for every interactive surface

| State | Required? |
|---|---|
| Default | yes |
| Hover | yes |
| Focus-visible | yes |
| Active / pressed | yes |
| Disabled | yes, with meaningful visual change |
| Loading (where applicable) | skeleton, not spinner |
| Empty (where applicable) | composed, not bare text |
| Error (where applicable) | inline, plain language |

## Anti-patterns to audit against before merging UI

This is a tighter version of the `redesign-existing-projects` skill's audit. Run mentally before requesting review:

- [ ] No pure black or pure white anywhere — palette tokens only.
- [ ] No untinted shadows.
- [ ] No three-equal-column grids without a specific reason.
- [ ] No `height: 100vh` — use `100dvh`.
- [ ] No instant transitions on interactive elements.
- [ ] No missing focus rings.
- [ ] No spinners — skeletons that match the final layout.
- [ ] No empty states that are just "Nothing here."
- [ ] No `alert()` for anything.
- [ ] No commented-out code.
- [ ] No hex codes or pixel values inside `.module.css` files.
- [ ] No title case headers — sentence case.
- [ ] No exclamation marks in success messages.
- [ ] No "Oops!" in error messages — be direct.
- [ ] No orphan words on the last line of a heading — `text-wrap: balance` everywhere.
- [ ] No mismatched alignment in side-by-side cards.

## Inspiration anchors

When in doubt, look at these for vibe:

- The Criterion Collection website (editorial, generous space)
- Apple's product detail pages (typography, optical alignment)
- Linear's documentation (calm density, gold/cream + ink palette in light mode)
- Vercel's blog (typography-first hero sections)

Explicitly *not* inspiration:

- starwars.com (corporate, busy)
- swapi.dev (default Bootstrap)
- Any Fandom wiki (ad-laden, dense, generic)
