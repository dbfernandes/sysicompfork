import { Projeto } from '@prisma/client';

export type CreateProjetoDto = Pick<
  Projeto,
  | 'professorId'
  | 'dataInicio'
  | 'titulo'
  | 'integrantes'
  | 'descricao'
  | 'dataFim'
  | 'financiadores'
  | 'papel'
>;

export type UpdateProjetoDto = Pick<
  Projeto,
  | 'professorId'
  | 'dataInicio'
  | 'titulo'
  | 'integrantes'
  | 'descricao'
  | 'dataFim'
  | 'financiadores'
  | 'papel'
>;
