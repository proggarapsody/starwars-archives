# Public REST API

Mount at `/api/v1`. Same data as on-site Codex, exposed as clean JSON API.

Designed against `backend-development:api-design-principles` skill: resource-oriented, plural nouns, HTTP-semantic, filter-style relations, cursor pagination, consistent error envelope, versioned.

## Endpoints

```
GET /api/v1/characters
GET /api/v1/characters/:slug
GET /api/v1/films
GET /api/v1/films/:slug
GET /api/v1/planets
GET /api/v1/planets/:slug
GET /api/v1/species
GET /api/v1/species/:slug
GET /api/v1/starships
GET /api/v1/starships/:slug
GET /api/v1/vehicles
GET /api/v1/vehicles/:slug

GET /api/v1/openapi.json          OpenAPI 3.1 schema
GET /api/v1/health                Liveness probe
```

All endpoints `GET`-only. Data read-only by design.

## Identity

`:slug` = canonical ID. Slugs kebab-case, derived from entity name (`luke-skywalker`, `millennium-falcon`, `a-new-hope`). Slug appears in response as `id`.

## Cross-entity relations — filter, don't nest

```
GET /api/v1/characters?homeworld=tatooine
GET /api/v1/characters?affiliation=jedi-order
GET /api/v1/characters?film=a-new-hope&species=human
GET /api/v1/starships?manufacturer=incom
GET /api/v1/planets?climate=desert&terrain=desert
```

Multiple filters AND together. No `OR` syntax in v1.

**No nested resource routes** (`/api/v1/planets/tatooine/residents`). Use filters.

## Pagination

Cursor-based. Datasets small (~80 characters, ~10 films), but set precedent.

```
GET /api/v1/characters?cursor=eyJvZmZzZXQiOjIwfQ==&limit=20
```

Response:

```json
{
  "data": [ /* records */ ],
  "pagination": {
    "next": "eyJvZmZzZXQiOjQwfQ==",
    "prev": null,
    "limit": 20,
    "total": 82
  }
}
```

`limit`: default 20, max 100. `total` included — dataset small enough it's free.

## Response shape

### Single resource

```json
{
  "data": { /* the entity */ }
}
```

### Collection

```json
{
  "data": [ /* entities */ ],
  "pagination": { /* see above */ }
}
```

### Error

Consistent envelope across every endpoint:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "No character with slug 'jar-jar-binks-the-sith-lord'",
    "details": { "slug": "jar-jar-binks-the-sith-lord" }
  }
}
```

`code` = stable string enum. `message` = human-readable. `details` optional, varies by code.

### Error codes

| Code | HTTP | When |
|---|---|---|
| `NOT_FOUND` | 404 | Unknown slug or route |
| `BAD_REQUEST` | 400 | Malformed query param |
| `INVALID_FILTER` | 422 | Filter value no match existing entity (e.g. `homeworld=mars`) |
| `RATE_LIMITED` | 429 | (Future) — not enforced v1 |
| `INTERNAL` | 500 | Server error |

## Cache headers

Data static. Cache aggressively.

```
Cache-Control: public, max-age=86400, s-maxage=86400, immutable
```

Vercel edge cache handle rest. No revalidation unless new snapshot deployed.

## Versioning

URL-based: `/api/v1/`. If ship breaking changes, mount `/api/v2/` alongside. No header-versioning, no `Accept` magic.

## OpenAPI

`/api/v1/openapi.json` generated at build time from entity schemas (single source of truth). `/api` landing page renders spec for humans + provides "Copy as curl" examples.

## Examples

```sh
# Get every Jedi character
curl 'https://starwars-archives.vercel.app/api/v1/characters?affiliation=jedi-order'

# Look up a specific film
curl 'https://starwars-archives.vercel.app/api/v1/films/the-empire-strikes-back'

# Filter starships by class
curl 'https://starwars-archives.vercel.app/api/v1/starships?class=corvette'
```

## What this API is not

- Not write-enabled. No POST, PUT, PATCH, DELETE in v1 (or ever — no DB).
- Not authenticated. No tokens, no rate limits v1.
- Not real-time. Subscriptions, websockets — out of scope.
- Not GraphQL. REST only.
- Not search engine. Site has own search; API has filter params but no fulltext search.