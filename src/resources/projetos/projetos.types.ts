import {
  Orientacao,
  Premio,
  Projeto,
  Publicacao,
  Usuario,
} from '@prisma/client';

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

export type ProjetoData = Pick<
  Projeto,
  | 'titulo'
  | 'descricao'
  | 'papel'
  | 'financiadores'
  | 'integrantes'
  | 'isUfam'
  | 'natureza'
> & {
  inicio: number;
  fim: number;
};

// Tipos para os dados parseados
export type PublicacaoParsed = Partial<Publicacao>;
export type PremioParsed = Partial<Premio>;
export type InfoParsed = Partial<Usuario>;
export type OrientacaoParsed = Partial<Orientacao>;

// Tipo para o body da requisição
export interface CurriculoRequestBody {
  publicacoes: string;
  professorId: number;
  premios: string;
  info: string;
  projetos: string;
  orientacoes: string;
}

// Tipo para projeto parseado com campos específicos
export type ProjetoParsed = Partial<Omit<Projeto, 'dataInicio' | 'dataFim'>> & {
  inicio?: number;
  fim?: number;
};

// Tipo para os dados transformados do projeto
export type ProjetoTransformed = {
  projetos: Array<{
    titulo: string;
    descricao: string;
    papel: string;
    financiadores: string;
    integrantes: string;
    inicio: number;
    fim: number;
    isUfam: boolean;
    natureza: string;
  }>;
};
