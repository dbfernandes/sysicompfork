import { Projeto } from '@prisma/client';

export type CreateProjetoDto = Pick<
  Projeto,
  | 'professorId'
  | 'inicio'
  | 'titulo'
  | 'integrantes'
  | 'descricao'
  | 'fim'
  | 'financiadores'
  | 'papel'
>;

export type UpdateProjetoDto = Pick<
  Projeto,
  | 'professorId'
  | 'inicio'
  | 'titulo'
  | 'integrantes'
  | 'descricao'
  | 'fim'
  | 'financiadores'
  | 'papel'
>;
