import fs from 'fs';
import { Response, Request, NextFunction } from 'express';
import { CreateEditalDto, StatusEdital, UpdateEditalDto } from './edital.types';
import EditalService from './edital.service';
import gerarPlanilha from '../../utils/gerarPlanilha/gerarPlanilhaMain';
import archiver from 'archiver';
import path from 'path';
import editalService from './edital.service';
import {
  AUTODECLARACAO,
  AUTODECLARACAO_VIDEO,
  CARTA_ACEITE_ORIENTADOR_FILE,
  COMPROVANTE_COTA,
  COMPROVANTE_FILE,
  CURRICULUM_FILE,
  FICHA_INSCRICAO,
  PROPOSTA_FILE,
  PROVA_ANTERIOR_FILE,
} from '../selecaoPPGI/selecao.ppgi.types';
import { Candidato } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { verificarArquivoDiretorio } from '@utils/utils';
import mime from 'mime-types';
import { StepCandidateEdital } from '@resources/candidato/candidato.types';
import { generatePdfEnrollment } from '@resources/pdf/pdf.controller';

const locals = {
  layout: 'selecaoppgi',
};

function resolveView(viewName: string): string {
  return path.resolve(__dirname, 'views', viewName);
}

const add = async (req: Request, res: Response) => {
  switch (req.method) {
    case 'GET':
      return res.render(resolveView('adicionarEdital'), {
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
        projetoPesquisa: req.body.projeto_pesquisa === '1',
        taesMestrado: Number(req.body.vaga_taes_mestrado),
        vagasDoutorado: Number(req.body.vaga_regular_doutorado),
        cotasDoutorado: Number(req.body.vaga_suplementar_doutorado),
        taesDoutorado: Number(req.body.vaga_taes_doutorado),
        status: StatusEdital.ATIVO,
        inscricoesEncerradas: 0,
        inscricoesIniciadas: 0,
      };
      try {
        await EditalService.criarEdital(novoEdital);
        return res.redirect('/edital/listEdital');
      } catch (error) {
        return res.status(500).json({
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
      const candidatos = await editalService.listCandidatos(id);

      const quantidadeInscricaoAndamento = candidatos.filter(
        (candidato) =>
          candidato.posicaoEdital !== null && candidato.posicaoEdital < 4,
      ).length;

      const quantidadeInscricaoFinalizada = candidatos.filter(
        (candidato) =>
          candidato.posicaoEdital !== null && candidato.posicaoEdital === 4,
      ).length;
      return res.render(resolveView('detalhesEdital'), {
        nome: req.session.nome,
        ...locals,
        edital,
        tipoUsuario: req.session.tipoUsuario,
        quantidadeInscricaoAndamento,
        quantidadeInscricaoFinalizada,
      });
    }
  }
};

const update = async (req: Request, res: Response) => {
  const { id_update } = req.params;
  switch (req.method) {
    case 'GET': {
      const edital = await EditalService.getById(id_update).catch((err) => {
        return res.status(400).json({
          error: err.message,
        });
      });
      return res.render(resolveView('editarEdital'), {
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
          projetoPesquisa: req.body.projeto_pesquisa === '1',
          vagasMestrado: parseInt(req.body.vaga_regular_mestrado),
          cotasMestrado: parseInt(req.body.vaga_suplementar_mestrado),
          taesMestrado: Number(req.body.vaga_taes_mestrado),
          taesDoutorado: Number(req.body.vaga_taes_doutorado),
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
            candidato.posicaoEdital !== null &&
            candidato.posicaoEdital !== StepCandidateEdital.FINALIZACAO,
        ).length;

        const quantidadeInscricaoFinalizada = candidatos.filter(
          (candidato) =>
            candidato.posicaoEdital !== null &&
            candidato.posicaoEdital === StepCandidateEdital.FINALIZACAO,
        ).length;

        return res.render(resolveView('listarCandidatosPorEdital'), {
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

const geraPlanilha = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const planilha = await gerarPlanilha(req.params.id, req.headers.host);
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
    next(error);
  }
};

const pegarDocumentoCandidato = async (req: Request, res: Response) => {
  const candidato = await EditalService.getCandidato(req.params.id);

  const caminhoDoc = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'uploads',
    'candidato',
    candidato.id,
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
export const viewDocumentCandidate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doc = req.query.documento as string | undefined;
    if (!doc)
      return res
        .status(400)
        .json({ error: 'Parâmetro "documento" é obrigatório.' });

    const candidato = await EditalService.getCandidato(id);
    if (!candidato)
      return res.status(404).json({ error: 'Candidato não encontrado.' });

    // Caminho absoluto protegido contra path-traversal
    const caminhoDoc = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'uploads',
      'candidato',
      candidato.id,
      path.basename(doc),
    );

    // Verifica se existe
    try {
      await fs.promises.access(caminhoDoc, fs.constants.R_OK);
    } catch {
      return res.status(404).json({ error: 'Arquivo não encontrado.' });
    }

    // Define MIME-type
    const mimeType = mime.lookup(caminhoDoc) || 'application/octet-stream';
    res.type(mimeType); // === res.setHeader('Content-Type', mimeType)

    // Só usa inline para PDFs
    if (mimeType === 'application/pdf') {
      res.setHeader('Content-Disposition', 'inline');
    }

    // Envia o arquivo
    res.sendFile(caminhoDoc, (err) => {
      if (err && !res.headersSent) {
        console.error(err);
        res.status(500).json({ error: 'Falha ao transferir o arquivo.' });
      }
    });
  } catch (err) {
    console.error(err);
    if (!res.headersSent)
      res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};
// curl -I "http://localhost:3300/edital/viewDocumentCandidate/cmdj76227000i22yc9e7lvuer?documento=VideoAutodeclaracao.mp4"

export const pegarDocumentosDeTodosCandidatos = async (
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
        AUTODECLARACAO_VIDEO,
        AUTODECLARACAO,
        COMPROVANTE_COTA,
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
  } catch (err) {
    console.error('Erro ao gerar .zip:', err);
    if (!res.headersSent) {
      // Se ainda não enviamos nada ao cliente, podemos retornar status 500
      res.status(500).json({ error: err.message });
    }
  }
};

const pegarDocumentsDeUmCandidate = async (req: Request, res: Response) => {
  try {
    const candidatoId = req.params.id;

    if (!candidatoId) {
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
      AUTODECLARACAO,
      AUTODECLARACAO_VIDEO,
      COMPROVANTE_COTA,
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
    const candidato = await editalService.getCandidato(req.params.id);
    const edital = await editalService.getById(candidato!.editalId);
    const candidatoDocs = {
      Curriculum: false,
      CartaDoOrientador: false,
      PropostaDeTrabalho: false,
      ProvaAnteriorSelecao: false,
      ComprovantePagamento: false,
      Recomendacoes: false,
      AutodeclaracaoVideo: false,
      Autodeclaracao: false,
      ComprovanteCota: false,
      Fichainscricao: false,
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
      candidato.id,
    );

    candidatoDocs.Curriculum = await verificarArquivoDiretorio(
      caminhoDiretorioUsuario,
      CURRICULUM_FILE,
    );

    candidatoDocs.CartaDoOrientador = await verificarArquivoDiretorio(
      caminhoDiretorioUsuario,
      CARTA_ACEITE_ORIENTADOR_FILE,
    );

    candidatoDocs.PropostaDeTrabalho = await verificarArquivoDiretorio(
      caminhoDiretorioUsuario,
      PROPOSTA_FILE,
    );

    candidatoDocs.ProvaAnteriorSelecao = await verificarArquivoDiretorio(
      caminhoDiretorioUsuario,
      PROVA_ANTERIOR_FILE,
    );

    candidatoDocs.ComprovantePagamento = await verificarArquivoDiretorio(
      caminhoDiretorioUsuario,
      COMPROVANTE_FILE,
    );
    candidatoDocs.Recomendacoes = await verificarArquivoDiretorio(
      caminhoDiretorioUsuario,
      'Recomendacoes.pdf',
    );

    candidatoDocs.ComprovanteCota = await verificarArquivoDiretorio(
      caminhoDiretorioUsuario,
      COMPROVANTE_COTA,
    );
    candidatoDocs.Autodeclaracao = await verificarArquivoDiretorio(
      caminhoDiretorioUsuario,
      AUTODECLARACAO,
    );
    candidatoDocs.AutodeclaracaoVideo = await verificarArquivoDiretorio(
      caminhoDiretorioUsuario,
      AUTODECLARACAO_VIDEO,
    );
    candidatoDocs.Fichainscricao = await verificarArquivoDiretorio(
      caminhoDiretorioUsuario,
      FICHA_INSCRICAO,
    );
    return res.render(resolveView('detalhesCandidato'), {
      candidato: candidato,
      candidatoDocs: candidatoDocs,
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

const updateDocumentCandidate = async (req: Request, res: Response) => {
  try {
    const candidatoId = req.params.id;

    if (!candidatoId) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: 'ID do candidato inválido.' });
    }
    await generatePdfEnrollment(candidatoId);

    return res.status(StatusCodes.OK).json({
      message: 'Documento atualizado com sucesso.',
    });
  } catch (error) {
    console.error('Erro ao atualizar documento do candidato:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Erro ao atualizar o documento do candidato.',
    });
  }
};

export default {
  listarEditalSelecao,
  add,
  deletarEdital,
  arquivarEdital,
  exibirDetalhesEdital,
  update,
  geraPlanilha,
  listarCandidatos,
  exibirDetalhesCandidato,
  pegarDocumentoCandidato,
  pegarDocumentosDeTodosCandidatos,
  pegarDocumentsDeUmCandidate,
  viewDocumentCandidate,
  updateDocumentCandidate,
};
