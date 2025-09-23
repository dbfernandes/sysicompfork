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

// DTO para dados que chegam do formulário
export interface ReservaFormularioDto {
  salaId: string; // Vem como string do formulário
  usuarioId: string;
  atividade: string;
  tipo: string;
  dia?: string[] | string; // Pode ser array ou string única
  dataInicio: string; // Vem como string (YYYY-MM-DD)
  dataFim?: string;
  horaInicio: string;
  horaFim?: string;
  unica?: string; // Campo do switch no formulário
}

export type UpdateReservaDto = CreateReservaDto;
