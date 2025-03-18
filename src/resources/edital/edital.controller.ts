import fs from 'fs';
import { Response, Request } from 'express';
import { CreateEditalDto, StatusEdital, UpdateEditalDto } from './edital.types';
import EditalService from './edital.service';
import gerarPlanilha from '../../utils/gerarPlanilha/gerarPlanilhaMain';
import archiver from 'archiver';
import path from 'path';
import editalService from './edital.service';
import { verificarArquivoDiretorio } from '../selecaoPPGI/selecao.ppgi.controller';
import {
  CARTA_ACEITE_ORIENTADOR_FILE,
  COMPROVANTE_FILE,
  CURRICULUM_FILE,
  PROPOSTA_FILE,
  PROVA_ANTERIOR_FILE,
} from '../selecaoPPGI/selecao.ppgi.types';
import { Candidato } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

const locals = {
  layout: 'selecaoppgi',
};

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const adicionarEditalSelecao = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      return res.render(resolveView('adicionarEdital'), {
        csrfToken: req.csrfToken(),
        tipoUsuario: req.session.tipoUsuario,
        nome: req.session.nome,
        ...locals,
      });

    case 'POST': {
      const novoEdital: CreateEditalDto = {
        id: req.body.num_edital,
        documento: req.body.documento,
        dataInicio: req.body.data_inicio,
        dataFim: req.body.data_fim,
        cartaRecomendacao: req.body.carta_recomendacao,
        cartaOrientador: req.body.carta_orientador,
        vagasMestrado: Number(req.body.vaga_regular_mestrado),
        cotasMestrado: Number(req.body.vaga_suplementar_mestrado),
        vagasDoutorado: Number(req.body.vaga_regular_doutorado),
        cotasDoutorado: Number(req.body.vaga_suplementar_doutorado),
        status: StatusEdital.ATIVO,
        inscricoesEncerradas: 0,
        inscricoesIniciadas: 0,
      };
      try {
        await EditalService.criarEdital(novoEdital);
        return res.redirect('/edital/listEdital');
      } catch (error) {
        return res.status(500).json({
          csrfToken: req.csrfToken(),
          error: error.message,
          req: req.body,
        });
      }
    }
    case 'PUT':
      return res.status(200).send({
        message: 'TO-DO',
      });

    default:
      return res.status(404).send();
  }
};

const listarEditalSelecao = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      const editais = await editalService.listEditalComQtdeCandidatos();

      return res.render(resolveView('listarEditais'), {
        csrfToken: req.csrfToken(),
        nome: req.session.nome,
        editais,
        tipoUsuario: req.session.tipoUsuario,
        usuarioPermitido:
          req.session.tipoUsuario.coordenador ||
          req.session.tipoUsuario.secretaria ||
          req.session.tipoUsuario.administrador,
      });

    case 'POST': {
      const editais = await editalService.listEdital().catch((err) => {
        return res.status(400).json({
          error: err.message,
        });
      });
      return res.status(200).json(editais);
    }
    default:
      return res.status(404).send();
  }
};

const deletarEdital = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'DELETE':
      const { id } = req.params;

      try {
        await editalService.delete(id);
      } catch (error) {
        return res.status(400).json({
          csrfToken: req.csrfToken(),
          error: error.message,
        });
      }
      return res.status(200).send({ message: 'Edital deletado com sucesso' });
    default:
      return res.status(404).send();
  }
};

const arquivarEdital = async (req: Request, res: Response) => {
  const { id_edital } = req.params;

  switch (req.method) {
    case 'PUT': {
      const { status } = req.body;

      const edital_update = await editalService
        .arquivar(id_edital, {
          status,
        })
        .catch((err) => {
          return res.status(400).json({
            error: err.message,
          });
        });
      return res.status(200).send(edital_update);
    }
    default:
      return res.status(404).send();
  }
};

const exibirDetalhesEdital = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET': {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ error: 'ID not found' });
      }
      const edital = await editalService.getById(id);
      if (!edital) {
        return res.status(404).json({ error: 'Edital não encontrado' });
      }

      return res.render(resolveView('vizualizarEdital'), {
        csrfToken: req.csrfToken(),
        nome: req.session.nome,
        ...locals,
        edital,
        tipoUsuario: req.session.tipoUsuario,
      });
    }
  }
};

