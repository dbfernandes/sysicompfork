import { Orientacao, PrismaClient, Usuario } from '@prisma/client';
import { PublicacoesDict } from './docente.types';

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
        lattesId: true,
        formacao: true,
        formacaoIngles: true,
        resumo: true,
        resumoIngles: true,
        ultimaAtualizacao: true,
        createdAt: true,
        avatares: true,
      },
    });

    if (usuario) {
      const usuarioDict = {
        ...usuario,
        Avatar: usuario.avatares,
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

  async listarPublicacoes(id: number): Promise<PublicacoesDict> {
    const relacoesPublicacoes = await prisma.usuarioPublicacao.findMany({
      where: {
        usuarioId: id,
      },
      include: {
        publicacao: {
          include: {
            tipo: true,
          },
        },
      },
      orderBy: {
        publicacao: {
          ano: 'desc',
        },
      },
    });

    const publicacoesDict: PublicacoesDict = {
      artigosConferencias: [],
      artigosPeriodicos: [],
      livros: [],
      capitulos: [],
    };

    relacoesPublicacoes.forEach((rel) => {
      const publicacao = rel.publicacao;

      // Usando tipoId para categorizar
      switch (publicacao.tipoId) {
        case 1:
          publicacoesDict.artigosConferencias.push(publicacao);
          break;
        case 2:
          publicacoesDict.artigosPeriodicos.push(publicacao);
          break;
        case 3:
          publicacoesDict.livros.push(publicacao);
          break;
        default:
          publicacoesDict.capitulos.push(publicacao);
      }
    });

    return publicacoesDict;
  }

  async listarPesquisas(id: number) {
    const pesquisas = await prisma.projeto.findMany({
      where: { professorId: id },
      orderBy: { dataInicio: 'desc' },
    });

    if (!pesquisas) {
      return null;
    }
    return pesquisas;
  }

  async listarOrientacoes(id: number, tipo: number) {
    const orientacao: Orientacao[] = await prisma.orientacao.findMany({
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

    if (orientacao) {
      orientacao.forEach((orientacao: Orientacao) => {
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
    const premio = await prisma.premio.findMany({
      where: { professorId: id },
      orderBy: { ano: 'desc' },
    });

    if (premio) {
      return premio;
    }
    return null;
  }

  // Função auxiliar para perfis (supondo que essa função exista no seu modelo original)
  private perfis(usuario: Partial<Usuario>) {
    // Implementar lógica de perfis conforme necessário
    return [];
  }
}

export default new DocenteService();
