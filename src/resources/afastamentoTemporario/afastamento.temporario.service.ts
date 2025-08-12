import prisma from '../../client';
import { AfastamentoTemporario } from '@prisma/client';
import { formatarData } from '@utils/formatadores';
import {
  AfastamentoTemporarioExtendido,
  CreateAfastamentoDTO,
} from './afastamento.temporario.types';
import { sendEmail } from '@resources/email/email.service';
import usuarioService from '@resources/usuarios/usuario.service';
import { generatePdfLeave } from '@resources/pdf/pdf.controller';
import path from 'path';
import fs from 'fs';

class AfastamentoService {
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

  async sendEmailAfastamento(novoAfastamento: any): Promise<void> {
    const id = novoAfastamento.id.toString();

    await generatePdfLeave(id, id);
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      `tmp/afastamentos/${id}.pdf`,
    );
    // Garante que o arquivo existe
    await fs.promises.access(filePath, fs.constants.F_OK);

    // Lê em memória para anexar e depois poder excluir o arquivo
    const pdfBuffer = await fs.promises.readFile(filePath);
    const { email: emailDiretor } = await usuarioService.getDiretor();
    const { email: emailCoordenador } = await usuarioService.getCoordenador();
    const emailsSend = [emailDiretor, emailCoordenador].filter(Boolean); // Filtra emails falsy
    // Envia email para o usuário e coordenador
    await sendEmail({
      to: emailsSend,
      name: 'SysICOMP UFAM',
      title: 'Novo afastamento temporário',
      template: 'afastamentoTemporario',
      data: {
        ...novoAfastamento,
      },
      layout: 'layoutSyscomp',
      attachments: [
        {
          filename: `Afastamento-${novoAfastamento.usuario.nomeCompleto}.pdf`,
          content: pdfBuffer, // Nodemailer/Resend aceitam Buffer aqui
          contentType: 'application/pdf',
        },
      ],
    });

    fs.promises
      .unlink(filePath)
      .catch((err) => console.error('Erro ao deletar PDF temporário:', err));
  }

  async criar(data: CreateAfastamentoDTO) {
    const novoAfastamento = await prisma.afastamentoTemporario.create({
      data,
      include: {
        usuario: true,
      },
    });
    this.sendEmailAfastamento(novoAfastamento);
    return novoAfastamento;
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
