import { Request, Response } from 'express';
import alunoService from '../alunos/aluno.service';
import publicacaoService from '../publicacao/publicacao.service';
import path from 'path';
import { IndexInformations } from '@resources/numerosIcomp/numerosIcomp.types';

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

// Escolha do Layout
const layoutMain = {
  layout: 'numerosIcompMain',
};
const canonicalUrl =
  process.env.HOST_ICOMP_NUMEROS ?? 'https://numeros.icomp.ufam.edu.br';

type IndexComplete = {
  title: string;
  enTitle?: string;
  description: string;
  enDescription?: string;
  ogImage?: string;
  language?: string;
  url?: string;
};

export function getIndexInformations({
  description,
  title,
  enTitle,
  ogImage,
  language,
  url,
  enDescription,
}: IndexComplete): IndexInformations {
  if (language === 'en') {
    return {
      ogImage: ogImage ?? `${canonicalUrl}/public/img/logo-icomp.png `,
      title: enTitle,
      description: enDescription,
      canonical: url ? `${canonicalUrl}/${url}` : `${canonicalUrl}`,
    };
  }
  return {
    ogImage: ogImage ?? `${canonicalUrl}/public/img/logo-icomp.png `,
    title,
    description,
    canonical: url ? `${canonicalUrl}/${url}` : `${canonicalUrl}`,
  };
}
// Home-page
const inicio = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      try {
        const { lng } = req.query;
        const contagem = await alunoService.contarTodos();
        const contagemPublicacoes = await publicacaoService.contarTodos();

        return res.status(200).render(resolveView('inicio'), {
          ...layoutMain,
          contagem,
          contagemPublicacoes,
          lng,
          seo: getIndexInformations({
            language: lng as any,
            title: `Números Icomp`,
            enTitle: `Numbers Icomp`,
            enDescription:
              'Follow the key indicators of the Computer Science Institute at UFAM, with data on students, alumni, faculty, scientific publications, and projects.',
            description: `Acompanhe os principais indicadores do Instituto de Computação da UFAM, com dados sobre alunos, egressos, docentes, publicações científicas e projetos.`,
          }),
        });
      } catch (error) {
        console.log(error);
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

export default inicio;
