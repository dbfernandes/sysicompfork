import { PrismaClient } from '@prisma/client';
import { distance } from 'fastest-levenshtein';
import getPublicationsArr from '../utils/listaPublicacoes';

const prisma = new PrismaClient();

class PublicacaoService {
  async adicionarVarios(idProfessor: number, publicacoes: any[]): Promise<void> {
    if (publicacoes !== undefined) {
      const tipos = await prisma.tipoPublicacao.findMany();
      const publicArr = await getPublicationsArr(publicacoes, idProfessor, tipos);

      const professor = await prisma.usuario.findUnique({
        where: { id: idProfessor },
        include: {
          RelUsuarioPublicacao: {
            include: {
              Publicacao: true,
            },
          },
        },
      });

      const publicacoesExistentes = professor?.RelUsuarioPublicacao.map(rel => rel.Publicacao) || [];
      if (publicacoesExistentes.length > 0) {
        const idPublicacoesExistentes = publicacoesExistentes.map(p => p.id);

        const todasRelacoes = await prisma.relUsuarioPublicacao.findMany({
          where: {
            idPublicacao: { in: idPublicacoesExistentes },
          },
        });

        const idPublicacoesAExcluir = idPublicacoesExistentes.filter(publicacaoId => {
          const outraRelacao = todasRelacoes.find(e => e.idPublicacao === publicacaoId && e.idUsuario !== idProfessor);
          return !outraRelacao;
        });

        await prisma.usuario.update({
          where: { id: idProfessor },
          data: {
            RelUsuarioPublicacao: {
              deleteMany: {
                idPublicacao: { in: idPublicacoesAExcluir },
              },
            },
          },
        });

        await prisma.publicacao.deleteMany({
          where: { id: { in: idPublicacoesAExcluir } },
        });
      }

      for (const publicacao of publicArr) {
        const publicacoesMesmoAno = await prisma.publicacao.findMany({
          where: {
            ano: publicacao.ano,
          },
          select: {
            id: true,
            titulo: true,
          },
        });

        let unicaPublicacao = publicacoesMesmoAno.find(p => distance(p.titulo, publicacao.titulo) <= 3);

        if (!unicaPublicacao) {
          unicaPublicacao = await prisma.publicacao.create({
            data: publicacao,
          });
        }

        await prisma.relUsuarioPublicacao.create({
          data: {
            idUsuario: idProfessor,
            idPublicacao: unicaPublicacao.id,
          },
        });
      }
    }
  }

  async listarTodos(conditions: any) {
    const publicacoes = await prisma.publicacao.findMany({
      where: conditions || {},
      include: {
        TipoPublicacao: true,
      },
    });
    return publicacoes;
  }

  async contarTodos() {
    const currentYear = new Date().getFullYear();
    const anos = Array.from({ length: 15 }, (_, i) => currentYear - 14 + i);

    const counts = await prisma.publicacao.groupBy({
      by: ['ano', 'tipo'],
      where: {
        tipo: { in: [1, 2] },
        ano: {
          gte: currentYear - 14,
        },
      },
      _count: {
        _all: true,
      },
    });

    const contagemTotal = {
      Conferencia: anos.map(ano => counts.find(c => c.ano === ano && c.tipo === 1)?._count._all || 0),
      Periodico: anos.map(ano => counts.find(c => c.ano === ano && c.tipo === 2)?._count._all || 0),
    };

    return {
      contagemTotal,
      anos,
    };
  }
}

export default new PublicacaoService();
