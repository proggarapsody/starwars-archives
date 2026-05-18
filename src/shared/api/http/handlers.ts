import type { Slug } from '@/shared/model';
import { errorResponse, notFound } from './errors';
import { paginate, parseLimit } from './pagination';
import { collectionResponse, singleResponse } from './response';

/**
 * Factories that wrap repositories into Next App Router route handlers.
 * Each factory returns a function with the shape expected by Next's
 * `export const GET = ...` in a route.ts file.
 */

export type DetailHandler = (
  request: Request,
  context: { params: Promise<{ slug: string }> },
) => Promise<Response>;

export type ListHandler = (request: Request) => Promise<Response>;

export function makeDetailHandler<T>(options: {
  findBySlug: (slug: Slug) => Promise<T | null>;
  entityName: string;
}): DetailHandler {
  return async (_request, context) => {
    try {
      const { slug } = await context.params;
      const entity = await options.findBySlug(slug);
      if (entity === null) {
        throw notFound(`no ${options.entityName} with slug '${slug}'`, { slug });
      }
      return singleResponse(entity);
    } catch (error) {
      return errorResponse(error);
    }
  };
}

export function makeListHandler<T>(options: {
  /**
   * Resolve the (already-filtered, already-sorted) items for this request.
   * The route is responsible for translating URLSearchParams into a
   * repository call; the handler only handles pagination + envelope.
   */
  findItems: (params: URLSearchParams) => Promise<T[]>;
}): ListHandler {
  return async (request) => {
    try {
      const url = new URL(request.url);
      const params = url.searchParams;
      const items = await options.findItems(params);
      const result = paginate(items, {
        cursor: params.get('cursor'),
        limit: parseLimit(params.get('limit')),
      });
      return collectionResponse(result);
    } catch (error) {
      return errorResponse(error);
    }
  };
}
