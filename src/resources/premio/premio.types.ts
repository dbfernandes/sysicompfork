import { Premio } from '@prisma/client';

export type CreatePremioDto = Pick<
  Premio,
  'professorId' | 'titulo' | 'ano' | 'entidade'
>;
