import { describe, expect, test } from 'vitest';
import { kgToMass, metersToLength, signedYearToYear } from './quantity';

describe('metersToLength', () => {
  test('converts meters to centimeters', () => {
    expect(metersToLength(1.72)).toEqual({ cm: 172 });
  });

  test('rounds to the nearest centimeter', () => {
    expect(metersToLength(1.756)).toEqual({ cm: 176 });
    expect(metersToLength(1.754)).toEqual({ cm: 175 });
  });

  test('returns null for null or undefined input', () => {
    expect(metersToLength(null)).toBeNull();
    expect(metersToLength(undefined)).toBeNull();
  });

  test('returns null for NaN, Infinity, and non-positive values', () => {
    expect(metersToLength(Number.NaN)).toBeNull();
    expect(metersToLength(Number.POSITIVE_INFINITY)).toBeNull();
    expect(metersToLength(0)).toBeNull();
    expect(metersToLength(-1)).toBeNull();
  });
});

describe('kgToMass', () => {
  test('wraps a number in kg units', () => {
    expect(kgToMass(73)).toEqual({ kg: 73 });
  });

  test('returns null for null or undefined', () => {
    expect(kgToMass(null)).toBeNull();
    expect(kgToMass(undefined)).toBeNull();
  });

  test('returns null for NaN, Infinity, and non-positive values', () => {
    expect(kgToMass(Number.NaN)).toBeNull();
    expect(kgToMass(0)).toBeNull();
    expect(kgToMass(-5)).toBeNull();
  });
});

describe('signedYearToYear', () => {
  test('converts a negative number to a BBY year with positive value', () => {
    expect(signedYearToYear(-19)).toEqual({ value: 19, era: 'BBY' });
  });

  test('converts a positive number to an ABY year', () => {
    expect(signedYearToYear(34)).toEqual({ value: 34, era: 'ABY' });
  });

  test('treats zero as ABY (the Battle of Yavin)', () => {
    expect(signedYearToYear(0)).toEqual({ value: 0, era: 'ABY' });
  });

  test('returns null for null or undefined', () => {
    expect(signedYearToYear(null)).toBeNull();
    expect(signedYearToYear(undefined)).toBeNull();
  });

  test('returns null for NaN and Infinity', () => {
    expect(signedYearToYear(Number.NaN)).toBeNull();
    expect(signedYearToYear(Number.POSITIVE_INFINITY)).toBeNull();
  });
});
