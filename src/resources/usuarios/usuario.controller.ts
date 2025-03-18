import { Request, Response } from 'express';
import usuarioService from './usuario.service';
import criarURL from '../../utils/criarUrl';

import path from 'path';
import { StatusCodes } from 'http-status-codes';
import {
  CreateUsuarioDto,
  UpdateUsuarioDto,
  usuarioBodyDTO,
} from './usuario.types';

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}
//criarUsuario
const adicionar = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  switch (req.method) {
    case 'GET':
      return res.status(StatusCodes.OK).render(resolveView('usuariosAdicionar'), {
        nome: req.session.nome,
        csrfToken: req.csrfToken(),
        tipoUsuario: req.session.tipoUsuario,
      });

    case 'POST':
      try {
        const {
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
        } = req.body as usuarioBodyDTO;

        const cpfExiste = await usuarioService.verificaCpf(cpf);
        if (cpfExiste) {
          return res.status(StatusCodes.BAD_REQUEST).render(resolveView('usuariosAdicionar'), {
            nome: req.session.nome,
            csrfToken: req.csrfToken(),
            message:
              'Este CPF já está cadastrado no sistema.',
            type: 'danger',
            messageTitle: 'Criação de usuário indisponível!',
            tipoUsuario: req.session.tipoUsuario,
          })
        }

        const novoUsuario: CreateUsuarioDto = {
          nomeCompleto,
          cpf,
          email,
          administrador: administrador === 'on' ? 1 : 0,
          coordenador: coordenador === 'on' ? 1 : 0,
          secretaria: secretaria === 'on' ? 1 : 0,
          professor: professor === 'on' ? 1 : 0,
          diretor: diretor === 'on' ? 1 : 0, // Adicionando o campo diretor que faltava
          senhaHash: senha,
          endereco,
          telCelular: telefoneCelular,
          siape,
          dataIngresso: dateDeIngresso ? new Date(dateDeIngresso) : null,
          unidade,
          turno,
          tokenResetSenha: null,
          validadeTokenResetSenha: null,
          status: 0,
          perfil: null,
          lattesId: null,
          formacao: null,
          formacaoIngles: null,
          resumo: null,
          resumoIngles: null,
          ultimaAtualizacao: null,
          telResidencial: null,
        };

        await usuarioService.adicionar(novoUsuario);

        return res.status(StatusCodes.CREATED).redirect(
          criarURL('/usuarios/listar', {
            messageTitle: 'Criação de usuário bem-sucedida!',
            message: 'Usuário adicionado no sistema com sucesso.',
            type: 'success',
            tipoUsuario: req.session.tipoUsuario,
          }),
        );
      } catch (error: unknown) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render(resolveView('usuariosAdicionar'), {
          nome: req.session.nome,
          csrfToken: req.csrfToken(),
          errors: (error as { errors: Record<string, { message: string }> })
            .errors,
          message:
            'Não foi possível criar este usuário. Verifique os erros abaixo e tente novamente.',
          type: 'danger',
          messageTitle: 'Criação de usuário indisponível!',
          tipoUsuario: req.session.tipoUsuario,
        });
      }

    default:
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};
//bloquearUsuario
const bloquear = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
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
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).redirect(
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
        .status(StatusCodes.BAD_REQUEST)
        .send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};

const restaurar = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  switch (req.method) {
    case 'POST': {
      try {
        const userId = Number(req.params.id);
        const updateData: UpdateUsuarioDto = {
          status: 1,
        };

        await usuarioService.alterar(userId, updateData);

        const successParams = {
          message:
            'Acesso deste usuário ao sistema foi restaurado com sucesso.',
          type: 'success',
          messageTitle: 'Desbloqueio de usuário bem-sucedido!',
          tipoUsuario: req.session.tipoUsuario,
        };

        return res
          .status(StatusCodes.OK)
          .redirect(criarURL('/usuarios/listar', successParams));
      } catch (error: unknown) {
        console.log(error);

        const errorParams = {
          message: 'Não foi possível desbloquear este usuário.',
          type: 'danger',
          messageTitle: 'Desbloqueio de usuário indisponível!',
          tipoUsuario: req.session.tipoUsuario,
        };

        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .redirect(criarURL('/usuarios/listar', errorParams));
      }
    }

    default:
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};

