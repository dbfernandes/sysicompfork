import { Sala } from '@prisma/client';

export type CreateSalaDto = Pick<
  Sala,
  'nome' | 'andar' | 'bloco' | 'numero' | 'capacidade'
>;

export type UpdateSalaDto = Pick<
  Sala,
  'nome' | 'andar' | 'bloco' | 'numero' | 'capacidade'
>;
