import { Request, Response } from 'express'
import usuarioService from "../usuarios/usuario.service";
import criarURL from '../../utils/criarUrl'
import path from 'path'

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const exibirDetalhes = async (req: Request, res: Response) => {
  try {
    const { message, type, messageTitle } = req.query;
    const id = req.session.uid;
    const usuario = await usuarioService.listarUmUsuario(parseInt(id!));
    return res.render(resolveView('perfilDados'), {
      usuario,
      csrfToken: req.csrfToken(),
      nome: req.session.nome,
      message,
      type,
      messageTitle,
      tipoUsuario: req.session.tipoUsuario,
    });
  } catch (error) {
    console.log(error);
    return res.status(503).redirect(
      criarURL('/inicio', {
        message: 'Não foi possível visualizar o seu perfil.',
        type: 'danger',
        messageTitle: 'Visualização do perfil indisponível!',
        tipoUsuario: req.session.tipoUsuario,
      }),
    );
  }
};

// Não usar essa função, pois é redundante.
const editar = async (req: Request, res: Response) => {
  const id = req.session.uid;
  if (req.method === 'GET') {
    try {
      const { message, type, messageTitle } = req.query;
      const usuario = await usuarioService.listarUmUsuario(parseInt(id!));
      return res.render(resolveView('perfilEditar'), {
        usuario,
        csrfToken: req.csrfToken(),
        nome: req.session.nome,
        message,
        type,
        messageTitle,
        tipoUsuario: req.session.tipoUsuario,
      });
    } catch (error) {
      console.log(error);
      return res.status(503).redirect(
        criarURL('/inicio', {
          message:
            'Não foi possível abrir formulário de edição para este usuário.',
          type: 'danger',
          messageTitle: 'Edição de usuário indisponível!',
          tipoUsuario: req.session.tipoUsuario,
        }),
      );
    }
  } else if (req.method === 'POST') {
    const administrador = req.body.administrador === 'on' ? 1 : 0;
    const coordenador = req.body.coordenador === 'on' ? 1 : 0;
    const secretaria = req.body.secretaria === 'on' ? 1 : 0;
    const professor = req.body.professor === 'on' ? 1 : 0;
    const dados = {
      id,
      nomeCompleto: req.body.nomeCompleto,
      cpf: req.body.cpf,
      email: req.body.email,
      senha: req.body.senha,
      administrador,
      coordenador,
      secretaria,
      professor,
      endereco: req.body.endereco,
      telResidencial: req.body.telefoneResidencial,
      telCelular: req.body.telefoneCelular,
      siape: req.body.siape,
      dataIngresso: req.body.dateDeIngresso,
      unidade: req.body.unidade,
      turno: req.body.turno,
    };
    try {
      await usuarioService.alterar(parseInt(id!), dados);
    } catch (error: any) {
      console.log(error);
      dados.id = id;
      return res.status(500).render(resolveView('perfilEditar'), {
        usuario: dados,
        csrfToken: req.csrfToken(),
        nome: req.session.nome,
        message:
          'Não foi possível editar este usuário. Verifique os erros abaixo e tente novamente.',
        type: 'danger',
        messageTitle: 'Edição de usuário indisponível!',
        errors: error.errors,
        tipoUsuario: req.session.tipoUsuario,
      });
    }
    return res.status(200).redirect(
      criarURL('/perfil', {
        message: 'Dados alterados com sucesso!',
        type: 'success',
        messageTitle: 'Edição de usuário bem-sucedida!',
        tipoUsuario: req.session.tipoUsuario,
      }),
    );
  } else {
    return res
      .status(400)
      .send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};
//

const deletar = async (req: Request, res: Response) => {
  if (req.method === 'POST') {
    try {
      const id = req.session.uid;
      await usuarioService.alterar(parseInt(id!), { status: 0 });
      req.session.uid = undefined;
      return res.redirect('/');
    } catch (error) {
      console.log(error);
      return res.status(503).redirect(
        criarURL('/perfil', {
          messageTitle: 'Bloqueio de perfil indisponível!',
          message: 'Não foi possível bloquear o seu perfil.',
          type: 'danger',
          tipoUsuario: req.session.tipoUsuario,
        }),
      );
    }
  } else {
    return res
      .status(400)
      .send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};

export default { exibirDetalhes, editar, deletar };
