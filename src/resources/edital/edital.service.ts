import { Candidato, Edital } from '@prisma/client';
import { DateTime } from 'luxon';
import { CreateEditalDto, StatusEdital, UpdateEditalDto } from './edital.types';
import prisma from '@client/prismaClient';
import { StepCandidateEdital } from '@resources/candidato/candidato.types';

/* eslint-disable camelcase */

class EditalService {
  async getById(id: string) {
    try {
      return await prisma.edital.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      console.error('Erro ao buscar edital:', error);
      throw new Error(error);
    }
  }

  async criarEdital(editalDados: CreateEditalDto): Promise<Edital> {
    try {
      const editalExistente = await prisma.edital.findFirst({
        where: { id: editalDados.id },
      });

      if (editalExistente) {
        throw new Error(`Edital de número ${editalDados.id} já existe`);
      }

      const zona = 'America/Manaus'; // GMT-4
      const editalComDatasConvertidas = {
        ...editalDados,
        dataInicio: DateTime.fromISO(editalDados.dataInicio, { zone: zona })
          .startOf('day')
          .toJSDate(),
        dataFim: DateTime.fromISO(editalDados.dataFim, { zone: zona })
          .endOf('day')
          .toJSDate(),
      };

      return await prisma.edital.create({ data: editalComDatasConvertidas });
    } catch (error) {
      console.error('Erro ao criar edital:', error);
      throw new Error(error.message || 'Erro inesperado');
    }
  }

  async listEdital() {
    try {
      return await prisma.edital.findMany();
    } catch (error) {
      console.error(`[ERROR] Listar Editais: ${error}`);
      throw new Error('Não foi possivel listar o edital');
    }
  }

  async listEditaisDisponiveis(): Promise<Edital[]> {
    const hoje = DateTime.now()
      .setZone('America/Manaus')
      .startOf('day')
      .toJSDate();

    return prisma.edital.findMany({
      where: {
        status: StatusEdital.ATIVO,
        dataInicio: {
          lte: hoje,
        },
        dataFim: {
          gte: hoje,
        },
      },
    });
  }

  async listEditalComQtdeCandidatos() {
    const editais = await prisma.edital.findMany({
      include: {
        candidatos: true,
      },
    });
    return editais.map((edital) => {
      return {
        ...edital,
        qtdeInscricoesFinalizadas: edital.candidatos.filter(
          (candidato) =>
            candidato.posicaoEdital === StepCandidateEdital.FINALIZACAO,
        ).length,
        qtdeInscricoesPendentes: edital.candidatos.filter(
          (candidato) =>
            candidato.posicaoEdital !== StepCandidateEdital.FINALIZACAO,
        ).length,
      };
    });
  }

  async delete(id: string) {
    try {
      const edital = await prisma.edital.findFirst({
        where: {
          id,
        },
      });

      if (!edital) {
        throw new Error(`Não existe edital de número ${id}`);
      }

      return await prisma.edital.update({
        where: { id: id },
        data: { status: 0 },
      });
    } catch (error) {
      console.error('Erro ao arquivar edital:', error);
      throw new Error(error);
    }
  }

  async arquivar(id: string, { status }: { status: any }) {
    const edital = await prisma.edital
      .findFirst({
        where: {
          id,
        },
      })
      .catch((err) => {
        console.error(`[ERROR] Buscar Edital: ${err}`);
        throw new Error('Não foi possivel buscar o edital');
      });

    if (!edital) {
      throw new Error('Edital não encontrado');
    }

    await prisma.edital
      .update({
        where: {
          id,
        },
        data: {
          status: Number(status),
          // updatedAt: moment.tz('America/Manaus').format('YYYY-MM-DD HH:mm:ss')
        },
      })
      .catch((err) => {
        console.error(`[ERROR] Atualizar Edital: ${err}`);
        throw new Error('Não foi possivel alterar o status do edital');
      });

    return edital;
  }

  async update(id_update: string, dados: UpdateEditalDto): Promise<Edital> {
    try {
      const edital = await prisma.edital.findFirst({
        where: {
          id: dados.id,
        },
      });

      if (!edital) {
        throw new Error('Edital não encontrado');
      }

      const zona = 'America/Manaus';
      const data: Partial<UpdateEditalDto> = { ...dados };

      if (dados.dataInicio) {
        data.dataInicio = DateTime.fromISO(dados.dataInicio.toString(), {
          zone: zona,
        })
          .startOf('day')
          .toJSDate();
      }

      if (dados.dataFim) {
        data.dataFim = DateTime.fromISO(dados.dataFim.toString(), {
          zone: zona,
        })
          .endOf('day')
          .toJSDate();
      }

      return await prisma.edital.update({
        where: { id: id_update },
        data,
      });
    } catch (error) {
      console.error('Erro ao atualizar edital:', error);
      throw new Error(error.message || 'Erro inesperado ao atualizar edital');
    }
  }

  async listCandidatos(id: string): Promise<Candidato[]> {
    try {
      const candidatos = await prisma.candidato.findMany({
        where: {
          editalId: id,
        },
        include: {
          linhaPesquisa: true,
        },
      });
      return candidatos;
    } catch (error) {
      console.error('Erro ao listar candidatos:', error);
      throw new Error(error);
    }
  }

  async getCandidato(id: string) {
    try {
      return await prisma.candidato.findUnique({
        where: {
          id,
        },
        include: {
          recomendacoes: true,
          linhaPesquisa: true,
          publicacoes: true,
          experienciasAcademicas: true,
        },
      });
    } catch (error) {
      console.error(`[ERROR] Buscar Candidato: ${error}`);
      throw new Error('Não foi possivel buscar o candidato');
    }
  }
}

export default new EditalService();
