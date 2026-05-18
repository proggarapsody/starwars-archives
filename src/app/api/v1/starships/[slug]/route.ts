import { starships } from '@/shared/api';
import { makeDetailHandler } from '@/shared/api/http/handlers';

export const GET = makeDetailHandler({
  findBySlug: (slug) => starships.findBySlug(slug),
  entityName: 'starship',
});
