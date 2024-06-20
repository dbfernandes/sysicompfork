import { Premios } from "@prisma/client";

export type CreatePremioDto = Pick<Premios,
    'idProfessor' | 'titulo' | 'ano' | 'entidade'
>