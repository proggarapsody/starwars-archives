import { describe, expect, test } from 'vitest';
import { ApiError, errorResponse } from './errors';

describe('ApiError', () => {
  test('exposes a stable code and message', () => {
    const error = new ApiError('NOT_FOUND', 404, "no character with slug 'nope'");
    expect(error.code).toBe('NOT_FOUND');
    expect(error.status).toBe(404);
    expect(error.message).toBe("no character with slug 'nope'");
  });

  test('optionally carries structured details', () => {
    const error = new ApiError('INVALID_FILTER', 422, 'bad filter', { field: 'side' });
    expect(error.details).toEqual({ field: 'side' });
  });
});

describe('errorResponse', () => {
  test('serializes an ApiError to the documented envelope shape', async () => {
    const response = errorResponse(new ApiError('NOT_FOUND', 404, 'gone'));
    expect(response.status).toBe(404);
    expect(response.headers.get('content-type')).toContain('application/json');
    const body = await response.json();
    expect(body).toEqual({ error: { code: 'NOT_FOUND', message: 'gone' } });
  });

  test('includes details when present', async () => {
    const response = errorResponse(new ApiError('INVALID_FILTER', 422, 'bad', { field: 'side' }));
    const body = await response.json();
    expect(body).toEqual({
      error: { code: 'INVALID_FILTER', message: 'bad', details: { field: 'side' } },
    });
  });

  test('wraps unknown errors as INTERNAL 500', async () => {
    const response = errorResponse(new Error('boom'));
    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error.code).toBe('INTERNAL');
  });
});
