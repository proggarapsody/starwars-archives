import { species } from '@/shared/api';
import { makeDetailHandler } from '@/shared/api/http/handlers';

export const GET = makeDetailHandler({
  findBySlug: (slug) => species.findBySlug(slug),
  entityName: 'species',
});
