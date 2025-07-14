import { Edital } from '.prisma/client';

export const enum StatusEdital {
  BLOQUEADO = 0,
  ATIVO = 1,
}
export type CreateEditalDto = Pick<
  Edital,
  | 'vagasDoutorado'
  | 'cotasDoutorado'
  | 'taesDoutorado'
  | 'taesMestrado'
  | 'vagasMestrado'
  | 'cotasMestrado'
  | 'cartaOrientador'
  | 'cartaRecomendacao'
  | 'documento'
  | 'dataFim'
  | 'dataInicio'
  | 'status'
  | 'inscricoesEncerradas'
  | 'inscricoesIniciadas'
  | 'id'
>;

export type UpdateEditalDto = Pick<
  Edital,
  | 'vagasDoutorado'
  | 'cotasDoutorado'
  | 'taesDoutorado'
  | 'taesMestrado'
  | 'vagasMestrado'
  | 'cotasMestrado'
  | 'cartaOrientador'
  | 'cartaRecomendacao'
  | 'documento'
  | 'dataFim'
  | 'dataInicio'
  | 'status'
  | 'inscricoesEncerradas'
  | 'inscricoesIniciadas'
  | 'id'
>;
