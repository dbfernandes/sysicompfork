// types.ts

export interface Artigo {
  ano: number;
  titulo: string;
  autores: string[];
  revista?: string;
  conferencia?: string;
  volume?: string;
  numero?: string;
  paginas?: string;
  doi?: string;
  issn?: string;
  qualis?: string;
}

export interface Publicacoes {
  artigosConferencias: Artigo[];
  artigosPeriodicos: Artigo[];
  livros: Livro[];
  capitulos: CapituloLivro[];
}

export interface Livro {
  ano: number;
  titulo: string;
  autores: string[];
  editora: string;
  isbn?: string;
}

export interface CapituloLivro {
  ano: number;
  titulo: string;
  autores: string[];
  tituloLivro: string;
  editores: string[];
  editora: string;
  paginas?: string;
  isbn?: string;
}

export interface Professor {
  id: number;
  nomeCompleto: string;
  email: string;
  departamento?: string;
  titulacao?: string;
  areaAtuacao?: string[];
  linkLattes?: string;
  linkOrcid?: string;
}

export interface Projeto {
  inicio: number;
  fim: number;
  titulo: string;
  descricao: string;
  financiador?: string;
  valorFinanciado?: number;
  coordenador: string;
  participantes: string[];
  status: 'Em andamento' | 'Concluído' | 'Cancelado';
}

export interface Orientacao {
  ano: number;
  status: number;
  titulo: string;
  aluno: string;
  nivel: 'Graduação' | 'Mestrado' | 'Doutorado' | 'Pós-Doutorado';
  programa: string;
  instituicao: string;
  dataInicio: Date;
  dataConclusao?: Date;
}

export interface Premio {
  ano: number;
  nome: string;
  instituicao: string;
  descricao?: string;
  categoria?: string;
}

export interface SessionData {
  tipoUsuario?:
    | {
        administrador: boolean;
        secretaria: boolean;
        coordenador: boolean;
        professor: boolean;
      }
    | undefined;
  uid: string;
  nome: string;
}

export interface ServiceError {
  message: string;
  code?: number;
}

export interface CandidatoDB {
  Nome: string | null;
  email: string | null;
  inscricaoposcomp?: string | null;
  linha?: string | null;
  orientador?: string | null;
  bolsa?: string | null;
  CursoPosTipo: string | null;
  proposto?: string | null;
}

export interface CandidatoFormatado {
  nome: string;
  email: string;
  inscricao: string;
  linha: string;
  orientador: string;
  bolsa: string;
  nivel: string;
  proposto: string;
  provaInscricao: { formula: string };
  propostasMediaFinal: { formula: string; result: string };
  ws_mediaFinal_prova: { formula: string };
  ws_mediaFinal_proposta: { formula: string };
  ws_mediaFinal_media: { formula: string; result: string };
  ws_mediaFinal_titulos: { formula: string; result: string };
  ws_titulos_nota: { formula: string; result: string };
  ws_titulos_nac: { formula: string; result: string };
}

export type Column = {
  header: string;
  key: string;
  width: number;
};
