import { CandidatoPublicacao } from '@prisma/client';

export type CreateCandidatePublicationsDto = Pick<
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
