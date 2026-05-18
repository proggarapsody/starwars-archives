import { films } from '@/shared/api';
import { makeDetailHandler } from '@/shared/api/http/handlers';

export const GET = makeDetailHandler({
  findBySlug: (slug) => films.findBySlug(slug),
  entityName: 'film',
});
