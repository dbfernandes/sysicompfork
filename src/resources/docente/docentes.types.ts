export interface Orientacao {
  id: number;
  idProfessor: number;
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
  tipo: number;
  natureza: string | null;
  autores: string;
  ISSN: string;
  createdAt: Date;
  updatedAt: Date;
  TipoPublicacao: {
    id: number;
    nome: string;
    chave: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
