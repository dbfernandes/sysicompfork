import { Request, Response } from 'express';
import UsuarioService from '../services/usuarioService';
import criarURL from '../utils/criarUrl';

const adicionar = async (req: Request, res: Response): Promise<any> => {
  switch (req.method) {
    case 'GET':
      return res.render('usuarios/usuarios-adicionar', {
        nome: req.session.nome,
        csrfToken: req.csrfToken(),
        tipoUsuario: req.session.tipoUsuario
      });
    case 'POST':
      try {
        let {
          nomeCompleto,
          cpf,
          email,
          administrador,
          coordenador,
          secretaria,
          professor,
          senha,
          endereco,
          telefoneResidencial,
          telefoneCelular,
          siape,
          dateDeIngresso,
          unidade,
          turno,
        } = req.body;

        administrador = req.body.administrador === 'on' ? 1 : 0;
        coordenador = req.body.coordenador === 'on' ? 1 : 0;
        secretaria = req.body.secretaria === 'on' ? 1 : 0;
        professor = req.body.professor === 'on' ? 1 : 0;

        await UsuarioService.adicionar(
          nomeCompleto,
          cpf,
          email,
          senha,
          administrador,
          coordenador,
          secretaria,
          professor,
          endereco,
          telefoneResidencial,
          telefoneCelular,
          siape,
          dateDeIngresso,
          unidade,
          turno
        );
        return res.status(201).redirect(
          criarURL('/usuarios/listar', {
            messageTitle: 'Criação de usuário bem-sucedida!',
            message: 'Usuário adicionado no sistema com sucesso.',
            type: 'success',
            tipoUsuario: req.session.tipoUsuario
          })
        );
      } catch (error: unknown) {
        console.log(error);
        return res.status(500).render('usuarios/usuarios-adicionar', {
          nome: req.session.nome,
          csrfToken: req.csrfToken(),
          errors: (error as any).errors, // Type assertion to 'any' to access 'errors' property
          message: 'Não foi possível criar este usuário. Verifique os erros abaixo e tente novamente.',
          type: 'danger',
          messageTitle: 'Criação de usuário indisponível!',
          tipoUsuario: req.session.tipoUsuario
        });
      }
    default:
      return res.status(400).send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};

const deletar = async (req: Request, res: Response): Promise<any> => {
  switch (req.method) {
    case 'POST':
      try {
        const id = req.params.id;
        const userId = Number(id)
        await UsuarioService.alterar(userId, { status: 0 });
        if (req.session.uid === id) {
          req.session.uid = undefined;
        }

        return res.redirect(
          criarURL('/usuarios/listar', {
            message: 'Acesso deste usuário ao sistema foi bloqueado com sucesso.',
            type: 'success',
            messageTitle: 'Bloqueio de usuário bem-sucedido!',
            tipoUsuario: req.session.tipoUsuario
          })
        );
      } catch (error: unknown) {
        console.log(error);
        return res.status(500).redirect(
          criarURL('/usuarios/listar', {
            messageTitle: 'Bloqueio de usuário indisponível!',
            message: 'Não foi possível bloquear este usuário.',
            type: 'danger',
            tipoUsuario: req.session.tipoUsuario
          })
        );
      }
    default:
      return res.status(400).send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};

const restaurar = async (req: Request, res: Response): Promise<any> => {
  switch (req.method) {
    case 'POST':
      try {
        const userId = Number(req.params.id)
        await UsuarioService.alterar(userId, { status: 1 });
        return res.status(200).redirect(
          criarURL('/usuarios/listar', {
            message: 'Acesso deste usuário ao sistema foi restaurado com sucesso.',
            type: 'success',
            messageTitle: 'Desbloqueio de usuário bem-sucedido!',
            tipoUsuario: req.session.tipoUsuario
          })
        );
      } catch (error: unknown) {
        console.log(error);
        return res.status(500).redirect(
          criarURL('/usuarios/listar', {
            message: 'Não foi possível desbloquear este usuário.',
            type: 'danger',
            messageTitle: 'Desbloqueio de usuário indisponível!',
            tipoUsuario: req.session.tipoUsuario
          })
        );
      }
    default:
      return res.status(400).send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};

const listar = async (req: Request, res: Response): Promise<any> => {
  switch (req.method) {
    case 'GET':
      try {
        const { message, type, messageTitle } = req.query;
        const usuarios = await UsuarioService.listarTodos();
        return res.status(200).render('usuarios/usuarios-listar', {
          usuarios,
          csrfToken: req.csrfToken(),
          nome: req.session.nome,
          message,
          type,
          messageTitle,
          tipoUsuario: req.session.tipoUsuario
        });
      } catch (error: unknown) {
        return res.status(500).redirect(
          criarURL('/inicio', {
            message: 'Não foi possível listar os usuários.',
            type: 'danger',
            messageTitle: 'Listagem de usuários indisponível!',
            tipoUsuario: req.session.tipoUsuario
          })
        );
      }
    default:
      return res.status(400).send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};

const visualizar = async (req: Request, res: Response): Promise<any> => {
  switch (req.method) {
    case 'GET':
      try {
        const { message, type, messageTitle } = req.query

        const usuario = await UsuarioService.listarUmUsuario(Number(req.params.id))
        return res.status(200).render('usuarios/usuario-visualizar', {
          usuario,
          csrfToken: req.csrfToken(),
          nome: req.session.nome,
          message,
          type,
          messageTitle,
          tipoUsuario: req.session.tipoUsuario
        });
      } catch (error: unknown) {
        console.log(error);
        return res.status(503).redirect(
          criarURL('/usuarios/listar', {
            message: 'Não foi possível visualizar este usuário.',
            type: 'danger',
            messageTitle: 'Visualização do usuário indisponível!',
            tipoUsuario: req.session.tipoUsuario
          })
        );
      }
    default:
      return res.status(400).send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};

const editar = async (req: Request, res: Response): Promise<any> => {
  switch (req.method) {
    case 'GET':
      try {
        const { message, type, messageTitle } = req.query
        const usuario = await UsuarioService.listarUmUsuario(Number(req.params.id))
        return res.status(200).render('usuarios/usuarios-editar', {
          usuario,
          csrfToken: req.csrfToken(),
          nome: req.session.nome,
          message,
          type,
          messageTitle,
          tipoUsuario: req.session.tipoUsuario
        });
      } catch (error: unknown) {
        console.log(error);
        return res.status(503).redirect(
          criarURL('/usuarios/listar', {
            message: 'Não foi possível abrir formulário de edição para este usuário.',
            type: 'danger',
            messageTitle: 'Edição de usuário indisponível!',
            tipoUsuario: req.session.tipoUsuario
          })
        );
      }
    case 'POST':
      try {
        const administrador = req.body.administrador === 'on' ? 1 : 0;
        const coordenador = req.body.coordenador === 'on' ? 1 : 0;
        const secretaria = req.body.secretaria === 'on' ? 1 : 0;
        const professor = req.body.professor === 'on' ? 1 : 0;
        const dados = {
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
          turno: req.body.turno
        };
        const userId = Number(req.params.id)
        await UsuarioService.alterar(userId, dados);

        return res.status(200).redirect(
          criarURL(`/usuarios/dados/${req.params.id}`, {
            message: 'Dados alterados com sucesso!',
            type: 'success',
            messageTitle: 'Edição de usuário bem-sucedida!',
            tipoUsuario: req.session.tipoUsuario
          })
        );
      } catch (error: unknown) {
        console.log(error);
        const administrador = req.body.administrador === 'on' ? 1 : 0;
        const coordenador = req.body.coordenador === 'on' ? 1 : 0;
        const secretaria = req.body.secretaria === 'on' ? 1 : 0;
        const professor = req.body.professor === 'on' ? 1 : 0;
        const dados = {
          ...req.body,
          administrador,
          coordenador,
          secretaria,
          professor,
          id: req.params.id
        };
        return res.status(500).render('usuarios/usuarios-editar', {
          usuario: dados,
          csrfToken: req.csrfToken(),
          nome: req.session.nome,
          message: 'Não foi possível editar este usuário. Verifique os erros abaixo e tente novamente.',
          type: 'danger',
          messageTitle: 'Edição de usuário indisponível!',
          errors: error,
          tipoUsuario: req.session.tipoUsuario
        });
      }
    default:
      return res.status(400).send('A requisição enviada ao servidor é inválida. Bad Request (400)');
  }
};

export default { adicionar, listar, deletar, visualizar, editar, restaurar };
