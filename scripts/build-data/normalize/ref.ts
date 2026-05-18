import { slugify } from '@/shared/lib/slug';
import type { EntityRef, EntityType } from '@/shared/model';

/**
 * Index of every entity URL → its slug + name, used to resolve SWAPI's
 * URL-form cross-references into our EntityRef shape.
 *
 * Lifecycle: register every entity during pre-normalization, then call
 * resolve / resolveMany during the merge phase.
 */
export class RefIndex {
  private readonly entries = new Map<string, { id: string; name: string; type: EntityType }>();

  register(type: EntityType, url: string, name: string): void {
    const key = this.key(type, url);
    this.entries.set(key, { id: slugify(name), name, type });
  }

  resolve<T extends EntityType>(type: T, url: string): EntityRef<T> | null {
    const entry = this.entries.get(this.key(type, url));
    if (!entry) return null;
    return {
      id: entry.id,
      name: entry.name,
      type: entry.type as T,
      href: `/api/v1/${entry.type}s/${entry.id}`,
    };
  }

  resolveMany<T extends EntityType>(type: T, urls: string[]): EntityRef<T>[] {
    const resolved: EntityRef<T>[] = [];
    for (const url of urls) {
      const ref = this.resolve(type, url);
      if (ref) resolved.push(ref as EntityRef<T>);
    }
    return resolved.sort((a, b) => a.name.localeCompare(b.name));
  }

  /** Canonicalize URL keys: lowercase scheme + host, trim trailing slash. */
  private key(type: EntityType, url: string): string {
    const normalized = url
      .trim()
      .replace(/^http:\/\//i, 'https://')
      .replace(/\/+$/, '')
      .toLowerCase();
    return `${type}::${normalized}`;
  }
}
