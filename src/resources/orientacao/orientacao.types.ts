import { Orientacao } from "@prisma/client";

export type CreateOrientacaoDto = Pick<Orientacao,
    'idProfessor' | 'titulo' | 'aluno' | 'ano' | 'natureza' | 'tipo' | 'status'
>