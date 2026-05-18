# ADR-0001: Bundle a JSON data snapshot in the repo

- **Status:** Accepted
- **Date:** 2026-05-18

## Context

The data the site presents — Star Wars characters, films, planets, etc. — could come from several places:

1. Live calls to `swapi.dev` or `swapi.info` on every request.
2. Live calls cached at the edge with `revalidate`.
3. A snapshot fetched once at `next build` time and embedded in the build.
4. A snapshot generated *before* the build, committed to the repo as JSON, and read at runtime from disk.

The original 2022 project used live SWAPI calls. SWAPI's official host (`swapi.co`) has since died; community forks have inconsistent uptime and schema quirks.

The data is genuinely static for our purposes — Star Wars canon does change, but not on a timescale that matters for a portfolio site. We will also be merging three upstream sources (akabab for characters, swapi.info for the rest, fgeorges for descriptions) into one normalized schema, which is non-trivial work that should happen exactly once per data update — not on every request.

## Decision

Generate a normalized data snapshot via `scripts/build-data.ts`, write it to `src/shared/data/*.json`, and **commit the JSON to the repo**. The site reads from disk via the repository layer. Re-run the snapshot manually when upstream sources update.

## Consequences

### Positive

- **Zero latency** at request time. RSCs can render the page before SWAPI would have finished its TLS handshake. Critical for the "premium feel" brief.
- **No third-party uptime risk.** The site keeps working in 2027 even if every SWAPI fork goes dark.
- **No rate limits.** We can hit upstream sources hard during build, never at runtime.
- **Cross-source merging is done once.** akabab + swapi.info + fgeorges combine into one normalized record. Cheap at build time, expensive on every request.
- **Cross-entity queries become trivial.** "Every character from Tatooine" is one filter pass, not five round-trips with broken pagination.
- **Schema is ours, not SWAPI's.** We fix SWAPI's stringly-typed sins (`"mass": "77"`, `"unknown"` sentinels, opaque URL refs) once in the snapshot, not in every component.
- **Deterministic builds.** Same input → same output. Useful for CI cache hits and reproducible deploys.
- **The repo is self-contained.** Cloning gives you everything needed to run the site.

### Negative

- **The repo carries ~1–5 MB of JSON.** Acceptable. The character image binaries are still hot-linked, not committed (see ADR-pending on image hosting).
- **Data updates are manual.** Re-running `bun run build:data` is a human responsibility. There's no automation that picks up upstream changes.
- **The snapshot can drift from upstream.** If SWAPI adds a new field, we don't get it until we re-run. Acceptable for a portfolio site; would be a real concern for a production data product.
- **Build script complexity.** We trade runtime fetch logic for build-time normalization logic. The normalization is more code, but it's pure transforms — easy to test (the build script is TDD'd).

## Alternatives considered

### Live fetch with revalidate

Next 15's `fetch(url, { next: { revalidate: 86400 } })` caches at the edge for 24 hours. Simpler conceptually.

Rejected because: doesn't solve the cross-source merge problem (we'd still merge per-request or per-revalidation), inherits SWAPI's schema warts in components, and breaks if a SWAPI fork goes dark mid-revalidation window.

### Snapshot at `next build` time (uncommitted)

Run the data builder as part of `next build`. Don't commit the JSON.

Rejected because: every CI build hits upstream sources, every deploy is non-deterministic, and offline development requires running the builder before `next dev`. The committed-snapshot approach has none of these downsides.

### Wikidata SPARQL

Gold-standard licensing (CC0) and structure, but adds a query layer and runtime dependency on Wikidata's endpoints. Reserved as a future enrichment source.

## Reversal cost

**Moderate.** Reversing this decision means rewriting the data layer to fetch from a remote source. The repository interface (`CodexDataSource`) is intentionally designed so the JSON-backed implementation could be swapped for a fetch-backed one with no UI changes. So the cost is bounded — a few days of work, no UI churn.

But: the schema we've defined assumes pre-merged data. A live fetch implementation would need to preserve the merge semantics, which means doing the merge on every request (slow) or putting it behind a cache (which is just a less-deterministic version of the snapshot we already have). The pull is toward keeping the snapshot.
