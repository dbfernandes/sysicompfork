// aluno.service.ts
import { PrismaClient, Aluno } from '@prisma/client';
import { CreateAlunoDto } from './aluno.types';

const prisma = new PrismaClient();

class AlunoService {
  async adicionarVarios(alunos: CreateAlunoDto[]): Promise<void> {
    if (alunos !== undefined && alunos.length > 0) {
      await prisma.aluno.deleteMany(); // Remove todos os registros existentes
      await prisma.aluno.createMany({ data: alunos }); // Cria os novos registros
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
        PD: 254,
        CC: 0,
        SI: 0,
        ES: 0,
        D: 0,
        M: 0,
      },
      data: new Date(),
    };

    const alunos = await prisma.aluno.findMany({
      where: {
        curso: {
          not: 'Processamento de Dados',
        },
      },
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
