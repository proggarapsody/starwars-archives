/**
 * Cursor-based pagination. Cursor is a base64-encoded JSON
 * `{ "offset": number }` blob — opaque to clients, but stable for the
 * read-only dataset.
 */

export type PaginationInfo = {
  next: string | null;
  prev: string | null;
  limit: number;
  total: number;
};

export type Paginated<T> = {
  data: T[];
  pagination: PaginationInfo;
};

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function encodeCursor(offset: number): string {
  return btoa(JSON.stringify({ offset }));
}

export function decodeCursor(cursor: string | null | undefined): number {
  if (cursor == null) return 0;
  try {
    const decoded = atob(cursor);
    const parsed = JSON.parse(decoded);
    if (typeof parsed !== 'object' || parsed === null) return 0;
    const offset = (parsed as { offset?: unknown }).offset;
    if (typeof offset !== 'number' || !Number.isFinite(offset) || offset < 0) return 0;
    return Math.floor(offset);
  } catch {
    return 0;
  }
}

export function parseLimit(raw: string | null | undefined): number {
  if (raw == null || raw.trim().length === 0) return DEFAULT_LIMIT;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) return DEFAULT_LIMIT;
  if (parsed < 1) return 1;
  if (parsed > MAX_LIMIT) return MAX_LIMIT;
  return parsed;
}

export function paginate<T>(
  items: T[],
  options: { cursor: string | null; limit: number },
): Paginated<T> {
  const offset = decodeCursor(options.cursor);
  const total = items.length;
  const limit = options.limit;
  const slice = items.slice(offset, offset + limit);

  const hasNext = offset + limit < total;
  const hasPrev = offset > 0;

  return {
    data: slice,
    pagination: {
      next: hasNext ? encodeCursor(offset + limit) : null,
      prev: hasPrev ? encodeCursor(Math.max(0, offset - limit)) : null,
      limit,
      total,
    },
  };
}
