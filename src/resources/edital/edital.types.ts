import { Edital } from '@prisma/client';

export const enum StatusEdital {
  BLOQUEADO = '0',
  ATIVO = '1',
}
export type CreateEditalDto = Pick<
  Edital,
  | 'vagaDoutorado'
  | 'cotasDoutorado'
  | 'vagaMestrado'
  | 'cotasMestrado'
  | 'cartaOrientador'
  | 'cartaRecomendacao'
  | 'documento'
  | 'dataFim'
  | 'dataInicio'
  | 'status'
  | 'inscricoesEncerradas'
  | 'inscricoesIniciadas'
  | 'editalCodigo'
>;

export type UpdateEditalDto = Pick<
  Edital,
  | 'vagaDoutorado'
  | 'cotasDoutorado'
  | 'vagaMestrado'
  | 'cotasMestrado'
  | 'cartaOrientador'
  | 'cartaRecomendacao'
  | 'documento'
  | 'dataFim'
  | 'dataInicio'
  | 'inscricoesEncerradas'
  | 'inscricoesIniciadas'
  | 'editalCodigo'
>;
