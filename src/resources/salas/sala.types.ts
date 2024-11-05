import { Salas } from '@prisma/client';

export type CreateSalaDto = Pick<
  Salas,
  'nome' | 'andar' | 'bloco' | 'numero' | 'capacidade'
>;

export type UpdateSalaDto = Pick<
  Salas,
  'nome' | 'andar' | 'bloco' | 'numero' | 'capacidade'
>;
