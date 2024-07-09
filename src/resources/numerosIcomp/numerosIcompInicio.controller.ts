import { Request, Response } from 'express'
import alunoService from '../alunos/aluno.service'
import publicacaoService from '../publicacao/publicacao.service'
import path from 'path'
function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName)
}

// Escolha do Layout
const layoutMain = {
  layout: 'numerosIcompMain',
};

// Home-page

const inicio = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      try {
        const { lng } = req.query
        const contagem = await alunoService.contarTodos()
        const contagemPublicacoes = await publicacaoService.contarTodos()
        return res.status(200).render(resolveView('inicio'), {
          ...layoutMain,
          contagem,
          contagemPublicacoes,
          lng,
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
