import { CandidatoPublicacao } from '@prisma/client';

export const enum TYPES_PUBLICACAO {
  PERIODICOS = 1,
  EVENTOS = 2,
  LIVROS = 3,
  CAPITULOS = 4,
  OUTRAS = 5,
  PREFACIOS = 6,
}

export type PublicacaoCreateDto = Pick<
  CandidatoPublicacao,
  'titulo' | 'ano' | 'local' | 'natureza' | 'issn'
> & {
  autores: {
    nomeCompleto: string[];
  };
};

export type PublicacaoCreate = Pick<
  CandidatoPublicacao,
  | 'titulo'
  | 'ano'
  | 'local'
  | 'natureza'
  | 'issn'
  | 'autores'
  | 'candidatoId'
  | 'tipoId'
>;

export interface PublicacoesData {
  'ARTIGO-PUBLICADO': PublicacaoCreateDto[];
  'TRABALHO-EM-EVENTOS': PublicacaoCreateDto[];
  'LIVRO-PUBLICADO-OU-ORGANIZADO': PublicacaoCreateDto[];
  'CAPITULO-DE-LIVRO-PUBLICADO': PublicacaoCreateDto[];
  'OUTRA-PRODUCAO-BIBLIOGRAFICA': PublicacaoCreateDto[];
  'PREFACIO-POSFACIO': PublicacaoCreateDto[];
}
