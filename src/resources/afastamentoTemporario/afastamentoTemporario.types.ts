import { AfastamentoTemporarios } from '@prisma/client';

export type ExtendedAfastamentoTemporarios = AfastamentoTemporarios & {
  dataCriacaoFormata?: string;
  dataRetornoFormata?: string;
  dataSaidaFormata?: string;
};

export type CreateAfastamentoTemporarioDto = Pick<
  AfastamentoTemporarios,
  | 'usuarioId'
  | 'usuarioNome'
  | 'dataSaida'
  | 'dataRetorno'
  | 'tipoViagem'
  | 'justificativa'
  | 'localViagem'
  | 'planoReposicao'
>;

export type UpdateAfastamentoTemporarioDto = Pick<
  CreateAfastamentoTemporarioDto,
  | 'usuarioId'
  | 'usuarioNome'
  | 'dataSaida'
  | 'dataRetorno'
  | 'tipoViagem'
  | 'justificativa'
  | 'localViagem'
  | 'planoReposicao'
>;
