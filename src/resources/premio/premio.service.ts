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
        professorId,
      },
    });
    const premio: any = {
      professorId,
      titulo,
      ano,
      entidade,
    };
    await prisma.premio.create({
      data: premio,
    });
  }

  async adicionarVarios(professorId: number, premios: any[]): Promise<void> {
    if (premios !== undefined) {
      const premiosArr = premios.map((p: any) => {
        return {
          professorId,
          entidade: p.entidade,
          titulo: p.titulo,
          ano: p.ano,
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
            data: premiosArr,
          });
        });
    }
  }
}

export default new PremioService();
