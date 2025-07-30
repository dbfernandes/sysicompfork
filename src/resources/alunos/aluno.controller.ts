// aluno.controller.ts
import { Request, Response } from 'express';
import AlunoService from './aluno.service';
import criarURL from '../../utils/criarUrl';
import path from 'path';
import { CreateAlunoDto } from './aluno.types';

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

//Controller responsável por gerenciar operações relacionadas a alunos

class AlunoController {
  // Exibe a página de gerenciamento de alunos
  async exibirPaginaGerenciamento(
    req: Request,
    res: Response,
  ): Promise<Response | void> {
    try {
      // Extrair parâmetros da query para mensagens de feedback
      const { message, type, messageTitle } = req.query;

      // Renderizar página de gerenciamento
      return res.render(resolveView('alunosGerenciar'), {
        nome: req.session.nome,
        usuarioId: req.session.uid,
        message,
        type,
        messageTitle,
        tipoUsuario: req.session.tipoUsuario,
      });
    } catch (error) {
      console.error('Erro ao exibir página de gerenciamento:', error);

      // Redirecionar para página inicial em caso de erro
      return res.status(503).redirect(
        criarURL('/inicio', {
          message: 'Não foi possível acessar o gerenciamento de alunos.',
          type: 'danger',
          messageTitle: 'Gerenciamento de alunos indisponível!',
          tipoUsuario: req.session.tipoUsuario
            ? JSON.stringify(req.session.tipoUsuario)
            : undefined,
        }),
      );
    }
  }

  //Importa lista de alunos recebida no formato JSON
  async importarListaAlunos(req: Request, res: Response): Promise<Response> {
    try {
      // Validar se existe lista de alunos no body
      const alunos: CreateAlunoDto[] = req.body.alunos;
      if (!alunos || !Array.isArray(alunos)) {
        return res.status(400).json({
          error: 'Dados inválidos: Lista de alunos não fornecida',
        });
      }

      // Validar se a lista não está vazia
      if (alunos.length === 0) {
        return res.status(400).json({
          error: 'Lista de alunos vazia',
        });
      }

      // Importar alunos através do service
      await AlunoService.adicionarVarios(alunos);

      return res.status(201).json({
        message: 'Lista de alunos importada com sucesso',
      });
    } catch (error) {
      console.error('Erro ao importar lista de alunos:', error);
      return res.status(500).json({
        error: 'Erro interno ao processar lista de alunos',
      });
    }
  }
}

export default new AlunoController();
