import { Orientacao, Publicacao } from '@prisma/client';

export type tipoOrientacao = Pick<
  Orientacao,
  'professorId' | 'titulo' | 'aluno' | 'ano' | 'natureza' | 'tipo' | 'status'
>;

export type publicacao = Pick<
  Publicacao,
  'issn' | 'titulo' | 'ano' | 'natureza' | 'tipo' | 'autores' | 'local'
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

export interface Orientacao {
  id: number;
  professorId: number;
  titulo: string;
  aluno: string;
  ano: number;
  natureza: string | null;
  tipo: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Publicacao {
  id: number;
  titulo: string;
  ano: number;
  local: string | null;
  natureza: string | null;
  autores: string;
  issn: string;
  createdAt: Date;
  updatedAt: Date;
  tipo: {
    id: number;
    nome: string;
    chave: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface TipoPublicacao {
  id: number;
  nome: string;
  chave: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Publicacao {
  id: number;
  titulo: string;
  ano: number;
  local: string | null;
  tipoId: number; // Mapeado como 'tipo' no schema, mas é o ID da relação
  natureza: string | null;
  autores: string;
  issn: string;
  createdAt: Date;
  updatedAt: Date;
  tipo: TipoPublicacao; // Relação com TipoPublicacao
}

export interface UsuarioPublicacao {
  id: number;
  usuarioId: number;
  publicacaoId: number;
  publicacao: Publicacao;
}

export interface PublicacoesDict {
  artigosConferencias: Publicacao[];
  artigosPeriodicos: Publicacao[];
  livros: Publicacao[];
  capitulos: Publicacao[];
}
