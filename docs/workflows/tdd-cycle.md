# TDD Cycle

The project's red-green-refactor loop, applied. Mirrors the `superpowers:test-driven-development` skill, with project-specific scope decisions.

## The Iron Rule

**No production code without a failing test first.**

If you wrote code first by accident — delete it. Don't keep it as reference. Don't adapt it while writing the test. Start from the test, implement fresh.

## Scope — does *this* layer require TDD?

| Layer | TDD required? | Why |
|---|---|---|
| `scripts/build-data.ts` and `scripts/build-data/**` | **Yes** | Pure transforms — easiest possible TDD wins, highest payoff |
| `src/shared/api/**` (repositories, data source) | **Yes** | The contract the whole site depends on |
| `src/shared/lib/**` (utilities, hooks, motion modules) | **Yes** | Logic. Always TDD. |
| `src/shared/ui/**` (Button, Card, Badge, …) | **Yes** | Test behavior + a11y attributes, not visual styling |
| `src/entities/**/ui/**` (CharacterCard, FilmHero, …) | **Yes** | Conditional rendering, props, interactive states |
| `src/features/**` (search-codex, theme-toggle, …) | **Yes** | All have behavior |
| `src/widgets/**` | **If has logic, otherwise no** | Pure composition needs no test |
| `src/screens/**` | **If orchestrates state, otherwise no** | Most screens are pure RSC composition |
| `src/app/**` (Next routes) | **No** (smoke test only, post-MVP) | Routes are thin wrappers. Playwright covers them later. |

**When unsure: write the test.** The cost of an unnecessary test is small; the cost of code without a test that catches its bug is bigger.

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
- Failure message matches your expectation.
- Failure is because the feature is missing — not because of a typo.

If the test passes immediately: you're testing existing behavior. Rewrite the test.

If the test errors (compile / import failure): fix the error, re-run until it fails correctly.

### 3. GREEN — minimal implementation

The simplest code that makes the test pass. No extra features. No options that aren't tested.

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
- The test passes.
- All other tests still pass (`bun run test`).
- Output is pristine — no errors, no warnings.

If the test fails: fix the code, not the test.

### 5. REFACTOR — clean up while green

Only after green. Don't add behavior. Don't expand the API.

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
- Assert on accessible roles and labels, not on class names or test IDs.
- Use `user-event`, not raw event firing.
- Don't snapshot test. Snapshots are zero-information when they fail.
- Test conditional rendering, prop branches, accessibility attributes, interactive behavior.
- Don't test pure styling. CSS doesn't fail in a way Vitest can see.

## What not to test

- Pure styling: how a card looks. The visual review covers this.
- The framework itself: Next routing, React rendering — assume they work.
- Third-party libraries: don't write tests that essentially test GSAP. Test *your usage* of it via a thin wrapper if behavior matters.
- Implementation details: don't assert on internal state or specific function calls when a behavior assertion would do.

## When TDD friction signals a design problem

| Friction | What it means |
|---|---|
| Test needs a huge setup | Your component / function does too much. Split it. |
| Must mock 5 things | Too many dependencies. Use DI or extract a smaller unit. |
| Can't think of a name for the test | You don't yet know what behavior you want. Pause and think. |
| Test asserts on internal state | You're testing implementation. Restate the test in terms of observable behavior. |

The test is a design tool first, a verification tool second.

## Red flags — stop and restart with TDD

Borrowed from the upstream TDD skill. All of these mean: delete code, start over.

- Wrote code before the test.
- Test passes immediately on first run.
- "I already manually tested it."
- "I'll add the test after."
- "Keep this as reference, write the test first" — no, delete it.
- "Tests-after achieves the same purpose."
- "TDD is dogmatic, being pragmatic means adapting."

The only sanctioned exception is throwaway exploration. Even then: discard the exploration, restart with TDD.
