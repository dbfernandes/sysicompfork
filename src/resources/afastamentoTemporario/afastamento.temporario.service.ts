import prisma from '../../client';
import { AfastamentoTemporario } from '@prisma/client';
import { formatarData } from '../../utils/formatadores';
import {
  AfastamentoTemporarioExtendido,
  CreateAfastamentoDTO,
} from './afastamento.temporario.types';

class AfastamentoService {
  // Lista todos os afastamentos de um usuário específico
  // @param id ID do usuário
  // @returns Lista de afastamentos

  async listarPorUsuario(
    id: number,
  ): Promise<AfastamentoTemporarioExtendido[]> {
    try {
      const afastamentos = await prisma.afastamentoTemporario.findMany({
        where: {
          usuarioId: id,
        },
      });

      return afastamentos.map((afastamento) => ({
        ...afastamento,
        dataCriacaoFormata: formatarData(afastamento.createdAt),
        dataRetornoFormata: formatarData(afastamento.dataFim),
        dataSaidaFormata: formatarData(afastamento.dataInicio),
      }));
    } catch (erro) {
      console.error(
        `[ERRO] Listar afastamentos do usuário: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
      throw new Error(
        `Falha ao listar afastamentos do usuário: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
    }
  }

  // Lista todos os afastamentos temporários
  // @returns Lista de afastamentos

  async listarTodos(): Promise<AfastamentoTemporarioExtendido[]> {
    try {
      const afastamentos = await prisma.afastamentoTemporario.findMany();

      return afastamentos.map((afastamento) => ({
        ...afastamento,
        dataCriacaoFormata: formatarData(afastamento.createdAt),
        dataRetornoFormata: formatarData(afastamento.dataFim),
        dataSaidaFormata: formatarData(afastamento.dataInicio),
      }));
    } catch (erro) {
      console.error(
        `[ERRO] Listar todos os afastamentos: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
      throw new Error(
        `Falha ao listar todos os afastamentos: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
    }
  }

  // Cria um novo afastamento temporário
  // @param novoAfastamento Dados do novo afastamento
  // @returns Afastamento criado

  async criar(
    novoAfastamento: CreateAfastamentoDTO,
  ): Promise<AfastamentoTemporario> {
    try {
      return await prisma.afastamentoTemporario.create({
        data: novoAfastamento,
      });
    } catch (erro) {
      console.error(
        `[ERRO] Criar afastamento: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
      throw new Error(
        `Falha ao criar afastamento: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
    }
  }

  //Busca um afastamento pelo ID
  //@param id ID do afastamento
  //@returns Afastamento encontrado ou null

  async buscarPorId(id: number): Promise<AfastamentoTemporario | null> {
    try {
      return await prisma.afastamentoTemporario.findUnique({
        where: {
          id: id,
        },
      });
    } catch (erro) {
      console.error(
        `[ERRO] Buscar afastamento: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
      throw new Error(
        `Falha ao buscar afastamento: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
    }
  }

  // Busca detalhes de um afastamento com datas formatadas
  // @param id ID do afastamento
  // @returns Detalhes do afastamento ou null

  async buscarDetalhesPorId(
    id: number,
  ): Promise<AfastamentoTemporarioExtendido | null> {
    try {
      const afastamento = await prisma.afastamentoTemporario.findUnique({
        where: { id: id },
      });

      if (!afastamento) return null;

      return {
        ...afastamento,
        dataCriacaoFormata: formatarData(afastamento.createdAt),
        dataRetornoFormata: formatarData(afastamento.dataFim),
        dataSaidaFormata: formatarData(afastamento.dataInicio),
      };
    } catch (erro) {
      console.error(
        `[ERRO] Buscar detalhes do afastamento: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
      throw new Error(
        `Falha ao buscar detalhes do afastamento: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
    }
  }

  //Exclui um afastamento pelo ID
  //ID do afastamento

  async excluir(id: number): Promise<void> {
    try {
      await prisma.afastamentoTemporario.delete({
        where: {
          id: id,
        },
      });
    } catch (erro) {
      console.error(
        `[ERRO] Excluir afastamento: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
      throw new Error(
        `Falha ao excluir afastamento: ${erro instanceof Error ? erro.message : 'Erro desconhecido'}`,
      );
    }
  }
}

export default new AfastamentoService();
