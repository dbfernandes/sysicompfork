import fs from 'fs';
import moment from 'moment';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
// import afastamentoService from '../services/afastamentoService'
import afastamentoService from '../resources/afastamentoTemporario/afastamentoTemporario.service';
// import usuarioService from '../services/usuarioService'
import usuarioService from '../resources/usuarios/usuario.service';
const compileHTML = require('handlebars').compile;
const compilePDF = require('html-pdf').create;

interface AfastamentoDoc {
  nomeCompleto: string;
  dataInicio: string;
  dataFim: string;
  localViagem: string;
  tipoViagem: string;
  justificativa: string;
  planoReposicao: string;
  data: string;
  hora: string;
  email: string;
}

const PDF_DIR = path.join(
  process.cwd(),
  '/src/views/layouts/modeloAfastamento',
);

function PDFOptions(footer: any) {
  return {
    format: 'A4',
    footer: {
      height: '3cm',
      contents: {
        first: footer,
        default: '',
      },
    },
  };
}
// Geração de PDF
async function HBStoPDF(afastamentoDoc: any, footerPath: any, caminho: any) {
  const footer = compileHTML(fs.readFileSync(footerPath, 'utf8'))();
  const conteudo = compileHTML(fs.readFileSync(caminho, 'utf8'))({
    afastamentoDoc,
  });
  return new Promise((resolve, reject) =>
    compilePDF(conteudo, PDFOptions(footer)).toBuffer(
      (err: any, buffer: any) => (err ? reject(err) : resolve(buffer)),
    ),
  );
}

async function getAfastamento(id: number) {
  const afastamento = await afastamentoService.retornarAfastamento(id);
  const usuario = await usuarioService.listarUmUsuario(id);
  const email = usuario.email;

  if (!afastamento) return null;

  const afastamentoDoc: AfastamentoDoc = {
    nomeCompleto: afastamento.nomeCompleto,
    dataInicio: moment(afastamento.dataInicio).format('DD/MM/YYYY'),
    dataFim: moment(afastamento.dataFim).format('DD/MM/YYYY'),
    localViagem: afastamento.localViagem,
    tipoViagem: afastamento.tipoViagem,
    justificativa: afastamento.justificativa,
    planoReposicao: afastamento.planoReposicao,
    data: moment(afastamento.createdAt).format('DD/MM/YYYY'),
    hora: moment(afastamento.createdAt).format('HH:mm'),
    email: email,
  };

  return afastamentoDoc;
}

async function gerarPDF(req: Request, res: Response, next: NextFunction) {
  const relatorio = await getAfastamento(Number(req.params.id));
  const filename = `Afastamento-${relatorio!.nomeCompleto}.pdf`;
  const footerPath = path.join(PDF_DIR, 'footer.hbs');
  const contentPath = path.join(PDF_DIR, 'afastamentoPDF.hbs');

  try {
    const pdfBuffer = await HBStoPDF(relatorio, footerPath, contentPath);
    return res
      .set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename=${filename}`,
        // 'Content-Disposition': `attachment; filename=${filename}`
      })
      .send(pdfBuffer);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 500, details: error });
  }
}

export default { gerarPDF };
