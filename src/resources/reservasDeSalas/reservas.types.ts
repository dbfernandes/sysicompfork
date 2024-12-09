import { ReservaSala } from '@prisma/client';

export type CreateReservaDto = Pick<
  ReservaSala,
  | 'salaId'
  | 'usuarioId'
  | 'atividade'
  | 'dataInicio'
  | 'dataFim'
  | 'tipo'
  | 'horaInicio'
  | 'horaFim'
  | 'dias'
>;

export type UpdateReservaDto = Pick<
  ReservaSala,
  | 'salaId'
  | 'usuarioId'
  | 'atividade'
  | 'dataInicio'
  | 'dataFim'
  | 'tipo'
  | 'horaInicio'
  | 'horaFim'
  | 'dias'
>;
