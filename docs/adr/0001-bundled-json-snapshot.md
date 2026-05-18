# ADR-0001: Bundle a JSON data snapshot in the repo

- **Status:** Accepted
- **Date:** 2026-05-18

## Context

Data site shows — Star Wars chars, films, planets — could come from:

1. Live calls to `swapi.dev` or `swapi.info` every req.
2. Live calls cached at edge w/ `revalidate`.
3. Snapshot fetched once at `next build` time, embedded in build.
4. Snapshot generated *before* build, committed to repo as JSON, read at runtime from disk.

Original 2022 project used live SWAPI. Official host (`swapi.co`) dead; community forks have flaky uptime + schema quirks.

Data static for our purposes — canon changes, but not on timescale mattering for portfolio. Also merging three upstream sources (akabab for chars, swapi.info for rest, fgeorges for descriptions) into one normalized schema — non-trivial, should happen once per data update, not per req.

## Decision

Generate normalized snapshot via `scripts/build-data.ts`, write to `src/shared/data/*.json`, **commit JSON to repo**. Site reads from disk via repo layer. Re-run snapshot manually when upstream updates.

## Consequences

### Positive

- **Zero latency** at req time. RSCs render before SWAPI TLS handshake done. Critical for "premium feel" brief.
- **No 3rd-party uptime risk.** Site works in 2027 even if every SWAPI fork dies.
- **No rate limits.** Hammer upstream at build, never runtime.
- **Cross-source merge done once.** akabab + swapi.info + fgeorges -> one normalized record. Cheap at build, expensive per req.
- **Cross-entity queries trivial.** "Every char from Tatooine" = one filter pass, not five round-trips w/ broken pagination.
- **Schema ours, not SWAPI's.** Fix SWAPI stringly-typed sins (`"mass": "77"`, `"unknown"` sentinels, opaque URL refs) once in snapshot, not in every component.
- **Deterministic builds.** Same input -> same output. Good for CI cache hits + reproducible deploys.
- **Repo self-contained.** Clone -> everything to run site.

### Negative

- **Repo carries ~1–5 MB JSON.** OK. Char image binaries still hot-linked, not committed (see ADR-pending on image hosting).
- **Data updates manual.** Re-run `bun run build:data` = human job. No automation catches upstream changes.
- **Snapshot drifts from upstream.** SWAPI adds field -> we miss til re-run. OK for portfolio; real concern for prod data product.
- **Build script complexity.** Trade runtime fetch logic for build-time normalization. More code, but pure transforms — easy to test (build script TDD'd).

## Alternatives considered

### Live fetch with revalidate

Next 15 `fetch(url, { next: { revalidate: 86400 } })` caches at edge 24h. Simpler.

Rejected: doesn't solve cross-source merge (still merge per-req or per-revalidate), inherits SWAPI schema warts in components, breaks if fork dies mid-revalidate.

### Snapshot at `next build` time (uncommitted)

Run data builder as part of `next build`. Don't commit JSON.

Rejected: every CI build hits upstream, every deploy non-deterministic, offline dev needs builder run before `next dev`. Committed-snapshot has none of these.

### Wikidata SPARQL

Gold licensing (CC0) + structure, but adds query layer + runtime dep on Wikidata endpoints. Reserved as future enrichment source.

## Reversal cost

**Moderate.** Reverse = rewrite data layer to fetch remote. Repo interface (`CodexDataSource`) intentionally designed so JSON-backed impl swappable for fetch-backed w/ no UI changes. Cost bounded — few days work, no UI churn.

But: schema assumes pre-merged data. Live fetch impl must preserve merge semantics -> merge per req (slow) or behind cache (less-deterministic version of snapshot already have). Pull stays toward snapshot.