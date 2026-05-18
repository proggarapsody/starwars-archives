import { describe, expect, test } from 'vitest';
import { decodeCursor, encodeCursor, paginate, parseLimit } from './pagination';

describe('encodeCursor / decodeCursor', () => {
  test('round-trips offset values', () => {
    expect(decodeCursor(encodeCursor(0))).toBe(0);
    expect(decodeCursor(encodeCursor(40))).toBe(40);
    expect(decodeCursor(encodeCursor(1234))).toBe(1234);
  });

  test('returns 0 for null/undefined cursor', () => {
    expect(decodeCursor(null)).toBe(0);
    expect(decodeCursor(undefined)).toBe(0);
  });

  test('returns 0 for malformed cursors', () => {
    expect(decodeCursor('not-base64')).toBe(0);
    expect(decodeCursor(btoa('not-json'))).toBe(0);
    expect(decodeCursor(btoa(JSON.stringify({ wrong: 'shape' })))).toBe(0);
  });

  test('returns 0 for negative or non-finite offsets', () => {
    expect(decodeCursor(btoa(JSON.stringify({ offset: -1 })))).toBe(0);
    expect(decodeCursor(btoa(JSON.stringify({ offset: Number.NaN })))).toBe(0);
  });
});

describe('parseLimit', () => {
  test('returns default when limit is absent', () => {
    expect(parseLimit(null)).toBe(20);
  });

  test('parses valid integer strings', () => {
    expect(parseLimit('5')).toBe(5);
    expect(parseLimit('100')).toBe(100);
  });

  test('clamps to [1, 100]', () => {
    expect(parseLimit('0')).toBe(1);
    expect(parseLimit('-5')).toBe(1);
    expect(parseLimit('500')).toBe(100);
  });

  test('falls back to default for unparseable input', () => {
    expect(parseLimit('abc')).toBe(20);
    expect(parseLimit('')).toBe(20);
  });
});

describe('paginate', () => {
  const items = Array.from({ length: 25 }, (_, i) => ({ id: `i${i}` }));

  test('returns the first page when no cursor is supplied', () => {
    const result = paginate(items, { cursor: null, limit: 10 });
    expect(result.data).toHaveLength(10);
    expect(result.data[0]?.id).toBe('i0');
    expect(result.pagination.total).toBe(25);
    expect(result.pagination.limit).toBe(10);
    expect(result.pagination.prev).toBeNull();
    expect(result.pagination.next).not.toBeNull();
  });

  test('advances by the encoded cursor', () => {
    const first = paginate(items, { cursor: null, limit: 10 });
    const second = paginate(items, { cursor: first.pagination.next, limit: 10 });
    expect(second.data[0]?.id).toBe('i10');
    expect(second.pagination.prev).not.toBeNull();
  });

  test('returns next: null on the final page', () => {
    const last = paginate(items, { cursor: encodeCursor(20), limit: 10 });
    expect(last.data).toHaveLength(5);
    expect(last.pagination.next).toBeNull();
  });

  test('clamps an out-of-range cursor to an empty trailing page', () => {
    const result = paginate(items, { cursor: encodeCursor(999), limit: 10 });
    expect(result.data).toEqual([]);
    expect(result.pagination.next).toBeNull();
  });
});
