import { Orientacao, Publicacao } from '@prisma/client';

export type tipoOrientacao = Pick<
  Orientacao,
  'professorId' | 'titulo' | 'aluno' | 'ano' | 'natureza' | 'tipo' | 'status'
>;

export type publicacao = Pick<
  Publicacao,
  | 'issn'
  | 'titulo'
  | 'ano'
  | 'natureza'
  | 'tipoPublicacaoId'
  | 'autores'
  | 'local'
>;

export type tipoPublicacao = Publicacao & {
  id: number;
  TipoPublicacao: {
    id: number;
    nome: string;
    chave: string;
    createdAt: Date;
    updatedAt: Date;
  };
};
