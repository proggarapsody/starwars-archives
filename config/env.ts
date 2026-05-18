/**
 * Typed env access. v1 has no required env vars.
 * Add via valibot schema when needed; never reach into process.env elsewhere.
 */

export const env = {
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development',
  isTest: process.env.NODE_ENV === 'test',
} as const;
