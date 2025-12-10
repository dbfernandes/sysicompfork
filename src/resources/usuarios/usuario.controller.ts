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
import { formatNameSession } from '@utils/formatadores';
import { formatDateBR, parsePtBrDate } from '@utils/date';

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}
//criarUsuario
const adicionarUsuario = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  switch (req.method) {
    case 'GET':
      return res
        .status(StatusCodes.OK)
        .render(resolveView('usuariosAdicionar'), {
          nome: req.session.nome,
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
          professorPPGI,
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
          return res
            .status(StatusCodes.BAD_REQUEST)
            .render(resolveView('usuariosAdicionar'), {
              nome: req.session.nome,
              message: 'Este CPF já está cadastrado no sistema.',
              type: 'danger',
              messageTitle: 'Criação de usuário indisponível!',
              tipoUsuario: req.session.tipoUsuario,
            });
        }

        const novoUsuario: CreateUsuarioDto = {
          nomeCompleto,
          cpf,
          email,
          administrador: administrador === 'on' ? 1 : 0,
          coordenador: coordenador === 'on' ? 1 : 0,
          secretaria: secretaria === 'on' ? 1 : 0,
          professor: professor === 'on' ? 1 : 0,
          diretor: diretor === 'on' ? 1 : 0,
          professorPPGI: professorPPGI === 'on' ? 1 : 0,
          senhaHash: senha,
          endereco,
          telCelular: telefoneCelular,
          siape,
          dataIngresso: dateDeIngresso ? parsePtBrDate(dateDeIngresso) : null,
          unidade,
          turno,
          tokenResetSenha: null,
          validadeTokenResetSenha: null,
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
        console.error(error);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .render(resolveView('usuariosAdicionar'), {
            nome: req.session.nome,
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

const bloquearUsuario = async (
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
        console.error(error);
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

const restaurarUsuario = async (
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
        console.error(error);

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

const listarUsuario = async (
  req: Request,
  res: Response,
): Promise<void | Response> => {
  switch (req.method) {
    case 'GET':
      try {
        const { message, type, messageTitle } = req.query;
        const usuarios = await usuarioService.listarTodos();
        usuarios.forEach((usuario: any) => {
          if (
            usuario.administrador ||
            usuario.coordenador ||
            usuario.secretaria ||
            usuario.professor ||
            usuario.diretor ||
            usuario.professorPPGI
          ) {
            usuario.empty = false;
          } else {
            usuario.empty = true;
          }
        });
        return res
          .status(StatusCodes.OK)
          .render(resolveView('usuariosListar'), {
            usuarios,
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

const exibirDetalhesUsuario = async (
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
        return res
          .status(StatusCodes.OK)
          .render(resolveView('usuarioVisualizar'), {
            usuario: {
              ...usuario,
              dataIngresso: formatDateBR(usuario.dataIngresso),
            },
            nome: req.session.nome,
            message,
            type,
            messageTitle,
            tipoUsuario: req.session.tipoUsuario,
          });
      } catch (error: unknown) {
        console.error(error);
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

const editarUsuario = async (
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
        return res
          .status(StatusCodes.OK)
          .render(resolveView('usuariosEditar'), {
            usuario: {
              ...usuario,
              dataIngresso: formatDateBR(usuario.dataIngresso),
            },
            nome: req.session.nome,
            message,
            type,
            messageTitle,
            tipoUsuario: req.session.tipoUsuario,
          });
      } catch (error: unknown) {
        console.error(error);
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
          senha: requestBody.senha || undefined,
          administrador: requestBody.administrador === 'on' ? 1 : 0,
          coordenador: requestBody.coordenador === 'on' ? 1 : 0,
          secretaria: requestBody.secretaria === 'on' ? 1 : 0,
          professor: requestBody.professor === 'on' ? 1 : 0,
          professorPPGI: requestBody.professorPPGI === 'on' ? 1 : 0,

          diretor: requestBody.diretor === 'on' ? 1 : 0, // Adicionando o campo diretor que faltava

          endereco: requestBody.endereco,
          telResidencial: requestBody.telefoneResidencial,
          telCelular: requestBody.telefoneCelular,
          siape: requestBody.siape,
          dataIngresso: requestBody.dateDeIngresso
            ? parsePtBrDate(requestBody.dateDeIngresso)
            : null,
          unidade: requestBody.unidade,
          turno: requestBody.turno,
          tokenResetSenha: null,
          validadeTokenResetSenha: null,
          perfil: null,
          lattesId: null,
          formacao: null,
          formacaoIngles: null,
          resumo: null,
          resumoIngles: null,
          ultimaAtualizacao: null,
        };

        const userId = Number(req.params.id);
        const user = await usuarioService.alterar(userId, updateData);

        const uid = req.session.uid;
        if (user.id === Number(uid)) {
          req.session.nome = formatNameSession(user.nomeCompleto);
          req.session.tipoUsuario = {
            administrador: user.administrador,
            coordenador: user.coordenador,
            secretaria: user.secretaria,
            professor: user.professor,
            diretor: user.diretor,
            professorPPGI: user.professorPPGI,
          };
        }

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
        console.error(error);

        // Recria os dados do formulário para reexibição
        const formData = {
          ...req.body,
          administrador: req.body.administrador === 'on' ? 1 : 0,
          coordenador: req.body.coordenador === 'on' ? 1 : 0,
          secretaria: req.body.secretaria === 'on' ? 1 : 0,
          professor: req.body.professor === 'on' ? 1 : 0,
          id: req.params.id,
        };

        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .render(resolveView('usuariosEditar'), {
            usuario: formData,
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
const verificarUsuarioDiretor = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      try {
        const diretor = await usuarioService.buscarUsuarioPor({ diretor: 1 });
        return res.status(StatusCodes.OK).json({ diretor: !!diretor });
      } catch (error: unknown) {
        console.error(error);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ diretor: false });
      }
    default:
      return res
        .status(StatusCodes.BAD_REQUEST)
        .send('A requisição enviada ao servidor é inválida. Bad Request (400)');
  }
};

export const usuarioController = {
  adicionarUsuario,
  listarUsuario,
  bloquearUsuario,
  exibirDetalhesUsuario,
  editarUsuario,
  restaurarUsuario,
  verificarUsuarioDiretor,
};
