import { PrismaClient, LinhaPesquisa } from '@prisma/client';
import {
  CreateLinhaDePesquisaDto,
  UpdateLinhaDePesquisaDto,
} from './linha.de.pesquisa.types';

const prisma = new PrismaClient();

class LinhaDePesquisaService {
  // Lista todas as linhas de pesquisa
  // @returns Lista de linhas de pesquisa
  async listarTodos(): Promise<LinhaPesquisa[]> {
    try {
      return await prisma.linhaPesquisa.findMany();
    } catch (erro) {
      console.error(
        `[ERRO] Listar linhas de pesquisa: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
      throw new Error(
        `Falha ao listar linhas de pesquisa: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
    }
  }

  // Busca uma linha de pesquisa pelo ID
  // @param id ID da linha de pesquisa
  // @returns Linha de pesquisa encontrada ou null
  async buscarPorId(id: number): Promise<LinhaPesquisa | null> {
    try {
      return await prisma.linhaPesquisa.findFirst({ where: { id } });
    } catch (erro) {
      console.error(
        `[ERRO] Buscar linha de pesquisa por ID: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
      throw new Error(
        `Falha ao buscar linha de pesquisa por ID: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
    }
  }

  // Busca uma linha de pesquisa pelo nome
  // @param nome Nome da linha de pesquisa
  // @returns Linha de pesquisa encontrada ou null
  async buscarPorNome(nome: string): Promise<LinhaPesquisa | null> {
    try {
      return await prisma.linhaPesquisa.findFirst({ where: { nome } });
    } catch (erro) {
      console.error(
        `[ERRO] Buscar linha de pesquisa por nome: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
      throw new Error(
        `Falha ao buscar linha de pesquisa por nome: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
    }
  }

  // Busca uma linha de pesquisa pela sigla
  // @param sigla Sigla da linha de pesquisa
  // @returns Linha de pesquisa encontrada ou null
  async buscarPorSigla(sigla: string): Promise<LinhaPesquisa | null> {
    try {
      return await prisma.linhaPesquisa.findFirst({ where: { sigla } });
    } catch (erro) {
      console.error(
        `[ERRO] Buscar linha de pesquisa por sigla: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
      throw new Error(
        `Falha ao buscar linha de pesquisa por sigla: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
    }
  }

  // Cria uma nova linha de pesquisa
  // @param linhaPesquisa Dados da nova linha de pesquisa
  // @returns Linha de pesquisa criada
  async criar(linhaPesquisa: CreateLinhaDePesquisaDto): Promise<LinhaPesquisa> {
    try {
      return await prisma.linhaPesquisa.create({ data: linhaPesquisa });
    } catch (erro) {
      console.error(
        `[ERRO] Criar linha de pesquisa: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
      throw new Error(
        `Falha ao criar linha de pesquisa: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
    }
  }

  // Atualiza uma linha de pesquisa existente
  // @param id ID da linha de pesquisa
  // @param linhaPesquisa Dados da linha de pesquisa a serem atualizados
  // @returns Linha de pesquisa atualizada
  async atualizar(
    id: number,
    linhaPesquisa: UpdateLinhaDePesquisaDto,
  ): Promise<LinhaPesquisa> {
    try {
      return await prisma.linhaPesquisa.update({
        where: { id },
        data: linhaPesquisa,
      });
    } catch (erro) {
      console.error(
        `[ERRO] Atualizar linha de pesquisa: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
      throw new Error(
        `Falha ao atualizar linha de pesquisa: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
    }
  }

  // Exclui uma linha de pesquisa pelo ID
  // @param id ID da linha de pesquisa
  // @returns Linha de pesquisa excluída
  async excluir(id: number): Promise<LinhaPesquisa> {
    try {
      return await prisma.linhaPesquisa.delete({ where: { id } });
    } catch (erro) {
      console.error(
        `[ERRO] Excluir linha de pesquisa: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
      throw new Error(
        `Falha ao excluir linha de pesquisa: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
    }
  }
}

export default new LinhaDePesquisaService();
