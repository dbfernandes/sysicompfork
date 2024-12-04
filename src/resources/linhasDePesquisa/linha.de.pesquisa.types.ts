import { LinhaPesquisa } from '@prisma/client';

export type CreateLinhaDePesquisaDto = Pick<LinhaPesquisa, 'nome' | 'sigla'>;

export type UpdateLinhaDePesquisaDto = Pick<LinhaPesquisa, 'nome' | 'sigla'>;
