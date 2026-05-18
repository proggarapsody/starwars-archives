import type { Paginated } from './pagination';

const CACHE_CONTROL = 'public, max-age=86400, s-maxage=86400, immutable';

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set('cache-control', CACHE_CONTROL);
  return Response.json(body, { ...init, headers });
}

export function singleResponse<T>(data: T): Response {
  return jsonResponse({ data });
}

export function collectionResponse<T>(payload: Paginated<T>): Response {
  return jsonResponse(payload);
}
