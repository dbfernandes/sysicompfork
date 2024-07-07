import { PrismaClient } from '@prisma/client';
import { Orientacao, Publicacao } from './docentes.types';

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
        Avatar: true,
      },
    });

    if (usuario) {
      const usuarioDict = {
        ...usuario,
        Avatar: usuario.Avatar,
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
      where: { idUsuario: id },
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
      const publi: Publicacao = rel.Publicacao;
      const publiDict: Publicacao = {
        ...publi,
        TipoPublicacao: publi.TipoPublicacao,
      };
      if (publi.tipo === 1) {
        publicacoesDict.artigosConferencias.push(publiDict);
      } else if (publi.tipo === 2) {
        publicacoesDict.artigosPeriodicos.push(publiDict);
      } else if (publi.tipo === 3) {
        publicacoesDict.livros.push(publiDict);
      } else {
        publicacoesDict.capitulos.push(publiDict);
      }
    });

    return publicacoesDict;
  }

  async listarPesquisas(id: number) {
    const pesquisas = await prisma.projeto.findMany({
      where: { idProfessor: id },
      orderBy: { inicio: 'desc' },
    });

    if (!pesquisas) {
      return null;
    }
    return pesquisas;
  }

  async listarOrientacoes(id: number, tipo: number) {
    const orientacoes: Orientacao[] = await prisma.orientacao.findMany({
      where: {
        idProfessor: id,
        tipo,
      },
      orderBy: { ano: 'desc' },
    });

    const orientacoesDict = {
      concluidas: [] as Orientacao[],
      andamento: [] as Orientacao[],
    };

    if (orientacoes) {
      orientacoes.forEach((orientacao: Orientacao) => {
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
    const premios = await prisma.premios.findMany({
      where: { idProfessor: id },
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
