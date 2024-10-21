import { Request, Response } from 'express';
import usuarioService from './usuario.service';
import criarURL from '../../utils/criarUrl';

import path from "path";

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const adicionar = async (req: Request, res: Response): Promise<any> => {
  switch (req.method) {
    case 'GET':
      return res.render(resolveView('usuarios-adicionar'), {
        nome: req.session.nome,
        csrfToken: req.csrfToken(),
        tipoUsuario: req.session.tipoUsuario,
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
          diretor,
          senha,
          endereco,
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
        diretor = req.body.diretor === 'on' ? 1 : 0;
        const novoUsuario = {
          nomeCompleto,
          cpf,
          email,
          administrador,
          coordenador,
          secretaria,
          professor,
          diretor,
          senhaHash: senha,
          endereco,
          telCelular: telefoneCelular,
          siape,
          dataIngresso: dateDeIngresso,
          unidade,
          turno,
          tokenResetarSenha: null,
          validadeTokenResetadaSenha: null,
          status: 0,
          perfil: null,
          idLattes: null,
          formacao: null,
          formacaoIngles: null,
          resumo: null,
          resumoIngles: null,
          ultimaAtualizacao: null
        }
        await usuarioService.adicionar(novoUsuario);
        return res.status(201).redirect(
          criarURL('/usuarios/listar', {
            messageTitle: 'Criação de usuário bem-sucedida!',
            message: 'Usuário adicionado no sistema com sucesso.',
            type: 'success',
            tipoUsuario: req.session.tipoUsuario,
          }),
        );
      } catch (error: unknown) {
        console.log(error);
        return res.status(500).render(resolveView('usuarios-adicionar'), {
          nome: req.session.nome,
          csrfToken: req.csrfToken(),
          errors: (error as any).errors, // Type assertion to 'any' to access 'errors' property
          message:
            'Não foi possível criar este usuário. Verifique os erros abaixo e tente novamente.',
          type: 'danger',
          messageTitle: 'Criação de usuário indisponível!',
          tipoUsuario: req.session.tipoUsuario,
        });
      }
    default:
      return res
        .status(400)
        .send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};

const deletar = async (req: Request, res: Response): Promise<any> => {
  switch (req.method) {
    case 'POST':
      try {
        const id = req.params.id;
        const userId = Number(id);
        await usuarioService.alterar(userId, { status: 0 });
        if (req.session.uid === id) {
          req.session.uid = undefined;
        }

        return res.redirect(
          criarURL('/usuarios/listar', {
            message:
              'Acesso deste usuário ao sistema foi bloqueado com sucesso.',
            type: 'success',
            messageTitle: 'Bloqueio de usuário bem-sucedido!',
            tipoUsuario: req.session.tipoUsuario,
          }),
        );
      } catch (error: unknown) {
        console.log(error);
        return res.status(500).redirect(
          criarURL('/usuarios/listar', {
            messageTitle: 'Bloqueio de usuário indisponível!',
            message: 'Não foi possível bloquear este usuário.',
            type: 'danger',
            tipoUsuario: req.session.tipoUsuario,
          }),
        );
      }
    default:
      return res
        .status(400)
        .send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};

const restaurar = async (req: Request, res: Response): Promise<any> => {
  switch (req.method) {
    case 'POST':
      try {
        const userId = Number(req.params.id);
        await usuarioService.alterar(userId, { status: 1 });
        return res.status(200).redirect(
          criarURL('/usuarios/listar', {
            message:
              'Acesso deste usuário ao sistema foi restaurado com sucesso.',
            type: 'success',
            messageTitle: 'Desbloqueio de usuário bem-sucedido!',
            tipoUsuario: req.session.tipoUsuario,
          }),
        );
      } catch (error: unknown) {
        console.log(error);
        return res.status(500).redirect(
          criarURL('/usuarios/listar', {
            message: 'Não foi possível desbloquear este usuário.',
            type: 'danger',
            messageTitle: 'Desbloqueio de usuário indisponível!',
            tipoUsuario: req.session.tipoUsuario,
          }),
        );
      }
    default:
      return res
        .status(400)
        .send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};

const listar = async (req: Request, res: Response): Promise<any> => {
  switch (req.method) {
    case 'GET':
      try {
        const { message, type, messageTitle } = req.query;
        const usuarios = await usuarioService.listarTodos();
        usuarios.forEach((usuario) => {
          if (usuario.administrador === 1) {
            usuario.perfil += " administrador";
          }
          if (usuario.coordenador === 1) {
            usuario.perfil += " coordenador";
          }
          if (usuario.secretaria === 1) {
            usuario.perfil += " secretaria";
          }
          if (usuario.professor === 1) {
            usuario.perfil += " professor";
          }

        });
        return res.status(200).render(resolveView('usuarios-listar'), {
          usuarios,
          csrfToken: req.csrfToken(),
          nome: req.session.nome,
          message,
          type,
          messageTitle,
          tipoUsuario: req.session.tipoUsuario,
        });
      } catch (error: unknown) {
        return res.status(500).redirect(
          criarURL('/inicio', {
            message: 'Não foi possível listar os usuários.',
            type: 'danger',
            messageTitle: 'Listagem de usuários indisponível!',
            tipoUsuario: req.session.tipoUsuario,
          }),
        );
      }
    default:
      return res
        .status(400)
        .send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};

const visualizar = async (req: Request, res: Response): Promise<any> => {
  switch (req.method) {
    case 'GET':
      try {
        const { message, type, messageTitle } = req.query;

        const usuario = await usuarioService.listarUmUsuario(Number(req.params.id))
        return res.status(200).render(resolveView('usuario-visualizar'), {
          usuario,
          csrfToken: req.csrfToken(),
          nome: req.session.nome,
          message,
          type,
          messageTitle,
          tipoUsuario: req.session.tipoUsuario,
        });
      } catch (error: unknown) {
        console.log(error);
        return res.status(503).redirect(
          criarURL('/usuarios/listar', {
            message: 'Não foi possível visualizar este usuário.',
            type: 'danger',
            messageTitle: 'Visualização do usuário indisponível!',
            tipoUsuario: req.session.tipoUsuario,
          }),
        );
      }
    default:
      return res
        .status(400)
        .send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};

const editar = async (req: Request, res: Response): Promise<any> => {
  switch (req.method) {
    case 'GET':
      try {
        const { message, type, messageTitle } = req.query
        const usuario = await usuarioService.listarUmUsuario(Number(req.params.id))
        return res.status(200).render(resolveView('usuarios-editar'), {
          usuario,
          csrfToken: req.csrfToken(),
          nome: req.session.nome,
          message,
          type,
          messageTitle,
          tipoUsuario: req.session.tipoUsuario,
        });
      } catch (error: unknown) {
        console.log(error);
        return res.status(503).redirect(
          criarURL('/usuarios/listar', {
            message:
              'Não foi possível abrir formulário de edição para este usuário.',
            type: 'danger',
            messageTitle: 'Edição de usuário indisponível!',
            tipoUsuario: req.session.tipoUsuario,
          }),
        );
      }
    case 'POST':
      try {
        const administrador = req.body.administrador === 'on' ? 1 : 0;
        const coordenador = req.body.coordenador === 'on' ? 1 : 0;
        const secretaria = req.body.secretaria === 'on' ? 1 : 0;
        const professor = req.body.professor === 'on' ? 1 : 0;
        const diretor = req.body.diretor === 'on' ? 1 : 0;
        console.log(diretor);
        const dados = {
          nomeCompleto: req.body.nomeCompleto,
          cpf: req.body.cpf,
          email: req.body.email,
          senhaHash: req.body.senha,
          administrador,
          coordenador,
          secretaria,
          professor,
          diretor,
          endereco: req.body.endereco,
          telResidencial: req.body.telefoneResidencial,
          telCelular: req.body.telefoneCelular,
          siape: req.body.siape,
          dataIngresso: req.body.dateDeIngresso,
          unidade: req.body.unidade,
          turno: req.body.turno,
          tokenResetarSenha: null,
          validadeTokenResetadaSenha: null,
          status: 0,
          perfil: null,
          idLattes: null,
          formacao: null,
          formacaoIngles: null,
          resumo: null,
          resumoIngles: null,
          ultimaAtualizacao: null
        };
        const userId = Number(req.params.id);
        await usuarioService.alterar(userId, dados);

        return res.status(200).redirect(
          criarURL(`/usuarios/dados/${req.params.id}`, {
            message: 'Dados alterados com sucesso!',
            type: 'success',
            messageTitle: 'Edição de usuário bem-sucedida!',
            tipoUsuario: req.session.tipoUsuario,
          }),
        );
      } catch (error: unknown) {
        console.log(error);
        const administrador = req.body.administrador === 'on' ? 1 : 0;
        const coordenador = req.body.coordenador === 'on' ? 1 : 0;
        const secretaria = req.body.secretaria === 'on' ? 1 : 0;
        const professor = req.body.professor === 'on' ? 1 : 0;
        const diretor = req.body.diretor === 'on' ? 1 : 0;
        const dados = {
          ...req.body,
          administrador,
          coordenador,
          secretaria,
          professor,
          diretor,
          id: req.params.id,
        };
        return res.status(500).render(resolveView('usuarios-editar'), {
          usuario: dados,
          csrfToken: req.csrfToken(),
          nome: req.session.nome,
          message:
            'Não foi possível editar este usuário. Verifique os erros abaixo e tente novamente.',
          type: 'danger',
          messageTitle: 'Edição de usuário indisponível!',
          errors: error,
          tipoUsuario: req.session.tipoUsuario,
        });
      }
    default:
      return res
        .status(400)
        .send('A requisição enviada ao servidor é inválida. Bad Request (400)');
  }
};

const verificarDiretorExistente = async (req: Request, res: Response): Promise<any> => {
  switch (req.method) {
    case 'GET':
      try {
        const diretor = await usuarioService.buscarUsuarioPor({ diretor: 1 });
        return res.status(200).json({ diretor: !!diretor });
      } catch (error: unknown) {
        console.log(error);
        return res.status(500).json({ diretor: false });
      }
    default:
      return res
        .status(400)
        .send('A requisição enviada ao servidor é inválida. Bad Request (400)');
  }
};

export default { adicionar, listar, deletar, visualizar, editar, restaurar, verificarDiretorExistente };
