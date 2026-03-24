import { Request, Response } from 'express';
import path from 'path';
import { getIndexInformations } from '@resources/numerosIcomp/numerosIcompInicio.controller';

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

// Escolha do Layout
const layoutMain = {
  layout: 'numerosIcompMain',
};

const erro404 = async (req: Request, res: Response) => {
  const { lng } = req.query;
  return res.status(404).render(resolveView('error404'), {
    ...layoutMain,
    lng,
    seo: getIndexInformations({
      title: 'Página não encontrada | ICOMP',
      description: 'A página solicitada não foi encontrada.',
      enTitle: 'Page not found | ICOMP',
      enDescription: 'The requested page could not be found.',
      url: '404',
      language: lng as any,
    }),
  });
};

// Redirect Routes

const redirectAlunos = async (req: Request, res: Response) => {
  const { lng } = req.query;
  return res.redirect('/numerosIcomp?lng=' + lng + '#alunos');
};

const redirectProfessores = async (req: Request, res: Response) => {
  const { lng } = req.query;
  return res.redirect('/numerosIcomp/docentes?lng=' + lng);
};

const redirectProjetos = async (req: Request, res: Response) => {
  const { lng } = req.query;
  return res.redirect('/numerosIcomp/projetos?lng=' + lng);
};

const redirectPublicacoes = async (req: Request, res: Response) => {
  const { lng } = req.query;
  return res.redirect('/numerosIcomp/publicacoes?lng=' + lng);
};

export default {
  erro404,
  redirectAlunos,
  redirectProfessores,
  redirectProjetos,
  redirectPublicacoes,
};
