import { vehicles } from '@/shared/api';
import { makeDetailHandler } from '@/shared/api/http/handlers';

export const GET = makeDetailHandler({
  findBySlug: (slug) => vehicles.findBySlug(slug),
  entityName: 'vehicle',
});
