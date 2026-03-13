import prisma from '@client/prismaClient';
import { Projeto } from '@prisma/client';
import { ProjetoData } from './projetos.types';

class ProjetoService {
  async adicionarVarios(
    professorId: number,
    input: { projetos: ProjetoData[] } | undefined,
  ): Promise<void> {
    if (input?.projetos) {
      const projetosArr = input.projetos.map((p) => ({
        professorId,
        titulo: p.titulo,
        descricao: p.descricao,
        dataInicio: Number(p.inicio),
        dataFim: p.fim ? Number(p.fim) : null,
        papel: p.papel,
        financiadores: p.financiadores,
        integrantes: p.integrantes,
      }));
      await prisma.$transaction([
        prisma.projeto.deleteMany({
          where: { professorId },
        }),
        prisma.projeto.createMany({
          data: projetosArr,
        }),
      ]);
    }
  }

  async listarAtuais(): Promise<
    Pick<Projeto, 'id' | 'titulo' | 'descricao'>[]
  > {
    const projetos = await prisma.projeto.findMany({
      where: {
        OR: [
          { dataFim: null }, // registros sem data de fim
          { dataFim: 0 }, // registros com data "1970-01-01" (equivalente a 0 em JS)
        ],
      },
      select: {
        id: true,
        titulo: true,
        descricao: true,
        financiadores: true,
        integrantes: true,
      },
    });

    const projetosFiltrados = projetos.reduce<typeof projetos>(
      (acc, projeto) => {
        const duplicado = acc.some(
          (p) =>
            p.titulo === projeto.titulo ||
            (p.descricao === projeto.descricao &&
              projeto.descricao !== '' &&
              p.id !== projeto.id),
        );

        if (!duplicado) {
          acc.push(projeto);
        }

        return acc;
      },
      [],
    );

    return projetosFiltrados;
  }
}
export default new ProjetoService();
