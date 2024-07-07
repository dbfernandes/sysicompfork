import { Request, Response } from 'express'
import publicacaoService from '../publicacao/publicacao.service'
import { tipoConditions } from './numerosIcomp.types';
import path from 'path'

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName)
}

// Escolha do Layout
const layoutMain = {
  layout: 'numerosIcompMain',
};

// Listagem Publicações
const publicacao = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
  switch (req.method) {
    case 'GET': {
      const { ano, lng } = req.query;
      try {
        const conditions: {
          tipo: number[];
          ano?: string | string[] | undefined;
        } = {
          tipo: [1, 2],
        };
        // Verificação de tipo e conversão apropriada
        if (ano !== undefined) {
          if (typeof ano === 'string') {
            conditions.ano = ano;
          } else if (Array.isArray(ano)) {
            conditions.ano = ano.map((item) => item.toString());
          }
        }
        const publicacoes = await publicacaoService.listarTodos(conditions);

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
    }
    default:
      return res.status(400).send('Método não suportado');
  }
};

export default publicacao;
