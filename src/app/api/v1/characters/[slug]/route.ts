import { characters } from '@/shared/api';
import { makeDetailHandler } from '@/shared/api/http/handlers';

export const GET = makeDetailHandler({
  findBySlug: (slug) => characters.findBySlug(slug),
  entityName: 'character',
});
