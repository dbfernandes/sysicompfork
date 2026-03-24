import { Request, Response } from 'express';
import publicacaoService from '../publicacao/publicacao.service';
import path from 'path';
import { getIndexInformations } from '@resources/numerosIcomp/numerosIcompInicio.controller';

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
    console.log(publicacoes);
    return res.render(resolveView('publicacoes'), {
      lng,
      ...layoutMain,
      publicacoes,
      ano,
      seo: getIndexInformations({
        title: 'Publicações | Números ICOMP',
        description:
          'Consulte as publicações dos professores do Instituto de Computação da UFAM, com informações sobre título, ano, tipo, local de publicação, autores e ISSN ou ISBN.',
        enTitle: 'Faculty Publications | ICOMP in Numbers',
        enDescription:
          'Browse publications by faculty members of the Institute of Computing at UFAM, including title, year, type, publication venue, authors, and ISSN or ISBN.',
        url: 'publicacoes',
        language: lng as any,
      }),
    });
  } catch (error) {
    return res
      .status(502)
      .send('O Servidor não obteve uma resposta válida. Bad Gateway (502)');
  }
};

export default publicacao;
