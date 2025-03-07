import fs from 'fs';
import path from 'path';
import moment from 'moment';
import usuarioService from '../resources/usuarios/usuario.service';
import afastamentoService from '../resources/afastamentoTemporario/afastamentoTemporario.service';
import { Request, Response } from 'express';
import { generatePdfLeave } from '../resources/pdf/pdf.controller';

interface DataAfastamentoPDF {
  nomeCompleto: string;
  dataSaida: string;
  dataRetorno: string;
  localViagem: string;
  tipoViagem: string;
  justificativa: string;
  planoReposicao: string;
  diretorNome: string;
  data: string;
  hora: string;
  email: string;
}

// 1. Pegar dados do afastamento (Pegar o usario, afastamento, email) e formatar tudo em uma constante
export async function getAfastamento(id: number): Promise<DataAfastamentoPDF> {
  const afastamento = await afastamentoService.retornarAfastamento(id);
  const usuario = await usuarioService.listarUmUsuario(id);
  const diretor = await usuarioService.buscarUsuarioPor({ diretor: 1 });
  const email = usuario.email;

  if (!afastamento) return null;

  const {
    nomeCompleto,
    dataInicio,
    dataFim,
    tipoViagem,
    localViagem,
    justificativa,
    planoReposicao,
    createdAt,
  } = afastamento;
  const afastamentoDoc = {
    nomeCompleto,
    dataSaida: moment(dataInicio).format('DD/MM/YYYY'),
    dataRetorno: moment(dataFim).format('DD/MM/YYYY'),
    localViagem,
    tipoViagem,
    justificativa,
    planoReposicao,
    diretorNome: diretor!.nomeCompleto,
    data: moment(createdAt).format('DD/MM/YYYY'),
    hora: moment(createdAt).format('HH:mm'),
    email,
  };
  return afastamentoDoc;
}

// 3. Gerar o PDF
export async function criarAfastamentoPDF(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      `public/afastamentos/${id}.pdf`,
    );
    const dados = await getAfastamento(Number(id));
    await generatePdfLeave(id, id.toString());
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename=${dados!.nomeCompleto}.pdf`,
    );
    fs.createReadStream(filePath).pipe(res);
    // Quando a resposta terminar, remove o arquivo
    res.on('finish', () => {
      try {
        fs.promises.unlink(filePath);
      } catch (error) {
        console.error(error);
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 500, details: error });
  }
}
