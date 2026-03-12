import { NextFunction, Request, Response } from 'express';
import UsuarioService from '../usuarios/usuario.service';
import DocenteService from '../docente/docente.service';
import path from 'path';
import { getIndexInformations } from '@resources/numerosIcomp/numerosIcompInicio.controller';

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

// Escolha do Layout
const layoutMain = {
  layout: 'numerosIcompMain',
};

const layoutDashboard = {
  layout: 'numerosIcompDashboard',
};

// Listagem de Docentes

const professores = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      try {
        const { lng } = req.query;
        const professores = await UsuarioService.listarTodosPorCondicao({
          professor: 1,
        });
        return res.status(200).render(resolveView('docentes'), {
          lng,
          professores,
          ...layoutMain,
          seo: getIndexInformations({
            title: 'Docentes | Números ICOMP',
            description:
              'Consulte a lista de docentes do Instituto de Computação da UFAM, com informações sobre formação acadêmica e última atualização dos perfis.',
            enTitle: 'Faculty | ICOMP in Numbers',
            enDescription:
              'Browse the faculty list of the Institute of Computing at UFAM, including academic background and the latest profile update information.',
            url: 'docentes',
            language: lng as any,
          }),
        });
      } catch (error) {
        return res
          .status(502)
          .send('O Servidor não obteve uma resposta válida. Bad Gateway (502)');
      }
    default:
      return res
        .status(400)
        .send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};
const urlCanonica =
  process.env.HOST_ICOMP_NUMEROS ?? 'https://numeros.icomp.ufam.edu.br';
// Perfil
const perfil = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      try {
        const { lng } = req.query;
        const { id } = req.params;
        const userId = Number(id);
        const professor = await DocenteService.listarPerfil(userId);
        if (!professor) {
          return res.redirect('/numerosIcomp/docentes?lng=' + lng);
        }
        const avatarUrl = professor.Avatar.length
          ? `${urlCanonica}${professor.Avatar[0].caminho}`
          : null;
        return res.render(resolveView('perfil/perfil'), {
          lng,
          professor,
          ...layoutDashboard,
          urlCanonica,
          seo: getIndexInformations({
            ogImage: avatarUrl,
            title: `${professor.nomeCompleto} | Docente do ICOMP/UFAM | Números ICOMP`,
            description: `Veja o perfil acadêmico de ${professor.nomeCompleto} no Instituto de Computação da UFAM, com resumo, formação, currículo Lattes, e-mail e informações profissionais.`,
            enTitle: `${professor.nomeCompleto} | Faculty at ICOMP/UFAM | ICOMP in Numbers`,
            enDescription: `View the academic profile of ${professor.nomeCompleto} at the Institute of Computing at UFAM, including biography, academic background, Lattes CV, email, and professional information.`,
            url: `docentes/${id}`,
            language: lng as any,
          }),
        });
      } catch (error) {
        return res
          .status(502)
          .send('O Servidor não obteve uma resposta válida. Bad Gateway (502)');
      }
    default:
      return res
        .status(400)
        .send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};

