import { Publicacao } from '@prisma/client';

export interface PublicacoesDict {
  artigosConferencias: Publicacao[];
  artigosPeriodicos: Publicacao[];
  livros: Publicacao[];
  capitulos: Publicacao[];
}
