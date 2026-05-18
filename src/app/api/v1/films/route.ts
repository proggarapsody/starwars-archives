import { films } from '@/shared/api';
import { makeListHandler } from '@/shared/api/http/handlers';

export const GET = makeListHandler({
  findItems: () => films.findAll(),
});
