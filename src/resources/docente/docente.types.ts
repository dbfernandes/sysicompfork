import { Orientacao, Publicacao } from "@prisma/client";

export type tipoOrientacao = Pick<Orientacao,
    'idProfessor' | 'titulo' | 'aluno' | 'ano' | 'natureza' | 'tipo' | 'status'
>

export type publicacao = Pick<Publicacao,
    'ISSN' | 'titulo' | 'ano' | 'natureza' | 'tipo' | 'autores' | 'local'
>

export type tipoPublicacao = Publicacao & {
    id: number;
    TipoPublicacao: {
      id: number;
      nome: string;
      chave: string;
      createdAt: Date;
      updatedAt: Date;
    };
}