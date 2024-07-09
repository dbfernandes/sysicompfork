import { Projeto } from "@prisma/client";

export type CreateProjetoDto = Pick<Projeto,
    'idProfessor' | 'inicio' | 'titulo' | 'integrantes' | 
    'descricao' | 'fim' | 'financiadores' | 'papel'
>

export type UpdateProjetoDto = Pick<Projeto,
    'idProfessor' | 'inicio' | 'titulo' | 'integrantes' | 
    'descricao' | 'fim' | 'financiadores' | 'papel'
>
    