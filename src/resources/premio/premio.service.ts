import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

class PremioService {
  async adicionarUm(
    idProfessor: number,
    titulo: string,
    ano: number,
    entidade: string
  ): Promise<void>{
    await prisma.premios.deleteMany({
      where: {
        idProfessor: idProfessor
      }
    })
    const premio: any = {
      idProfessor,
      titulo,
      ano,
      entidade
    }
    await prisma.premios.create({
      data: premio
    })
  }

  async adicionarVarios (
    idProfessor: number,
    premios: any[]
  ): Promise<void> {
    if (premios !== undefined) {
      const premiosArr = premios.map((p: any) => {
        return {
          idProfessor,
          entidade: p.entidade,
          titulo: p.titulo,
          ano: p.ano,
        };
      });
      await prisma.premios
        .deleteMany({
          where: {
            idProfessor,
          },
        })
        .then(async () => {
          await prisma.premios.createMany({
            data: premiosArr,
          });
        });
    }
  }
}

export default new PremioService();