const publicacoes = async (req: Request, res: Response, next: NextFunction) => {
  switch (req.method) {
    case 'GET':
      try {
        const { lng } = req.query;
        const { id } = req.params;
        const userId = Number(id);
        const professor = await DocenteService.listarPerfil(userId);
        if (!professor) {
          return res.redirect('/numerosIcomp/docentes?lng=' + lng);
        }
        const publicacoes = await DocenteService.listarPublicacoes(userId);

        const currentYear = new Date().getFullYear();
        const anos = [...Array(11).keys()].map((i) => i + currentYear - 10);
        const graficoArtigosConferencias = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const graficoArtigosPeriodicos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        publicacoes.artigosConferencias.forEach((artigo) => {
          const idx = anos.findIndex((e) => e === artigo.ano);
          if (idx === -1) {
            graficoArtigosConferencias[0] = graficoArtigosConferencias[0] + 1;
          } else {
            graficoArtigosConferencias[idx] =
              graficoArtigosConferencias[idx] + 1;
          }
        });

        publicacoes.artigosPeriodicos.forEach((artigo) => {
          const idx = anos.findIndex((e) => e === artigo.ano);
          if (idx === -1) {
            graficoArtigosPeriodicos[0] = graficoArtigosPeriodicos[0] + 1;
          } else {
            graficoArtigosPeriodicos[idx] = graficoArtigosPeriodicos[idx] + 1;
          }
        });
        const avatarUrl = professor.Avatar.length
          ? `${urlCanonica}${professor.Avatar[0].caminho}`
          : null;
        return res.render(resolveView('perfil/perfil-publicacao'), {
          lng,
          professor,
          publicacoes,
          paperConfLen: publicacoes.artigosConferencias.length,
          paperPerLen: publicacoes.artigosPeriodicos.length,
          bookLen: publicacoes.livros.length,
          chapterLen: publicacoes.capitulos.length,
          ...layoutDashboard,
          anos,
          graficoArtigosConferencias,
          graficoArtigosPeriodicos,
          seo: getIndexInformations({
            ogImage: avatarUrl,
            title: `Publicações de ${professor.nomeCompleto} | Números ICOMP`,
            description: `Consulte as publicações de ${professor.nomeCompleto} no Instituto de Computação da UFAM, incluindo artigos em conferências e periódicos, livros e capítulos publicados.`,
            enTitle: `Publications of ${professor.nomeCompleto} | ICOMP in Numbers`,
            enDescription: `Browse the publications of ${professor.nomeCompleto} at the Institute of Computing at UFAM, including conference papers, journal articles, books, and book chapters.`,
            url: `docentes/${id}/projetos`,
            language: lng as any,
          }),
        });
      } catch (error) {
        next(error);
      }
      break;
    default:
      return res
        .status(400)
        .send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};

const pesquisa = async (req: Request, res: Response, next: NextFunction) => {
  switch (req.method) {
    case 'GET':
      try {
        const { lng } = req.query;
        const { id } = req.params;
        const userId = Number(id);
        const professor = await DocenteService.listarPerfil(userId);
        if (!professor) {
          return res.redirect('/numerosIcomp/docentes?lng=' + lng);
        }
        const projetos = await DocenteService.listarPesquisas(userId);
        if (!projetos) {
          return res.status(404).send('Não encontrou as pesquisas');
        }
        const currentYear = new Date().getFullYear();
        const anos = [...Array(10).keys()].map((i) => i + currentYear - 9);

        const graficoProjetos = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        projetos.forEach((projeto) => {
          const anosProjeto =
            projeto.dataFim === 0 || projeto.dataFim === null
              ? [...Array(currentYear - projeto.dataInicio).keys()].map(
                  (i) =>
                    i + currentYear - (currentYear - projeto.dataInicio - 1),
                )
              : [...Array(projeto.dataFim - projeto.dataInicio).keys()].map(
                  (i) =>
                    i +
                    projeto.dataFim -
                    (projeto.dataFim - projeto.dataInicio - 1),
                );
          anosProjeto.forEach((ano) => {
            const idx = anos.findIndex((e) => e === ano);
            if (idx > -1) {
              graficoProjetos[idx] = graficoProjetos[idx] + 1;
            }
          });
        });

        const avatarUrl = professor.Avatar.length
          ? `${urlCanonica}${professor.Avatar[0].caminho}`
          : null;

        return res.render(resolveView('perfil/perfil-projeto'), {
          lng,
          professor,
          projetos,
          projetosLen: projetos.length,
          ...layoutDashboard,
          anos,
          graficoProjetos,
          seo: getIndexInformations({
            ogImage: avatarUrl,
            title: `Projetos de Pesquisa de ${professor.nomeCompleto} | Números ICOMP`,
            description: `Consulte os projetos de pesquisa de ${professor.nomeCompleto} no Instituto de Computação da UFAM, com informações sobre período, descrição, integrantes, financiadores e participação do docente.`,
            enTitle: `Research Projects of ${professor.nomeCompleto} | ICOMP in Numbers`,
            enDescription: `Browse the research projects of ${professor.nomeCompleto} at the Institute of Computing at UFAM, including period, description, team members, funding institutions, and the faculty member’s role.`,
            url: `docentes/${id}/projetos`,
            language: lng as any,
          }),
        });
      } catch (error) {
        next(error);
      }
      break;
    default:
      return res
        .status(400)
        .send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};

function getOrientationTypeLabel(tipo: string, lng?: string) {
  const isEn = lng === 'en';

  if (isEn) {
    if (tipo === 'graduacao') return 'Undergraduate';
    if (tipo === 'mestrado') return "Master's";
    if (tipo === 'doutorado') return 'Doctoral';
    return 'Academic';
  }

  if (tipo === 'graduacao') return 'Graduação';
  if (tipo === 'mestrado') return 'Mestrado';
  if (tipo === 'doutorado') return 'Doutorado';
  return 'Acadêmicas';
}

const orientacao = async (req: Request, res: Response, next: NextFunction) => {
  switch (req.method) {
    case 'GET':
      try {
        const { lng } = req.query;
        const { id, tipo } = req.params;
        const userId = Number(id);
        const tipos = ['graduacao', 'mestrado', 'doutorado'];
        const t = tipos.findIndex((e) => e === tipo) + 1;
        if (t === 0) {
          return res.redirect('/numerosIcomp/docentes?lng=' + lng);
        }
        const professor = await DocenteService.listarPerfil(userId);
        if (!professor) {
          return res.redirect('/numerosIcomp/docentes?lng=' + lng);
        }
        const orientacoes = await DocenteService.listarOrientacoes(userId, t);

        const currentYear = new Date().getFullYear();
        const anos = [...Array(10).keys()].map((i) => i + currentYear - 9);

        const graficoOrientacoesConcluidas = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const graficoOrientacoesAndamento = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        orientacoes.concluidas.forEach((orientacao) => {
          const idx = anos.findIndex((e) => e === orientacao.ano);
          if (idx === -1) {
            graficoOrientacoesConcluidas[0] =
              graficoOrientacoesConcluidas[0] + 1;
          } else {
            graficoOrientacoesConcluidas[idx] =
              graficoOrientacoesConcluidas[idx] + 1;
          }
        });

        orientacoes.andamento.forEach((orientacao) => {
          const idx = anos.findIndex((e) => e === orientacao.ano);
          if (idx === -1) {
            graficoOrientacoesAndamento[0] = graficoOrientacoesAndamento[0] + 1;
          } else {
            graficoOrientacoesAndamento[idx] =
              graficoOrientacoesAndamento[idx] + 1;
          }
        });

        const tipoLabel = getOrientationTypeLabel(tipo, lng as any);
        const avatarUrl = professor.Avatar.length
          ? `${urlCanonica}${professor.Avatar[0].caminho}`
          : null;
        return res.render(resolveView('perfil/perfil-orientacao'), {
          lng,
          professor,
          orientacoes,
          orientacoesConcluidasLen: orientacoes.concluidas.length,
          orientacoesAndamentoLen: orientacoes.andamento.length,
          ...layoutDashboard,
          anos,
          tipo:
            tipo === 'graduacao'
              ? 'Graduação'
              : tipo.charAt(0).toUpperCase() + tipo.slice(1),
          graficoOrientacoesAndamento,
          graficoOrientacoesConcluidas,
          seo: getIndexInformations({
            ogImage: avatarUrl,
            title: `Orientações de ${tipoLabel} de ${professor.nomeCompleto} | Números ICOMP`,
            description: `Consulte as orientações de ${tipoLabel.toLowerCase()} de ${professor.nomeCompleto} no Instituto de Computação da UFAM, com informações sobre trabalhos em andamento e concluídos.`,
            enTitle: `${tipoLabel} Supervision of ${professor.nomeCompleto} | ICOMP in Numbers`,
            enDescription: `Browse the ${tipoLabel.toLowerCase()} supervision records of ${professor.nomeCompleto} at the Institute of Computing at UFAM, including ongoing and completed advisement activities.`,
            url: `docentes/${id}/orientacoes/${tipo}`,
            language: lng as any,
          }),
        });
      } catch (error) {
        next(error);
      }
      break;
    default:
      return res
        .status(400)
        .send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};

const premios = async (req: Request, res: Response, next: NextFunction) => {
  switch (req.method) {
    case 'GET':
      try {
        const { lng } = req.query;
        const { id } = req.params;
        const userId = Number(id);
        const professor = await DocenteService.listarPerfil(userId);
        if (!professor) {
          return res.redirect('/numerosIcomp/docentes?lng=' + lng);
        }
        const premios = await DocenteService.listarPremios(userId);
        if (!premios) {
          return res.status(404).send('Não encontrou premios');
        }
        const avatarUrl = professor.Avatar.length
          ? `${urlCanonica}${professor.Avatar[0].caminho}`
          : null;
        return res.render(resolveView('perfil/perfil-premio'), {
          lng,
          premios,
          professor,
          premiosLen: premios.length,
          ...layoutDashboard,
          seo: getIndexInformations({
            ogImage: avatarUrl,
            title: `Prêmios de ${professor.nomeCompleto} | Números ICOMP`,
            description: `Consulte os prêmios e distinções acadêmicas de ${professor.nomeCompleto} no Instituto de Computação da UFAM, com informações sobre título, entidade e ano.`,
            enTitle: `Awards of ${professor.nomeCompleto} | ICOMP in Numbers`,
            enDescription: `Browse the academic awards and distinctions of ${professor.nomeCompleto} at the Institute of Computing at UFAM, including title, awarding institution, and year.`,
            url: `docentes/premios`,
            language: lng as any,
          }),
        });
      } catch (error) {
        next(error);
      }
      break;
    default:
      return res
        .status(400)
        .send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};

export default {
  professores,
  perfil,
  publicacoes,
  pesquisa,
  orientacao,
  premios,
};
