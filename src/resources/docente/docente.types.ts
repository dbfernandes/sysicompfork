import { Publicacao } from '@prisma/client';

//
// export type publicacao = Pick<
//   Publicacao,
//   '

export interface PublicacoesDict {
  artigosConferencias: Publicacao[];
  artigosPeriodicos: Publicacao[];
  livros: Publicacao[];
  capitulos: Publicacao[];
}
