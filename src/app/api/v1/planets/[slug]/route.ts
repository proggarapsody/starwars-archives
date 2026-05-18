import { planets } from '@/shared/api';
import { makeDetailHandler } from '@/shared/api/http/handlers';

export const GET = makeDetailHandler({
  findBySlug: (slug) => planets.findBySlug(slug),
  entityName: 'planet',
});
