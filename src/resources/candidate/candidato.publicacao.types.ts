import { CandidatoPublicacoes } from '@prisma/client';

export type CreateCandidatePublicationsDto = Pick<
  CandidatoPublicacoes,
  | 'ISSN'
  | 'titulo'
  | 'ano'
  | 'natureza'
  | 'tipo'
  | 'autores'
  | 'idCandidate'
  | 'local'
>;
