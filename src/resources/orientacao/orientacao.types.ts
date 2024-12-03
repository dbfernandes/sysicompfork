import { Orientacao } from '@prisma/client';

export type CreateOrientacaoDto = Pick<
  Orientacao,
  'professorId' | 'titulo' | 'aluno' | 'ano' | 'natureza' | 'tipo' | 'status'
>;
