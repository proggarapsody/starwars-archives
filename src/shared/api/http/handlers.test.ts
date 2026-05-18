import { describe, expect, test } from 'vitest';
import { notFound } from './errors';
import { makeDetailHandler, makeListHandler } from './handlers';

type Doc = { id: string; name: string; group: 'a' | 'b' };

const fixtures: Doc[] = [
  { id: 'apple', name: 'Apple', group: 'a' },
  { id: 'banana', name: 'Banana', group: 'b' },
  { id: 'cherry', name: 'Cherry', group: 'a' },
  { id: 'date', name: 'Date', group: 'b' },
];

const fakeRepo = {
  findBySlug: async (slug: string) => fixtures.find((f) => f.id === slug) ?? null,
  findAll: async () => fixtures,
};

describe('makeDetailHandler', () => {
  test('returns the entity inside the envelope', async () => {
    const handler = makeDetailHandler({
      findBySlug: fakeRepo.findBySlug,
      entityName: 'fruit',
    });
    const response = await handler(new Request('https://x/api/v1/fruits/apple'), {
      params: Promise.resolve({ slug: 'apple' }),
    });
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data.id).toBe('apple');
  });

  test('returns a 404 envelope when no entity matches', async () => {
    const handler = makeDetailHandler({
      findBySlug: fakeRepo.findBySlug,
      entityName: 'fruit',
    });
    const response = await handler(new Request('https://x/api/v1/fruits/missing'), {
      params: Promise.resolve({ slug: 'missing' }),
    });
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error.code).toBe('NOT_FOUND');
    expect(body.error.message).toContain('fruit');
    expect(body.error.message).toContain('missing');
  });

  test('rethrows non-ApiError as INTERNAL', async () => {
    const handler = makeDetailHandler({
      findBySlug: async () => {
        throw new Error('boom');
      },
      entityName: 'fruit',
    });
    const response = await handler(new Request('https://x'), {
      params: Promise.resolve({ slug: 'whatever' }),
    });
    expect(response.status).toBe(500);
  });

  test('propagates ApiError thrown by the repository', async () => {
    const handler = makeDetailHandler({
      findBySlug: async () => {
        throw notFound('custom message');
      },
      entityName: 'fruit',
    });
    const response = await handler(new Request('https://x'), {
      params: Promise.resolve({ slug: 'whatever' }),
    });
    expect(response.status).toBe(404);
    const body = await response.json();
    expect(body.error.message).toBe('custom message');
  });
});

describe('makeListHandler', () => {
  test('returns a paginated envelope', async () => {
    const handler = makeListHandler({ findItems: () => fakeRepo.findAll() });
    const response = await handler(new Request('https://x/api/v1/fruits'));
    const body = await response.json();
    expect(body.data).toHaveLength(4);
    expect(body.pagination.total).toBe(4);
    expect(body.pagination.next).toBeNull();
  });

  test('honors a limit query parameter', async () => {
    const handler = makeListHandler({ findItems: () => fakeRepo.findAll() });
    const response = await handler(new Request('https://x/api/v1/fruits?limit=2'));
    const body = await response.json();
    expect(body.data).toHaveLength(2);
    expect(body.pagination.next).not.toBeNull();
  });

  test('delegates filter parsing to findItems', async () => {
    const handler = makeListHandler({
      findItems: async (params) => {
        const group = params.get('group');
        return group ? fixtures.filter((i) => i.group === group) : fixtures;
      },
    });
    const response = await handler(new Request('https://x/api/v1/fruits?group=a'));
    const body = await response.json();
    expect(body.data.map((d: Doc) => d.id)).toEqual(['apple', 'cherry']);
    expect(body.pagination.total).toBe(2);
  });
});
