import { describe, expect, test } from 'vitest';
import { collectionResponse, singleResponse } from './response';

describe('singleResponse', () => {
  test('wraps data in the envelope', async () => {
    const response = singleResponse({ id: 'luke-skywalker', name: 'Luke Skywalker' });
    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('application/json');
    const body = await response.json();
    expect(body).toEqual({ data: { id: 'luke-skywalker', name: 'Luke Skywalker' } });
  });

  test('sets aggressive cache headers', () => {
    const response = singleResponse({ id: 'x' });
    expect(response.headers.get('cache-control')).toContain('public');
    expect(response.headers.get('cache-control')).toContain('max-age=86400');
    expect(response.headers.get('cache-control')).toContain('immutable');
  });
});

describe('collectionResponse', () => {
  test('wraps a paginated payload', async () => {
    const response = collectionResponse({
      data: [{ id: 'a' }],
      pagination: { next: null, prev: null, limit: 20, total: 1 },
    });
    const body = await response.json();
    expect(body.data).toEqual([{ id: 'a' }]);
    expect(body.pagination).toEqual({ next: null, prev: null, limit: 20, total: 1 });
  });

  test('sets aggressive cache headers', () => {
    const response = collectionResponse({
      data: [],
      pagination: { next: null, prev: null, limit: 20, total: 0 },
    });
    expect(response.headers.get('cache-control')).toContain('immutable');
  });
});
