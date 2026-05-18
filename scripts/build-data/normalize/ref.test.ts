import { describe, expect, test } from 'vitest';
import { RefIndex } from './ref';

describe('RefIndex', () => {
  test('resolves a URL to an EntityRef with slug and href', () => {
    const index = new RefIndex();
    index.register('planet', 'https://swapi.info/api/planets/1', 'Tatooine');

    const ref = index.resolve('planet', 'https://swapi.info/api/planets/1');

    expect(ref).toEqual({
      id: 'tatooine',
      name: 'Tatooine',
      type: 'planet',
      href: '/api/v1/planets/tatooine',
    });
  });

  test('normalizes URL variants (trailing slash, case, scheme)', () => {
    const index = new RefIndex();
    index.register('planet', 'https://swapi.info/api/planets/1/', 'Tatooine');

    expect(index.resolve('planet', 'https://swapi.info/api/planets/1')).not.toBeNull();
    expect(index.resolve('planet', 'http://swapi.info/api/planets/1/')).not.toBeNull();
  });

  test('returns null for unknown URLs', () => {
    const index = new RefIndex();
    expect(index.resolve('planet', 'https://swapi.info/api/planets/99')).toBeNull();
  });

  test('keeps separate namespaces per entity type', () => {
    const index = new RefIndex();
    index.register('planet', 'https://swapi.info/api/planets/1', 'Tatooine');
    index.register('character', 'https://swapi.info/api/people/1', 'Luke Skywalker');

    expect(index.resolve('planet', 'https://swapi.info/api/people/1')).toBeNull();
    expect(index.resolve('character', 'https://swapi.info/api/people/1')?.name).toBe(
      'Luke Skywalker',
    );
  });

  test('resolveMany filters out unknown URLs and returns a sorted array', () => {
    const index = new RefIndex();
    index.register('character', 'https://swapi.info/api/people/1', 'Luke Skywalker');
    index.register('character', 'https://swapi.info/api/people/2', 'Anakin Skywalker');

    const refs = index.resolveMany('character', [
      'https://swapi.info/api/people/2',
      'https://swapi.info/api/people/999',
      'https://swapi.info/api/people/1',
    ]);

    expect(refs.map((r) => r.id)).toEqual(['anakin-skywalker', 'luke-skywalker']);
  });

  test('register replaces an existing URL mapping (last write wins)', () => {
    const index = new RefIndex();
    index.register('planet', 'https://swapi.info/api/planets/1', 'Tatooine');
    index.register('planet', 'https://swapi.info/api/planets/1', 'Tatooine II');

    expect(index.resolve('planet', 'https://swapi.info/api/planets/1')?.name).toBe('Tatooine II');
  });
});
