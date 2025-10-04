import { NextFunction, Request, Response } from 'express';
import UsuarioService from '../usuarios/usuario.service';
import DocenteService from '../docente/docente.service';
import path from 'path';

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
        return res.render(resolveView('perfil/perfil'), {
          lng,
          professor,
          ...layoutDashboard,
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
        return res.render(resolveView('perfil/perfil-projeto'), {
          lng,
          professor,
          projetos,
          projetosLen: projetos.length,
          ...layoutDashboard,
          anos,
          graficoProjetos,
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

        return res.render(resolveView('perfil/perfil-premio'), {
          lng,
          premios,
          professor,
          premiosLen: premios.length,
          ...layoutDashboard,
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
