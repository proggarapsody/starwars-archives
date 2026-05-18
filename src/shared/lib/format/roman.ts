const NUMERALS: ReadonlyArray<readonly [number, string]> = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

/**
 * Convert a positive integer to its Roman numeral string.
 * Returns the empty string for values <= 0 or non-integers.
 */
export function toRoman(n: number): string {
  if (!Number.isInteger(n) || n <= 0) return '';
  let value = n;
  let out = '';
  for (const [v, sym] of NUMERALS) {
    while (value >= v) {
      out += sym;
      value -= v;
    }
  }
  return out;
}
