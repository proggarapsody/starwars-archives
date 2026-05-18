/**
 * Public API error envelope. Mirrors the shape documented in docs/API.md.
 *
 *   { "error": { "code": "NOT_FOUND", "message": "...", "details"?: {...} } }
 */

export type ErrorCode =
  | 'NOT_FOUND'
  | 'BAD_REQUEST'
  | 'INVALID_FILTER'
  | 'RATE_LIMITED'
  | 'INTERNAL';

export class ApiError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly status: number,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function notFound(message: string, details?: Record<string, unknown>): ApiError {
  return new ApiError('NOT_FOUND', 404, message, details);
}

export function badRequest(message: string, details?: Record<string, unknown>): ApiError {
  return new ApiError('BAD_REQUEST', 400, message, details);
}

export function invalidFilter(message: string, details?: Record<string, unknown>): ApiError {
  return new ApiError('INVALID_FILTER', 422, message, details);
}

export function errorResponse(error: unknown): Response {
  if (error instanceof ApiError) {
    const body: Record<string, unknown> = { code: error.code, message: error.message };
    if (error.details !== undefined) body.details = error.details;
    return Response.json({ error: body }, { status: error.status });
  }
  return Response.json(
    { error: { code: 'INTERNAL', message: 'internal server error' } },
    { status: 500 },
  );
}
