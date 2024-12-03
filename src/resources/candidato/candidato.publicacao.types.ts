import { CandidatoPublicacao } from '@prisma/client';

export type CreateCandidatoPublicationsDto = Pick<
  CandidatoPublicacao,
  | 'issn'
  | 'titulo'
  | 'ano'
  | 'natureza'
  | 'tipoId'
  | 'autores'
  | 'candidatoId'
  | 'local'
>;
