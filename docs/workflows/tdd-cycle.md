# TDD Cycle

Project red-green-refactor loop. Mirrors `superpowers:test-driven-development` skill, with project-specific scope.

## The Iron Rule

**No production code without failing test first.**

Wrote code first by accident — delete it. Don't keep as reference. Don't adapt while writing test. Start from test, implement fresh.

## Scope — does *this* layer require TDD?

| Layer | TDD required? | Why |
|---|---|---|
| `scripts/build-data.ts` and `scripts/build-data/**` | **Yes** | Pure transforms — easiest TDD wins, highest payoff |
| `src/shared/api/**` (repositories, data source) | **Yes** | Contract whole site depends on |
| `src/shared/lib/**` (utilities, hooks, motion modules) | **Yes** | Logic. Always TDD. |
| `src/shared/ui/**` (Button, Card, Badge, …) | **Yes** | Test behavior + a11y attrs, not visual styling |
| `src/entities/**/ui/**` (CharacterCard, FilmHero, …) | **Yes** | Conditional rendering, props, interactive states |
| `src/features/**` (search-codex, theme-toggle, …) | **Yes** | All have behavior |
| `src/widgets/**` | **If has logic, otherwise no** | Pure composition needs no test |
| `src/screens/**` | **If orchestrates state, otherwise no** | Most screens pure RSC composition |
| `src/app/**` (Next routes) | **No** (smoke test only, post-MVP) | Routes thin wrappers. Playwright covers later. |

**Unsure: write test.** Cost of unnecessary test small; cost of untested code bug bigger.

## The loop

### 1. RED — write the failing test

One behavior per test. Clear name. Real code (mocks only if unavoidable).

```ts
// src/shared/api/CharacterRepository.test.ts
import { test, expect } from 'vitest';
import { CharacterRepository } from './CharacterRepository';
import { fakeDataSource } from '@/shared/api/testing';

test('findBySlug returns the matching character', async () => {
  const repo = new CharacterRepository(fakeDataSource({
    characters: [{ id: 'luke-skywalker', name: 'Luke Skywalker', /* ... */ }],
  }));

  const result = await repo.findBySlug('luke-skywalker');

  expect(result?.name).toBe('Luke Skywalker');
});
```

### 2. Verify RED — watch it fail

```sh
bun run test src/shared/api/CharacterRepository.test.ts
```

Confirm:
- Test **fails** (not errors).
- Failure msg matches expectation.
- Failure because feature missing — not typo.

Test passes immediately: testing existing behavior. Rewrite test.

Test errors (compile/import fail): fix error, re-run until fails correctly.

### 3. GREEN — minimal implementation

Simplest code that makes test pass. No extra features. No untested options.

```ts
// src/shared/api/CharacterRepository.ts
export class CharacterRepository {
  constructor(private dataSource: CodexDataSource) {}

  async findBySlug(slug: Slug): Promise<Character | null> {
    const all = await this.dataSource.getCharacters();
    return all.find((c) => c.id === slug) ?? null;
  }
}
```

### 4. Verify GREEN — watch it pass

```sh
bun run test src/shared/api/CharacterRepository.test.ts
```

Confirm:
- Test passes.
- Other tests still pass (`bun run test`).
- Output pristine — no errors, no warnings.

Test fails: fix code, not test.

### 5. REFACTOR — clean up while green

Only after green. Don't add behavior. Don't expand API.

- Remove duplication.
- Improve names.
- Extract helpers.
- Keep tests green throughout.

### 6. Repeat — next behavior

```ts
test('findBySlug returns null when no character matches', async () => { /* ... */ });
test('find filters by affiliation', async () => { /* ... */ });
test('find combines multiple filters with AND', async () => { /* ... */ });
```

## Component TDD (`src/shared/ui` and `src/entities/**/ui`)

```tsx
// src/shared/ui/button/Button.test.tsx
import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

test('renders the label', () => {
  render(<Button>Ignite</Button>);
  expect(screen.getByRole('button', { name: 'Ignite' })).toBeInTheDocument();
});

test('calls onClick when activated', async () => {
  const onClick = vi.fn();
  render(<Button onClick={onClick}>Ignite</Button>);

  await userEvent.click(screen.getByRole('button'));

  expect(onClick).toHaveBeenCalledTimes(1);
});

test('does not call onClick when disabled', async () => {
  const onClick = vi.fn();
  render(<Button disabled onClick={onClick}>Ignite</Button>);

  await userEvent.click(screen.getByRole('button'));

  expect(onClick).not.toHaveBeenCalled();
});
```

**Component test rules:**
- Assert on accessible roles + labels, not class names or test IDs.
- Use `user-event`, not raw event firing.
- No snapshot tests. Zero-info on failure.
- Test conditional rendering, prop branches, a11y attrs, interactive behavior.
- Don't test pure styling. CSS won't fail visibly to Vitest.

## What not to test

- Pure styling: card look. Visual review covers.
- Framework itself: Next routing, React rendering — assume works.
- Third-party libs: don't test GSAP. Test *your usage* via thin wrapper if behavior matters.
- Implementation details: don't assert internal state or specific calls when behavior assertion works.

## When TDD friction signals a design problem

| Friction | What it means |
|---|---|
| Test needs huge setup | Component/function does too much. Split. |
| Must mock 5 things | Too many deps. Use DI or extract smaller unit. |
| Can't name the test | Don't know what behavior you want. Pause, think. |
| Test asserts internal state | Testing implementation. Restate via observable behavior. |

Test is design tool first, verification tool second.

## Red flags — stop and restart with TDD

From upstream TDD skill. All mean: delete code, start over.

- Wrote code before test.
- Test passes immediately on first run.
- "I already manually tested it."
- "I'll add the test after."
- "Keep this as reference, write the test first" — no, delete it.
- "Tests-after achieves the same purpose."
- "TDD is dogmatic, being pragmatic means adapting."

Only sanctioned exception: throwaway exploration. Even then: discard exploration, restart with TDD.