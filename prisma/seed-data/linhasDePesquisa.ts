import { Prisma } from '@prisma/client';

export const linhasDePesquisa: Prisma.LinhaPesquisaCreateManyInput[] = [
  {
    id: 1,
    nome: 'Banco de Dados e Recuperacao de Informacao',
    sigla: 'BD e RI',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    nome: 'Computacao Aplicada',
    sigla: 'CA',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    nome: 'Engenharia de Software',
    sigla: 'ES',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
