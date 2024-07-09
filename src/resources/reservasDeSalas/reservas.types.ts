import { ReservaSalas } from "@prisma/client";

export type CreateReservaDto = Pick<ReservaSalas,
    'SalaId' | 'UsuarioId' | 'atividade' | 'dataInicio' | 'dataTermino' | 
    'tipo' | 'horaInicio' | 'horaTermino' | 'dias'
>

export type UpdateReservaDto = Pick<ReservaSalas,
    'SalaId' | 'UsuarioId' | 'atividade' | 'dataInicio' | 'dataTermino' | 
    'tipo' | 'horaInicio' | 'horaTermino' | 'dias'
>
