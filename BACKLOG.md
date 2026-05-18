# Backlog

Features explicitly deferred from v1. Promote to a `feature/*` branch when ready.

---

## Galactic Discovery Map

**One feature, not the whole project.** A pan/zoom viewport that renders the Star Wars galaxy as a navigable graph. Each node is a minimalist planet/star card. Hovering reveals a small info panel; clicking flies the camera to it and opens the full Codex entry inline or routes to the detail page.

### Why it earns its place
- **Spatial navigation** is a more distinctive entry point than a search box and a list.
- Pairs naturally with the data we already have (planets + cross-links to characters, species, films) — the map *is* the index for that data.
- Visually striking on a portfolio. Recruiters click it and play with it; that's the goal.

### Open design questions

1. **Positioning**
   - Real-ish Wookieepedia galaxy coordinates (regions: Deep Core → Outer Rim) for canonical accuracy.
   - Or aesthetic positions seeded from planet metadata (climate, era) using `d3-force`.
   - **Lean:** real coords for the base layout, force simulation only for collision avoidance of labels.

2. **Rendering technology**
   - `d3-zoom` + canvas — simplest, fast enough for <500 nodes.
   - `pixi.js` or `react-pixi` — GPU-accelerated 2D, smooth at any zoom.
   - `react-three-fiber` (three.js) — if we want true 3D parallax / depth.
   - **Lean:** start with `d3-zoom` + canvas. Upgrade to Pixi only if performance demands. Skip 3D — gimmicky and harder to make accessible.

3. **What renders on the map**
   - Just planets? Or also major locations, ships at their last-known coords, character birthplaces?
   - **Lean:** planets only at base zoom. Zoom in on a planet → reveals "what happened here" (characters from there, ships built there, films featuring it).

4. **Interaction model**
   - Pan/zoom standard.
   - Click a planet → camera flies to it, side panel slides in with the planet card and its relations.
   - Filter/search overlay: "show me everything Sith-related" highlights matching planets and dims the rest.

5. **Performance budget**
   - 60fps pan/zoom on a 2020 MacBook Air.
   - First paint within 1.5s on the map page.
   - Lazy-load: render labels only for planets in viewport.

6. **Accessibility fallback**
   - Tab-navigable list of planets that mirrors the map.
   - Reduced-motion: disable camera flight animation, snap instantly.

7. **Mobile**
   - Pinch-zoom + drag. Single-tap selects, double-tap zooms.
   - Decision needed: mobile-first or desktop-only with an "open on desktop" hint on small screens?

### Scope rules
- Single Next.js route (`/galaxy`).
- Reuses the same `CodexDataSource` repository the rest of the app uses.
- No new entities, no new data fetching — purely a view layer over existing planet data.
- Ship after Tier-1 entities (characters, films, planets, etc.) are fully built and polished.

### Out of scope even for the map's own v1
- Time slider ("show galaxy in 4 BBY vs 34 ABY") — fun, but a second project's worth of data work.
- Multiplayer / shared exploration.
- Procedural extra-canon star generation.

---

## Mentorship Tree

A vertical d3 tree showing Jedi/Sith Force lineages, built from akabab's `masters` and `apprentices` fields. Considered for the v1 hero feature, then rejected as too data-nerdy for the "stylish to play with" brief. Keep in backlog in case the project later needs a second data-driven feature.

---

## Compare Mode

Side-by-side stat diff for 2–3 starships, vehicles, or characters. Rejected for v1 as too generic and too data-nerdy. Backlog only.

---

## Other deferred ideas

- **Time slider** — change galaxy state by era (BBY/ABY).
- **i18n** — currently English-only.
- **RSS feed** — for "new entries" if we ever grow the dataset.
- **Light mode for Sith side / dark mode for Jedi side** — the *inverse* of the canonical pairing. Could be a hidden toggle for visual variety. Not v1.
- **User collections** — explicitly ruled out in Q1 of the planning grill (no auth, no DB).