const updateEdital = async (req: Request, res: Response) => {
  const { id_update } = req.params;
  switch (req.method) {
    case 'GET': {
      const edital = await EditalService.getById(id_update).catch((err) => {
        return res.status(400).json({
          error: err.message,
        });
      });
      return res.render(resolveView('editarEdital'), {
        csrfToken: req.csrfToken(),
        nome: req.session.nome,
        ...locals,
        edital,
        tipoUsuario: req.session.tipoUsuario,
      });
    }
    case 'PUT': {
      try {
        const editalAtualizado: UpdateEditalDto = {
          id: req.body.num_edital,
          documento: req.body.documento,
          dataInicio: req.body.data_inicio,
          dataFim: req.body.data_fim,
          cartaRecomendacao: req.body.carta_recomendacao,
          cartaOrientador: req.body.carta_orientador,
          vagasMestrado: parseInt(req.body.vaga_regular_mestrado),
          cotasMestrado: parseInt(req.body.vaga_suplementar_mestrado),
          vagasDoutorado: parseInt(req.body.vaga_regular_doutorado),
          cotasDoutorado: parseInt(req.body.vaga_suplementar_doutorado),
          inscricoesEncerradas: 0,
          inscricoesIniciadas: 0,
          status: 1,
          // updatedAt: new Date (moment.tz('America/Manaus').format('YYYY-MM-DD HH:mm:ss'))
        };
        const updatedEdital = await EditalService.update(
          id_update,
          editalAtualizado,
        );
        return res.status(200).send(updatedEdital);
      } catch (error) {
        console.error(error);
        return res.status(400).json({
          error: error.message,
        });
      }
    }
    default:
      return res.status(404).send();
  }
};

// listEditalcandidatos/:id
const listarCandidatos = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET': {
      try {
        const editalID = req.params.id;
        const candidatos = await editalService.listCandidatos(editalID);

        if (!Array.isArray(candidatos))
          throw new Error('Erro ao buscar candidatos');
        const quantidadeInscricaoAndamento = candidatos.filter(
          (candidato) =>
            candidato.posicaoEdital !== null && candidato.posicaoEdital < 4,
        ).length;

        const quantidadeInscricaoFinalizada = candidatos.filter(
          (candidato) =>
            candidato.posicaoEdital !== null && candidato.posicaoEdital === 4,
        ).length;

        return res.render(resolveView('listarCandidatosPorEdital'), {
          csrfToken: req.csrfToken(),
          nome: req.session.nome,
          ...locals,
          candidatos,
          editalID,
          tipoUsuario: req.session.tipoUsuario,
          quantidadeInscricaoAndamento,
          quantidadeInscricaoFinalizada,
        });
      } catch (error) {
        return res.status(400).json({
          error: error.message,
        });
      }
    }
    default:
      return res.status(StatusCodes.METHOD_NOT_ALLOWED).send();
  }
};

