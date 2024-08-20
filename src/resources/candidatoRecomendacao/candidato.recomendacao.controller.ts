import path from 'path';
import { Request, Response } from 'express';

import candidatoRecomendacaoService from './candidato.recomendacao.service';
const locals = {
  layout: 'selecaoppgi',
};
function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

export async function adicionar(req: Request, res: Response) {
  switch (req.method) {
    case 'POST':
      candidatoRecomendacaoService.create(req.body).then((aluno) => {
        res.json(aluno);
      });
      break;
    case 'GET':
      const { token } = req.query;
      try {
        const recomendacao =
          await candidatoRecomendacaoService.getRecomendacaoByToken(
            token.toString(),
          );
        if (!recomendacao) {
          return res.render(resolveView('invalidToken'), {
            ...locals,
          });
        }
        return res.render(resolveView('adicionar'), {
          ...locals,
        });
      } catch (error) {
        return res.render(resolveView('adicionar'), {
          ...locals,
        });
      }
  }
}
export default { adicionar };
