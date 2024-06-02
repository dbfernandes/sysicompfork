import { Aluno } from "@prisma/client";

export type CreateAlunoDto = Pick<Aluno,
    'nomeCompleto' | 'curso' | 'periodoIngresso' | 'periodoConclusao' | 'formado'
>

export type UpdateAlunoDto = Pick<Aluno,
'nomeCompleto' | 'curso' | 'periodoIngresso' | 'periodoConclusao' | 'formado'
>

export type AlunoDto = Aluno & {
    curso: {
        id: number;
        nome: string;
        createdAt: Date;
        updatedAt: Date;
    };
    dataCriacaoFormata?: string;
    dataAtualizacaoFormata?: string;
};