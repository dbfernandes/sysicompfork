import { Request, Response } from 'express';
import AlunoService from './aluno.service';
import criarURL from '../../utils/criarUrl';
import path from 'path';

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const inicio = async (req: Request, res: Response): Promise<any> => {
  switch (req.method) {
    case 'GET':
      try {
        const { message, type, messageTitle } = req.query;
        return res.render(resolveView('alunos-gerenciar'), {
          csrfToken: req.csrfToken(),
          nome: req.session.nome,
          usuarioId: req.session.uid,
          message,
          type,
          messageTitle,
          tipoUsuario: req.session.tipoUsuario
        });
      } catch (error) {
        console.log(error);
        return res.status(503).redirect(
          criarURL('/inicio', {
            message: 'Não foi possível acessar o gerenciamento de alunos.',
            type: 'danger',
            messageTitle: 'Gerenciamento de alunos indisponível!',
            tipoUsuario: req.session.tipoUsuario
          })
        );
      }

    default:
      return res.status(400).send('A requisição enviada ao servidor é inválida. Bad Request (400)');
  }
};

const carregar = async (req: Request, res: Response): Promise<Response> => {
  switch (req.method) {
    case 'POST':
      try {
        const { alunos } = req.body;
        await AlunoService.adicionarVarios(alunos);

        return res.status(201).send();
      } catch (error) {
        console.log(error);
        return res.status(500).send();
      }

    default:
      return res.status(400).send('A requisição enviada ao servidor é inválida. Bad Request (400)');
  }
};

export default { inicio, carregar };
