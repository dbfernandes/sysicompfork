import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class PremioService {
  async adicionarUm(
    idProfessor: number,
    titulo: string,
    ano: number,
    entidade: string,
  ) {
    // await Premio.destroy({
    //   where: {
    //     idProfessor
    //   }
    // })
    await prisma.premios.deleteMany({
      where: {
        idProfessor: idProfessor,
      },
    });

    await prisma.premios.create({
      data: {
        idProfessor,
        titulo,
        ano,
        entidade,
      },
    });
  }

  async adicionarVarios(idProfessor: number, premios: any) {
    if (premios !== undefined) {
      const premiosArr = premios.premios.map((p: any) => {
        return {
          idProfessor,
          entidade: p.entidade,
          titulo: p.titulo,
          ano: p.ano,
        };
      });
      // await Premio.destroy({
      //   where: {
      //     idProfessor
      //   }
      // }).then(async () => {
      //   await Premio.bulkCreate(premiosArr)
      // })
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
