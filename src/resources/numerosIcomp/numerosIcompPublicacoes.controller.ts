import { Request, Response } from 'express';
import publicacaoService from '../publicacao/publicacao.service';
import path from 'path';

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const layoutMain = {
  layout: 'numerosIcompMain',
};

const publicacao = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  if (req.method !== 'GET') {
    return res.status(400).send('Método não suportado');
  }

  try {
    const { ano, lng } = req.query;
    const publicacoes = await publicacaoService.listarTodos([1, 2], ano);

    return res.render(resolveView('publicacoes'), {
      lng,
      ...layoutMain,
      publicacoes,
      ano,
    });
  } catch (error) {
    return res
      .status(502)
      .send('O Servidor não obteve uma resposta válida. Bad Gateway (502)');
  }
};

export default publicacao;
