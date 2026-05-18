# Git Flow

Branching model + PR workflow this repo. All changes land via PR — no direct push to `dev` or `main`.

## Long-lived branches

| Branch | Purpose | Tracked by | Direct pushes? |
|---|---|---|---|
| `main` | Production. Every commit on `main` deployable; pushes trigger deploy. | Vercel (planned) | ❌ Forbidden |
| `dev`  | Integration. Default base for feature work; staging snapshot of "next release". | CI only | ❌ Forbidden |

Both branches need branch protection on GitHub — see "Required GitHub settings" below.

## Short-lived branches

Branched from `dev`, merged back to `dev` via PR. Prefix = intent.

| Prefix | Use |
|---|---|
| `feature/<slug>` | New feature, user-facing or dev-facing |
| `fix/<slug>` | Bug fix |
| `refactor/<slug>` | Internal restructure, no behavior change |
| `docs/<slug>` | Docs only |
| `chore/<slug>` | Tooling, deps, config, repo hygiene |
| `test/<slug>` | Test-only changes |

Slugs kebab-case + short: `feature/character-detail-page`, not `feature/add-the-character-detail-page-with-all-the-stats`.

## Lifecycle of a change

```
                                              CI runs        CI runs
                                              on PR          on push     deploy
                                              ↓              ↓           ↓
feature/x ──┐                                                            
            ├─► PR to dev ──► merge to dev ──► PR to main ──► merge to main
            │                                                            
            └─ pushes here run CI on PR only, not on every push
```

1. Branch from up-to-date `dev`:
   ```sh
   git checkout dev && git pull
   git checkout -b feature/x
   ```
2. Commit using [Conventional Commits](https://www.conventionalcommits.org). Pre-commit hooks (Lefthook) enforce format + typecheck + tests on touched layers.
3. Push branch, open PR against `dev` via `gh pr create` or GitHub UI.
4. **PR to `dev`**: CI runs (typecheck, lint, test, build). PR can't merge until green.
5. Merge to `dev` (squash or merge commit — see below). Push to `dev` re-runs CI as post-merge sanity check.
6. When `dev` releasable, open PR `dev` → `main`.
7. **PR to `main`**: same CI gate.
8. Merge to `main`. Push to `main` runs CI **and** triggers deploy (Vercel; deploy workflow added later).

## Merge strategy

- **Feature/fix/chore branches → `dev`**: **squash merge**. One commit per logical change, Conventional Commits message, body summarizes work. Branch auto-deleted after merge.
- **`dev` → `main`**: **merge commit** (no squash). Preserves per-feature commit history from `dev`. Merge commit subject: `chore(release): roll up dev → main` or describe contents.

## Commit messages

Conventional Commits, enforced by commitlint via Lefthook:

```
<type>(<optional scope>): <subject>

<optional body>
```

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`, `perf`, `build`, `ci`.

Examples — all real commits from repo history:

```
chore: scaffold project
feat(data): bundled JSON snapshot for characters
feat(api): public REST API at /api/v1
```

Subject = sentence fragment, imperative mood, lowercase, no trailing period.

## CI gates

Every PR runs:

1. `bun run typecheck` — strict TypeScript, no errors
2. `bun run lint` — Biome
3. `bun run test` — Vitest
4. `bun run build` — Next production build succeeds

All four must pass before merge. Same workflow runs on `push` to `dev` and `main` as post-merge drift guard.

Workflow file: [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml).

## Required GitHub settings

Configure in GitHub UI (Repository → Settings → Branches) — can't live in code.

For **both** `dev` and `main`:

- [ ] **Require a pull request before merging**
- [ ] **Require status checks to pass before merging** — select `check` job from CI
- [ ] **Require branches to be up to date before merging**
- [ ] **Require linear history** (`main` only; keeps clean `main` log)
- [ ] **Do not allow bypassing the above settings** (solo work tempts admin bypass — leave off; discipline = the point)

Also:

- [ ] **Disallow force pushes** on both branches
- [ ] **Disallow deletions** on both branches

Optional:

- [ ] **Restrict who can push** — empty for solo; restrict to specific users for teams.

## Deploy

Deploy triggered by push to `main`. Deploy workflow file not yet in repo (e.g. `.github/workflows/deploy.yml`); added when Vercel wired up. Until then, push to `main` only runs CI.

## Why not just push to `main`?

Solo portfolio project. PR flow signals: "I work like teams work." Recruiter scanning commit history sees PR review trail, gates, conventional commits — stronger signal than code alone.

Small but real safety value too: pre-commit hooks catch boring stuff, but CI re-run on `dev` and `main` catches drift (untested merge, dep rot, env-specific failures). Paranoid for solo repo — but flow itself = signal.

## Emergency: hotfix to `main`

Critical bug in prod:

1. Branch `fix/<slug>` from `main` (not `dev`).
2. Open PR → `main`, merge after CI green.
3. Open follow-up PR `main` → `dev` to back-port (or cherry-pick).

Rare for portfolio site. Default to normal flow through `dev`.