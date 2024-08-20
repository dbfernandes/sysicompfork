import { Edital } from '@prisma/client';

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
  | 'editalId'
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
  | 'editalId'
>;