const geraPlanilha = async (req: Request, res: Response) => {
  try {
    const planilha = await gerarPlanilha(req.params.id);
    return res
      .set({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=planilha.xlsx',
        'Content-Length': planilha.length,
      })
      .status(200)
      .send(planilha);
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

const getDocumentToCandidate = async (req: Request, res: Response) => {
  const candidato = await EditalService.getCandidato(Number(req.params.id));
  const caminhoDoc = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'uploads',
    'candidato',
    candidato.id.toString(),
    `${req.query.documento}`,
  );

  res.download(caminhoDoc, (error) => {
    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  });
};

export const getDocumentsToAllCandidates = async (
  req: Request,
  res: Response,
) => {
  try {
    const editalId = req.params.id;
    const candidatos = await editalService.listCandidatos(editalId);

    // Define cabeçalhos de resposta para download
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${editalId}-candidatos.zip`,
    );
    res.setHeader('Content-Type', 'application/zip');

    // Cria a instância do archiver
    const archive = archiver('zip', { zlib: { level: 9 } });

    // Trata erros do archiver
    archive.on('error', (err) => {
      if (!res.headersSent) {
        // Se ainda não enviamos cabeçalhos, podemos enviar status 500
        return res.status(500).json({ error: err.message });
      } else {
        // Se parte do ZIP já foi enviada, só podemos logar e encerrar
        console.error('Erro após início do envio:', err);
        return res.end();
      }
    });

    // Inicia o streaming para a resposta
    archive.pipe(res);

    // Para cada candidato, vamos procurar pelos arquivos específicos
    for (const candidato of candidatos) {
      const candDir = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'uploads',
        'candidato',
        candidato.id.toString(),
      );

      // Montamos o nome da pasta que aparecerá no ZIP
      const candidateFolderName = `${candidato.id}-${candidato.nome}`;

      // Lista de PDFs que desejamos incluir, se existirem
      const pdfFiles = [
        'CartaAceiteOrientador.pdf',
        'ComprovantePagamento.pdf',
        'Curriculum.pdf',
        'Inscricao.pdf',
        'PropostaTrabalho.pdf',
        'Recomendacoes.pdf',
      ];

      for (const fileName of pdfFiles) {
        const filePath = path.join(candDir, fileName);

        try {
          // Verificamos se o arquivo existe e pode ser lido
          await fs.promises.access(filePath, fs.constants.R_OK);

          // Incluímos o arquivo no ZIP, definindo o caminho interno
          archive.file(filePath, {
            name: path.join(candidateFolderName, fileName),
          });
        } catch {
          // Se não existir ou não for legível, ignoramos sem gerar erro
        }
      }
    }

    // Finaliza (inicia o fechamento) do arquivo ZIP
    archive.finalize();
  } catch (err: any) {
    console.error('Erro ao gerar .zip:', err);
    if (!res.headersSent) {
      // Se ainda não enviamos nada ao cliente, podemos retornar status 500
      res.status(500).json({ error: err.message });
    }
  }
};

const getDocumentsToCandidate = async (req: Request, res: Response) => {
  try {
    const candidatoId = Number(req.params.id);

    if (isNaN(candidatoId)) {
      return res.status(400).json({ error: 'ID do candidato inválido.' });
    }

    const candidato: Candidato | null =
      await EditalService.getCandidato(candidatoId);

    if (!candidato) {
      return res.status(404).json({ error: 'Candidato não encontrado.' });
    }

    const candDir = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'uploads',
      'candidato',
      candidato.id.toString(),
    );

    const arquivos = [
      'CartaAceiteOrientador.pdf',
      'ComprovantePagamento.pdf',
      'Curriculum.pdf',
      'Inscricao.pdf',
      'PropostaTrabalho.pdf',
      'Recomendacoes.pdf',
    ];

    // Sanitiza o nome do candidato para evitar problemas de segurança
    const safeNome = candidato.nome ?? candidato.email;
    const zipFileName = `${candidato.id}-${safeNome}.zip`;

    // Define os cabeçalhos para a resposta
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${zipFileName}"`,
    );
    res.setHeader('Content-Type', 'application/zip');

    const archive = archiver('zip', {
      zlib: { level: 9 }, // Nível de compressão
    });

    // Trata erros do archiver
    archive.on('error', (err) => {
      console.error('Erro ao criar o ZIP:', err);
      if (!res.headersSent) {
        res.status(500).send({ error: 'Erro ao criar o arquivo ZIP.' });
      }
    });

    // Pipe do archiver para a resposta
    archive.pipe(res);

    // Itera sobre cada arquivo e adiciona ao ZIP se existir
    for (const arquivo of arquivos) {
      const arquivoPath = path.join(candDir, arquivo);

      try {
        await fs.promises.access(arquivoPath, fs.constants.R_OK);
        // Adiciona o arquivo ao ZIP na raiz ou dentro de uma pasta específica
        archive.file(arquivoPath, { name: arquivo });
        console.log(`Adicionado ao ZIP: ${arquivoPath}`);
      } catch (err) {
        console.warn(`Arquivo não encontrado e será ignorado: ${arquivoPath}`);
        // Opcional: Adicione um placeholder ou registro no ZIP indicando a ausência do arquivo
      }
    }

    // Finaliza o arquivo ZIP
    archive.finalize();
  } catch (err) {
    console.error('Erro no processamento da requisição:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
};

const exibirDetalhesCandidato = async (req: Request, res: Response) => {
  try {
    const candidato = await editalService.getCandidato(Number(req.params.id));
    const edital = await editalService.getById(candidato!.editalId);
    const candidatoDocs = {
      Curriculum: false,
      CartaDoOrientador: false,
      PropostaDeTrabalho: false,
      ProvaAnteriorSelecao: false,
      ComprovantePagamento: false,
      Recomendacoes: false,
    };
    const countRecomendations = candidato.recomendacoes.length;
    const countRecomendationsFinished = candidato.recomendacoes.filter(
      (recomendacao) => Boolean(recomendacao.dataResposta),
    ).length;
    const caminhoDiretorioUsuario = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'uploads',
      'candidato',
      candidato.id.toString(),
    );

    candidatoDocs.Curriculum = verificarArquivoDiretorio(
      caminhoDiretorioUsuario,
      CURRICULUM_FILE,
    );

    candidatoDocs.CartaDoOrientador = verificarArquivoDiretorio(
      caminhoDiretorioUsuario,
      CARTA_ACEITE_ORIENTADOR_FILE,
    );

    candidatoDocs.PropostaDeTrabalho = verificarArquivoDiretorio(
      caminhoDiretorioUsuario,
      PROPOSTA_FILE,
    );

    candidatoDocs.ProvaAnteriorSelecao = verificarArquivoDiretorio(
      caminhoDiretorioUsuario,
      PROVA_ANTERIOR_FILE,
    );

    candidatoDocs.ComprovantePagamento = verificarArquivoDiretorio(
      caminhoDiretorioUsuario,
      COMPROVANTE_FILE,
    );
    candidatoDocs.Recomendacoes = verificarArquivoDiretorio(
      caminhoDiretorioUsuario,
      'Recomendacoes.pdf',
    );

    return res.render(resolveView('detalhesCandidato'), {
      candidato: candidato,
      candidatoDocs: candidatoDocs,
      csrfToken: req.csrfToken(),
      nome: req.session.nome,
      ...locals,
      tipoUsuario: req.session.tipoUsuario,
      edital,
      countRecomendationsFinished,
      countRecomendations,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

export default {
  listarEditalSelecao,
  adicionarEditalSelecao,
  deletarEdital,
  arquivarEdital,
  exibirDetalhesEdital,
  updateEdital,
  geraPlanilha,
  listarCandidatos,
  exibirDetalhesCandidato,
  getDocumentToCandidate,
  getDocumentsToCandidate,
  getDocumentsToAllCandidates,
};
