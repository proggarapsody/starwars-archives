# Star Wars Archives

A premium-feel, read-only Star Wars encyclopedia. Next.js 15, App Router, RSC, CSS Modules, GSAP. Jedi ↔ Sith theme system.

> Successor project to [starwars-wiki](https://github.com/proggarapsody/starwars-wiki) (Next 12, 2022).

## Status

In planning. See [`AGENTS.md`](AGENTS.md) for the project index, [`docs/`](docs/) for design and architecture.

## Stack

- **Framework:** Next.js 15 (App Router) + React 19
- **Language:** TypeScript (strict)
- **Runtime:** Bun
- **Linter / formatter:** Biome
- **Styling:** CSS Modules + native CSS nesting
- **Motion:** Native CSS + View Transitions API + GSAP for bespoke timelines
- **Tests:** Vitest + React Testing Library + happy-dom
- **Deploy:** Vercel

## Data sources

Bundled at build time from a snapshot. See [`docs/DATA.md`](docs/DATA.md).

- [akabab/starwars-api](https://github.com/akabab/starwars-api) — character data and images (MIT)
- [swapi.info](https://swapi.info) — films, planets, species, starships, vehicles (open)
- [fgeorges/star-wars-dataset](https://github.com/fgeorges/star-wars-dataset) — Wikipedia descriptions (MIT)

Images are hot-linked from the Wikia CDN. Lucasfilm owns all underlying imagery and Star Wars IP.

## Development

```sh
bun install
bun run dev
```

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for the full workflow.

## License

Code: MIT. Star Wars characters, names, imagery, and IP are property of Lucasfilm Ltd. / The Walt Disney Company. This is a fan project.
