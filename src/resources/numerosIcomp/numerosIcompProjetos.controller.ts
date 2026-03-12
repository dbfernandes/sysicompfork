import { NextFunction, Request, Response } from 'express';
import projetosService from '../projetos/projetos.service';
import path from 'path';
import { getIndexInformations } from '@resources/numerosIcomp/numerosIcompInicio.controller';

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

// Escolha do Layout
const layoutMain = {
  layout: 'numerosIcompMain',
};

// Listagem Projetos
const projetos = async (req: Request, res: Response, next: NextFunction) => {
  switch (req.method) {
    case 'GET':
      try {
        const { lng } = req.query;
        const projetosFiltrados = await projetosService.listarAtuais();

        return res.status(200).render(resolveView('projetos'), {
          lng,
          ...layoutMain,
          projetosFiltrados,
          seo: getIndexInformations({
            title: 'Projetos | Números ICOMP',
            description:
              'Consulte os projetos em andamento do Instituto de Computação da UFAM, com informações sobre período, descrição, financiadores e integrantes.',
            enTitle: 'Projects | ICOMP in Numbers',
            enDescription:
              'Browse ongoing projects from the Institute of Computing at UFAM, including information about duration, description, funding organizations, and team members.',
            url: 'projetos',
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

export default projetos;
