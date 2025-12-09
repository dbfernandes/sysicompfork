import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class OrientacaoService {
  async adicionarVarios(
    professorId: number,
    orientacoes: any[],
  ): Promise<void> {
    if (orientacoes !== undefined) {
      const orientacoesArr = orientacoes.map((o) => {
        return {
          professorId,
          titulo: o.titulo,
          aluno: o.aluno,
          ano: Number(o.ano),
          natureza: o.natureza,
          tipo: o.tipo,
          status: o.status,
        };
      });
      await prisma.orientacao
        .deleteMany({
          where: {
            professorId,
          },
        })
        .then(async () => {
          await prisma.orientacao.createMany({
            data: orientacoesArr,
          });
        });
    }
  }
}

export default new OrientacaoService();
