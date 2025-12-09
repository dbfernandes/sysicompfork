// aluno.service.ts
import prisma from '@client/prismaClient';
import { Aluno } from '@prisma/client';
import { CreateAlunoDto } from './aluno.types';
import alunosProcessamentoFixo from './processamento_formados.json';

class AlunoService {
  async adicionarVarios(alunos: CreateAlunoDto[]): Promise<void> {
    if (alunos !== undefined && alunos.length > 0) {
      await prisma.aluno.deleteMany(); // Remove todos os registros existentes

      const alunosFormados = alunos.map((aluno) => {
        return {
          ...aluno,
          formado: Number(aluno.formado),
        };
      });

      const alunosProcessamento = alunosFormados.filter(
        (aluno) => aluno.curso === 'Processamento de Dados',
      );
      alunosProcessamentoFixo.forEach((aluno) => {
        if (
          alunosProcessamento.findIndex(
            (a) => a.nomeCompleto === aluno.nomeCompleto,
          ) === -1
        ) {
          alunosFormados.push({
            ...aluno,
            formado: Number(aluno.formado),
          });
        }
      });
      await prisma.aluno.createMany({
        data: alunosFormados,
      });
    }
  }

  async listarTodos(
    curso: string | string[],
    formado: number,
  ): Promise<Aluno[]> {
    return prisma.aluno.findMany({
      where: {
        curso: Array.isArray(curso) ? { in: curso } : curso,
        formado,
      },
    });
  }

  async contarTodos(): Promise<{
    matriculados: Record<string, number>;
    egressos: Record<string, number>;
    data: Date;
  }> {
    const contagem = {
      matriculados: {
        CC: 0,
        SI: 0,
        ES: 0,
        D: 0,
        M: 0,
      },
      egressos: {
        PD: 0,
        CC: 0,
        SI: 0,
        ES: 0,
        D: 0,
        M: 0,
      },
      data: new Date(),
    };

    const alunos = await prisma.aluno.findMany({
      select: {
        formado: true,
        curso: true,
        createdAt: true,
      },
    });

    if (alunos.length > 0) {
      contagem.data = alunos[0].createdAt;
      alunos.forEach((aluno) => {
        if (!aluno.formado) {
          switch (aluno.curso) {
            case 'Ciência da Computação':
              contagem.matriculados.CC += 1;
              break;
            case 'Engenharia de Software':
              contagem.matriculados.ES += 1;
              break;
            case 'Mestrado':
              contagem.matriculados.M += 1;
              break;
            default:
              contagem.matriculados.D += 1;
              break;
          }
        } else {
          switch (aluno.curso) {
            case 'Ciência da Computação':
              contagem.egressos.CC += 1;
              break;
            case 'Engenharia de Software':
              contagem.egressos.ES += 1;
              break;
            case 'Sistemas de Informação':
              contagem.egressos.SI += 1;
              break;
            case 'Mestrado':
              contagem.egressos.M += 1;
              break;
            case 'Processamento de Dados':
              contagem.egressos.PD += 1;
              break;
            default:
              contagem.egressos.D += 1;
              break;
          }
        }
      });
    }

    return contagem;
  }
}

export default new AlunoService();
