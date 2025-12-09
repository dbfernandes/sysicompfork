import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class PremioService {
  async adicionarUm(
    professorId: number,
    titulo: string,
    ano: number,
    entidade: string,
  ): Promise<void> {
    await prisma.premio.deleteMany({
      where: {
        professorId: professorId,
      },
    });
    const premio = {
      professorId,
      titulo,
      ano: Number(ano),
      entidade,
    };
    await prisma.premio.create({
      data: premio,
    });
  }

  async adicionarVarios(professorId: number, premio: any[]): Promise<void> {
    if (premio !== undefined) {
      const premioArr = premio.map((p) => {
        return {
          professorId,
          entidade: p.entidade,
          titulo: p.titulo,
          ano: Number(p.ano),
        };
      });
      await prisma.premio
        .deleteMany({
          where: {
            professorId,
          },
        })
        .then(async () => {
          await prisma.premio.createMany({
            data: premioArr,
          });
        });
    }
  }
}

export default new PremioService();
