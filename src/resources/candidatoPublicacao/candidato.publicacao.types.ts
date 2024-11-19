import { CandidatoPublicacao } from '@prisma/client';

export const enum TYPES_PUBLICACAO {
  PERIODICOS = 1,
  EVENTOS = 2,
  LIVROS = 3,
  CAPITULOS = 4,
  OUTRAS = 5,
  PREFACIOS = 6,
}

export interface Publicacao {
  titulo?: string;
  ano?: string | number;
  local?: string;
  natureza?: string;
  autores: {
    nomeCompleto: string[];
  };
  ISSN?: string;
}

export type PublicacaoData = {
  candidatoId: number;
  titulo: string;
  local: string;
  tipo: number;
  natureza: string;
  autores: string;
  ISSN: string;
  ano?: number;
};

export interface PublicacoesResponse {
  periodicos: CandidatoPublicacao[];
  conferencias: CandidatoPublicacao[];
}

export type CandidatoPublicacaoCreate = Omit<
  CandidatoPublicacao,
  'id' | 'createdAt' | 'updatedAt'
>;
