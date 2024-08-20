import { CandidatoRecomendacao } from '@prisma/client';

export type CreateRecomendacaoDto = Pick<
  CandidatoRecomendacao,
  'email' | 'prazo' | 'idCandidato' | 'nome' | 'token' | 'idEdital'
>;
