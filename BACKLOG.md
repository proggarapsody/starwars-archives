# Backlog

Features deferred from v1. Promote to `feature/*` branch when ready.

---

## Galactic Discovery Map

**One feature, not whole project.** Pan/zoom viewport rendering Star Wars galaxy as navigable graph. Each node = minimalist planet/star card. Hover reveals small info panel; click flies camera to it and opens full Codex entry inline or routes to detail page.

### Why it earns its place
- **Spatial navigation** more distinctive entry point than search box + list.
- Pairs with data we have (planets + cross-links to characters, species, films) — map *is* index for that data.
- Visually striking on portfolio. Recruiters click + play; that's goal.

### Open design questions

1. **Positioning**
   - Real-ish Wookieepedia galaxy coords (regions: Deep Core → Outer Rim) for canonical accuracy.
   - Or aesthetic positions seeded from planet metadata (climate, era) using `d3-force`.
   - **Lean:** real coords for base layout, force simulation only for label collision avoidance.

2. **Rendering technology**
   - `d3-zoom` + canvas — simplest, fast for <500 nodes.
   - `pixi.js` or `react-pixi` — GPU-accelerated 2D, smooth at any zoom.
   - `react-three-fiber` (three.js) — if want true 3D parallax/depth.
   - **Lean:** start `d3-zoom` + canvas. Upgrade to Pixi only if perf demands. Skip 3D — gimmicky, harder to make accessible.

3. **What renders on map**
   - Just planets? Or also major locations, ships at last-known coords, character birthplaces?
   - **Lean:** planets only at base zoom. Zoom in on planet → reveals "what happened here" (characters from there, ships built there, films featuring it).

4. **Interaction model**
   - Pan/zoom standard.
   - Click planet → camera flies to it, side panel slides in with planet card + relations.
   - Filter/search overlay: "show me everything Sith-related" highlights matching planets, dims rest.

5. **Performance budget**
   - 60fps pan/zoom on 2020 MacBook Air.
   - First paint within 1.5s on map page.
   - Lazy-load: render labels only for planets in viewport.

6. **Accessibility fallback**
   - Tab-navigable planet list mirroring map.
   - Reduced-motion: disable camera flight animation, snap instantly.

7. **Mobile**
   - Pinch-zoom + drag. Single-tap selects, double-tap zooms.
   - Decision: mobile-first or desktop-only with "open on desktop" hint on small screens?

### Scope rules
- Single Next.js route (`/galaxy`).
- Reuses same `CodexDataSource` repository as rest of app.
- No new entities, no new data fetching — purely view layer over existing planet data.
- Ship after Tier-1 entities (characters, films, planets, etc.) fully built + polished.

### Out of scope even for map's own v1
- Time slider ("show galaxy in 4 BBY vs 34 ABY") — fun, but second project's worth of data work.
- Multiplayer / shared exploration.
- Procedural extra-canon star generation.

---

## Mentorship Tree

Vertical d3 tree showing Jedi/Sith Force lineages, built from akabab's `masters` and `apprentices` fields. Considered for v1 hero feature, rejected as too data-nerdy for "stylish to play with" brief. Keep in backlog if project later needs second data-driven feature.

---

## Compare Mode

Side-by-side stat diff for 2–3 starships, vehicles, or characters. Rejected for v1 as too generic + too data-nerdy. Backlog only.

---

## Other deferred ideas

- **Time slider** — change galaxy state by era (BBY/ABY).
- **i18n** — currently English-only.
- **RSS feed** — for "new entries" if dataset grows.
- **Light mode for Sith side / dark mode for Jedi side** — *inverse* of canonical pairing. Could be hidden toggle for visual variety. Not v1.
- **User collections** — ruled out in Q1 of planning grill (no auth, no DB).