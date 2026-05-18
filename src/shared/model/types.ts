/**
 * Shared domain primitives used across multiple entities.
 * Entity-specific types live in src/entities/<entity>/model/types.ts.
 */

export type Slug = string;

export type EntityType = 'character' | 'film' | 'planet' | 'species' | 'starship' | 'vehicle';

export type Era = 'BBY' | 'ABY';

export type Side = 'light' | 'dark' | 'none';

/**
 * An inline reference to another entity. Embedded in records to allow the UI
 * to render cross-links without a second lookup, and to give public API
 * consumers a discoverable href.
 */
export type EntityRef<T extends EntityType = EntityType> = {
  id: Slug;
  name: string;
  type: T;
  /**
   * Public API href. Always of shape `/api/v1/{type}s/{id}`.
   * Typed as plain `string` (not a template literal) so the valibot-inferred
   * schema output matches; the runtime schema enforces the prefix.
   */
  href: string;
};

/**
 * Physical quantities carry units in the type, not the value.
 * `null` is the only "unknown" — no sentinel strings.
 */
export type Length = { cm: number };
export type Mass = { kg: number };
export type Year = { value: number; era: Era };
