import { Orientacao, PrismaClient, Publicacao } from '@prisma/client';

const prisma = new PrismaClient();

class DocenteService {
  async listarPerfil(id: number) {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nomeCompleto: true,
        email: true,
        status: true,
        idLattes: true,
        formacao: true,
        formacaoIngles: true,
        resumo: true,
        resumoIngles: true,
        ultimaAtualizacao: true,
        createdAt: true,
        Avatares: true,
      },
    });

    if (usuario) {
      const usuarioDict = {
        ...usuario,
        Avatar: usuario.Avatares[0],
        perfil: this.perfis(usuario),
        createdAt: new Date(usuario.createdAt)
          .toLocaleString('pt-BR', {
            timeZone: 'America/Manaus',
          })
          .slice(0, 10),
      };
      return usuarioDict;
    }
    return null;
  }

  async listarPublicacoes(id: number) {
    const relacoesPublicacoes = await prisma.relUsuarioPublicacao.findMany({
      where: { usuarioId: id },
      include: {
        Publicacao: {
          include: {
            TipoPublicacao: true,
          },
        },
      },
      orderBy: {
        Publicacao: {
          ano: 'desc',
        },
      },
    });

    const publicacoesDict = {
      artigosConferencias: [] as Publicacao[],
      artigosPeriodicos: [] as Publicacao[],
      livros: [] as Publicacao[],
      capitulos: [] as Publicacao[],
    };

    relacoesPublicacoes.forEach((rel) => {
      const publi = rel.Publicacao;
      const publiDict = {
        ...publi,
        TipoPublicacao: publi.TipoPublicacao,
      };
      if (publi.tipoPublicacaoId === 1) {
        publicacoesDict.artigosConferencias.push(publiDict);
      } else if (publi.tipoPublicacaoId === 2) {
        publicacoesDict.artigosPeriodicos.push(publiDict);
      } else if (publi.tipoPublicacaoId === 3) {
        publicacoesDict.livros.push(publiDict);
      } else {
        publicacoesDict.capitulos.push(publiDict);
      }
    });

    return publicacoesDict;
  }

  async listarPesquisas(id: number) {
    const pesquisas = await prisma.projeto.findMany({
      where: { professorId: id },
      orderBy: { inicio: 'desc' },
    });

    if (!pesquisas) {
      return null;
    }
    return pesquisas;
  }

  async listarOrientacoes(id: number, tipo: number) {
    const orientacoes = await prisma.orientacao.findMany({
      where: {
        professorId: id,
        tipo,
      },
      orderBy: { ano: 'desc' },
    });

    const orientacoesDict = {
      concluidas: [] as Orientacao[],
      andamento: [] as Orientacao[],
    };

    if (orientacoes) {
      orientacoes.forEach((orientacao) => {
        if (orientacao.status === 1) {
          orientacoesDict.andamento.push(orientacao);
        } else {
          orientacoesDict.concluidas.push(orientacao);
        }
      });
    }
    return orientacoesDict;
  }

  async listarPremios(id: number) {
    const premios = await prisma.premio.findMany({
      where: { professorId: id },
      orderBy: { ano: 'desc' },
    });

    if (premios) {
      return premios;
    }
    return null;
  }

  // Função auxiliar para perfis (supondo que essa função exista no seu modelo original)
  private perfis(usuario: any) {
    // Implementar lógica de perfis conforme necessário
    return [];
  }
}

export default new DocenteService();
