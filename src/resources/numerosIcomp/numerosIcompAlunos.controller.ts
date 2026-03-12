import { Request, Response } from 'express';
import alunoService from '../alunos/aluno.service';
import path from 'path';
import { getIndexInformations } from '@resources/numerosIcomp/numerosIcompInicio.controller';
import language from '../../utils/i18n';

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

// Escolha do Layout
const layoutMain = {
  layout: 'numerosIcompMain',
};

function whichCourse(course: string, lng: any) {
  const i18n = language.i18next;
  if (lng) {
    i18n.changeLanguage(lng);
  }
  switch (course) {
    case 'Processamento de Dados':
      return i18n.t('students.processamentoDeDados');
    case 'Ciência Da Computação':
      return i18n.t('students.cienciaDaComputacao');
    case 'Engenharia de Software / Sistemas de Informação':
      return i18n.t('students.engenhariaESistemas');
    case 'Mestrado':
      return i18n.t('students.mestrado');
    case 'Doutorado':
      return i18n.t('students.doutorado');
  }
}
// Listagem de Alunos
const alunos = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      try {
        const { lng } = req.query;
        const { curso } = req.params;
        const cursos = [
          'processamento-de-dados',
          'ciencia-computacao',
          'engenharia-de-software',
          'mestrado',
          'doutorado',
        ];
        const c = cursos.findIndex((e) => e === curso) + 1;
        if (c) {
          const cursoSearch =
            curso === 'ciencia-computacao'
              ? 'Ciência Da Computação'
              : curso
                  .split('-')
                  .map((p) => {
                    const palavra =
                      p === 'de' ? p : p.charAt(0).toUpperCase() + p.slice(1);
                    return palavra;
                  })
                  .join(' ');
          const alunosInfo = await alunoService.listarTodos(
            cursoSearch === 'Engenharia de Software'
              ? ['Engenharia de Software', 'Sistemas de Informação']
              : cursoSearch,
            1,
          );
          const alunosFormados = alunosInfo.length;
          const cursoForm =
            cursoSearch === 'Engenharia de Software'
              ? cursoSearch + ' / Sistemas de Informação'
              : cursoSearch;
          return res.status(200).render(resolveView('alunos'), {
            lng,
            alunosInfo,
            alunosFormados,
            ...layoutMain,
            curso: cursoForm,
            seo: getIndexInformations({
              title: `Alunos Formados em ${whichCourse(
                cursoForm,
                lng,
              )} | Números ICOMP`,
              description: `Consulte a lista de alunos formados em  ${whichCourse(
                cursoForm,
                lng,
              )} no Instituto  de Computação da UFAM, com informações sobre nome e data de conclusão.`,
              enTitle: `Graduated Students in  ${whichCourse(
                cursoForm,
                lng,
              )} | ICOMP in Numbers`,
              enDescription: `Browse the list of graduated students in ${whichCourse(
                cursoForm,
                lng,
              )} at the Institute of Computing at UFAM, including name and graduation date.`,
              url: 'docentes',
              language: lng as any,
            }),
          });
        } else {
          return res.redirect(`/numerosIcomp?lng=${lng}#alunos`);
        }
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

export default alunos;
