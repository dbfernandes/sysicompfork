import { Request, Response } from 'express';

// Escolha do Layout
const layoutMain = {
  layout: 'numerosIcompMain',
};

const erro404 = async (req: Request, res: Response) => {
  const { lng } = req.query;
  return res
    .status(404)
    .render('numerosIcomp/error404', { ...layoutMain, lng });
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
