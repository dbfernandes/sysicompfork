import { LinhasDePesquisa } from "@prisma/client";

export type CreateLinhaDePesquisaDto = Pick<LinhasDePesquisa, 'nome' | 'sigla'>

export type UpdateLinhaDePesquisaDto = Pick<LinhasDePesquisa, 'nome' | 'sigla'>