const listar = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  switch (req.method) {
    case 'GET':
      try {
        const { message, type, messageTitle } = req.query;
        const usuarios = await usuarioService.listarTodos();
        usuarios.forEach((usuario) => {
          if (usuario.administrador === 1) {
            usuario.perfil += ' administrador';
          }
          if (usuario.coordenador === 1) {
            usuario.perfil += ' coordenador';
          }
          if (usuario.secretaria === 1) {
            usuario.perfil += ' secretaria';
          }
          if (usuario.professor === 1) {
            usuario.perfil += ' professor';
          }
        });
        return res.status(StatusCodes.OK).render(resolveView('usuariosListar'), {
          usuarios,
          csrfToken: req.csrfToken(),
          nome: req.session.nome,
          message,
          type,
          messageTitle,
          tipoUsuario: req.session.tipoUsuario,
        });
      } catch (error: unknown) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).redirect(
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
        .status(StatusCodes.BAD_REQUEST)
        .send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};
//detalhesUsuario
const exibirDetalhes = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  switch (req.method) {
    case 'GET':
      try {
        const { message, type, messageTitle } = req.query;

        const usuario = await usuarioService.listarUmUsuario(
          Number(req.params.id),
        );
        return res.status(StatusCodes.OK).render(resolveView('usuarioVisualizar'), {
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
        return res.status(StatusCodes.SERVICE_UNAVAILABLE).redirect(
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
        .status(StatusCodes.BAD_REQUEST)
        .send('A requisição enviada ao servidor é invalida. Bad Request (400)');
  }
};
//editarUsuario
const editar = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  switch (req.method) {
    case 'GET': {
      try {
        const { message, type, messageTitle } = req.query;
        const usuario = await usuarioService.listarUmUsuario(
          Number(req.params.id),
        );
        return res.status(StatusCodes.OK).render(resolveView('usuariosEditar'), {
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
        const errorParams = {
          message:
            'Não foi possível abrir formulário de edição para este usuário.',
          type: 'danger',
          messageTitle: 'Edição de usuário indisponível!',
          tipoUsuario: req.session.tipoUsuario,
        };

        return res
          .status(StatusCodes.SERVICE_UNAVAILABLE)
          .redirect(criarURL('/usuarios/listar', errorParams));
      }
    }

    case 'POST': {
      try {
        const requestBody = req.body as usuarioBodyDTO;

        const updateData: UpdateUsuarioDto = {
          nomeCompleto: requestBody.nomeCompleto,
          cpf: requestBody.cpf,
          email: requestBody.email,
          senhaHash: requestBody.senha || undefined,
          administrador: requestBody.administrador === 'on' ? 1 : 0,
          coordenador: requestBody.coordenador === 'on' ? 1 : 0,
          secretaria: requestBody.secretaria === 'on' ? 1 : 0,
          professor: requestBody.professor === 'on' ? 1 : 0,
          endereco: requestBody.endereco,
          telResidencial: requestBody.telefoneResidencial,
          telCelular: requestBody.telefoneCelular,
          siape: requestBody.siape,
          dataIngresso: requestBody.dateDeIngresso
            ? new Date(requestBody.dateDeIngresso)
            : null,
          unidade: requestBody.unidade,
          turno: requestBody.turno,
          tokenResetSenha: null,
          validadeTokenResetSenha: null,
          status: 0,
          perfil: null,
          lattesId: null,
          formacao: null,
          formacaoIngles: null,
          resumo: null,
          resumoIngles: null,
          ultimaAtualizacao: null,
        };

        const userId = Number(req.params.id);
        await usuarioService.alterar(userId, updateData);

        const successParams = {
          message: 'Dados alterados com sucesso!',
          type: 'success',
          messageTitle: 'Edição de usuário bem-sucedida!',
          tipoUsuario: req.session.tipoUsuario,
        };

        return res
          .status(StatusCodes.OK)
          .redirect(criarURL(`/usuarios/dados/${userId}`, successParams));
      } catch (error: unknown) {
        console.log(error);

        // Recria os dados do formulário para reexibição
        const formData = {
          ...req.body,
          administrador: req.body.administrador === 'on' ? 1 : 0,
          coordenador: req.body.coordenador === 'on' ? 1 : 0,
          secretaria: req.body.secretaria === 'on' ? 1 : 0,
          professor: req.body.professor === 'on' ? 1 : 0,
          id: req.params.id,
        };

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render(resolveView('usuariosEditar'), {
          usuario: formData,
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
    }

    default:
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send('A requisição enviada ao servidor é inválida. Bad Request (400)');
  }
};
//verificarUsuarioDiretor
const verificarDiretor = async (
  req: Request,
  res: Response,
): Promise<any> => {
  switch (req.method) {
    case 'GET':
      try {
        const diretor = await usuarioService.buscarUsuarioPor({ diretor: 1 });
        return res.status(StatusCodes.OK).json({ diretor: !!diretor });
      } catch (error: unknown) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ diretor: false });
      }
    default:
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send('A requisição enviada ao servidor é inválida. Bad Request (400)');
  }
};

export const usuarioController = {
  adicionar,
  listar,
  bloquear,
  exibirDetalhes,
  editar,
  restaurar,
  verificarDiretor,
};
