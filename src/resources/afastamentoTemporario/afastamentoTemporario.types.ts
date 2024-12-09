import { AfastamentoTemporario } from '@prisma/client';

export type ExtendedAfastamentoTemporarios = AfastamentoTemporario & {
  dataCriacaoFormata?: string;
  dataRetornoFormata?: string;
  dataSaidaFormata?: string;
};

export interface AfastamentoTemporario {
  id: number;
  usuarioId: number;
  nomeCompleto: string;
  dataInicio: Date;
  dataFim: Date;
  tipoViagem: string;
  localViagem: string;
  justificativa: string;
  planoReposicao: string;
  createdAt: Date;
  updatedAt: Date;
}

// DTO para criação de afastamento
export interface CreateAfastamentoDTO {
  usuarioId: number;
  nomeCompleto: string;
  dataInicio: Date;
  dataFim: Date;
  tipoViagem: string;
  localViagem: string;
  justificativa: string;
  planoReposicao: string;
}

export interface AfastamentoTemporarioExtendido extends AfastamentoTemporario {
  dataCriacaoFormata: string;
  dataRetornoFormata: string;
  dataSaidaFormata: string;
}
