# Git Flow

Branching model and PR workflow for this repo. All changes land via pull request — no direct pushes to `dev` or `main`.

## Long-lived branches

| Branch | Purpose | Tracked by | Direct pushes? |
|---|---|---|---|
| `main` | Production. Every commit on `main` is deployable; pushes trigger deploy. | Vercel (planned) | ❌ Forbidden |
| `dev`  | Integration. Default base for feature work; staging snapshot of "next release". | CI only | ❌ Forbidden |

Both branches must be configured with branch protection on GitHub — see "Required GitHub settings" below.

## Short-lived branches

Branched from `dev`, merged back to `dev` via PR. Prefix indicates intent.

| Prefix | Use |
|---|---|
| `feature/<slug>` | New feature, user-facing or developer-facing |
| `fix/<slug>` | Bug fix |
| `refactor/<slug>` | Internal restructuring with no behavior change |
| `docs/<slug>` | Documentation only |
| `chore/<slug>` | Tooling, dependencies, config, repo hygiene |
| `test/<slug>` | Test-only changes |

Slugs are kebab-case and short: `feature/character-detail-page`, not `feature/add-the-character-detail-page-with-all-the-stats`.

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
2. Commit work using [Conventional Commits](https://www.conventionalcommits.org). Pre-commit hooks (Lefthook) enforce format + typecheck + tests on touched layers.
3. Push the branch, open a PR against `dev` via `gh pr create` or the GitHub UI.
4. **PR to `dev`**: CI runs (typecheck, lint, test, build). PR cannot merge until green.
5. Merge to `dev` (squash or merge commit — see below). Pushing to `dev` re-runs CI as a post-merge sanity check.
6. When `dev` is in a releasable state, open a PR `dev` → `main`.
7. **PR to `main`**: same CI gate.
8. Merge to `main`. Pushing to `main` runs CI **and** triggers deploy (Vercel; deploy workflow added later).

## Merge strategy

- **Feature/fix/chore branches → `dev`**: **squash merge**. One commit per logical change, message follows Conventional Commits, body summarizes the work. Branch is auto-deleted after merge.
- **`dev` → `main`**: **merge commit** (no squash). Preserves the per-feature commit history that arrived on `dev`. Merge commit subject: `chore(release): roll up dev → main` or describe the contents.

## Commit messages

Conventional Commits, enforced by commitlint via Lefthook:

```
<type>(<optional scope>): <subject>

<optional body>
```

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`, `perf`, `build`, `ci`.

Examples — all real commits from this repo's history:

```
chore: scaffold project
feat(data): bundled JSON snapshot for characters
feat(api): public REST API at /api/v1
```

The subject is a sentence fragment in the imperative mood, lowercase, no trailing period.

## CI gates

Every PR runs:

1. `bun run typecheck` — strict TypeScript, no errors
2. `bun run lint` — Biome
3. `bun run test` — Vitest
4. `bun run build` — Next production build succeeds

All four must pass before merge. The same workflow runs on `push` to `dev` and `main` as a post-merge guard against drift.

Workflow file: [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml).

## Required GitHub settings

Configure these in GitHub UI (Repository → Settings → Branches) — they can't live in code.

For **both** `dev` and `main`:

- [ ] **Require a pull request before merging**
- [ ] **Require status checks to pass before merging** — select the `check` job from CI
- [ ] **Require branches to be up to date before merging**
- [ ] **Require linear history** (for `main` only; preserves clean `main` log)
- [ ] **Do not allow bypassing the above settings** (for solo work it's tempting to allow admin bypass — leave it off; the discipline is the whole point)

Additionally:

- [ ] **Disallow force pushes** on both branches
- [ ] **Disallow deletions** on both branches

Optional:

- [ ] **Restrict who can push** — leave empty for solo work; restrict to specific users for teams.

## Deploy

Deploy will be triggered by pushes to `main`. The deploy workflow file is not yet present in the repo (e.g. `.github/workflows/deploy.yml`); it will be added when Vercel integration is wired up. Until then, pushing to `main` only runs CI.

## Why not just push to `main`?

This is a solo portfolio project. The PR flow is the project itself signaling: "I work like teams work." A recruiter scanning the commit history sees the PR review trail, the gates, the conventional commits — which is a stronger signal than the code alone.

There is also a small but real safety value: pre-commit hooks catch the boring stuff, but the CI re-run on `dev` and `main` catches drift (someone else's untested change merged, dependency rot, environment-specific failures). For a solo repo this is paranoid — but again, the flow itself is the signal.

## Emergency: hotfix to `main`

For a critical bug shipped to production:

1. Branch `fix/<slug>` from `main` (not `dev`).
2. Open PR → `main`, merge after CI green.
3. Open follow-up PR `main` → `dev` to back-port (or cherry-pick).

This is rare for a portfolio site. Default to the normal flow through `dev`.
