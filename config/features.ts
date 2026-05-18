/**
 * Feature flags. Currently empty — populated as features arrive.
 *
 * Example future shape:
 *   export const features = { galacticMap: false } as const;
 */

export const features = {} as const;

export type FeatureFlag = keyof typeof features;
