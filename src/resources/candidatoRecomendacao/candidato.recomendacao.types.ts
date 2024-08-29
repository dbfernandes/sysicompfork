import { CandidatoRecomendacao } from '@prisma/client';

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
