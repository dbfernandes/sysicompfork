import { Prisma } from '@prisma/client';

export const linhasDePesquisa: Prisma.LinhaPesquisaCreateManyInput[] = [
  {
    id: 1,
    nome: 'Sistemas Computacionais',
    sigla: 'SC',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    nome: 'Software, Interação e Aplicações',
    sigla: 'SF, INT, AP',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    nome: 'Inteligência Artificial e Ciência de Dados',
    sigla: 'IA, CD',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
