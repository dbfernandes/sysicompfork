import { CandidatoRecomendacao } from '@prisma/client';

export const enum RecomendacaoStatus {
  PENDENTE = '1',
  PREENCHIDA = '2',
  FINALIZADA = '3',
}

export type CreateRecomendacaoDto = Pick<
  CandidatoRecomendacao,
  'email' | 'prazo' | 'idCandidato' | 'nome' | 'token' | 'idEdital'
>;

export type SaveRecomendacaoDto = Pick<
  CandidatoRecomendacao,
  | 'nome'
  | 'titulacao'
  | 'instituicaoTitulacao'
  | 'anoTitulacao'
  | 'instituicaoAtual'
  | 'cargo'
  | 'anoContato'
  | 'dominio'
  | 'aprendizado'
  | 'assiduidade'
  | 'relacionamento'
  | 'iniciativa'
  | 'expressao'
  | 'informacoes'
>;
