//### A ser Removido ###//

import fs from 'fs';
import path from 'path';
import moment from 'moment';
import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import usuarioService from '../resources/usuarios/usuario.service';
import afastamentoService from '../resources/afastamentoTemporario/afastamentoTemporario.service';
import { Request, Response, NextFunction } from 'express';

// 1. Pegar dados do afastamento (Pegar o usario, afastamento, email) e formatar tudo em uma constante
async function getAfastamento(id: number) {
  const afastamento = await afastamentoService.retornarAfastamento(String(id));
  const usuario = await usuarioService.listarUmUsuario(id);
  const diretor = await usuarioService.buscarUsuarioPor({ diretor: 1 });
  console.log('Diretor:', diretor);
  const email = usuario.email;

  if (!afastamento) return null;

  const {
    usuarioNome,
    dataSaida,
    dataRetorno,
    tipoViagem,
    localViagem,
    justificativa,
    planoReposicao,
    createdAt,
  } = afastamento;
  const afastamentoDoc = {
    usuarioNome,
    dataSaida: moment(dataSaida).format('DD/MM/YYYY'),
    dataRetorno: moment(dataRetorno).format('DD/MM/YYYY'),
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

// 2. Pegar o modelo do afastamento e compilar o HTML
function HBStoPDF(
  afastamentoPath: any,
  dados: any,
  footerPath: any,
  headerPath: any,
) {
  const footer = fs.readFileSync(footerPath, 'utf8');
  const header = fs.readFileSync(headerPath, 'utf8');
  const afastamentoDoc = fs.readFileSync(afastamentoPath, 'utf8');
  Handlebars.registerPartial('header', header);
  Handlebars.registerPartial('footer', footer);
  const template = Handlebars.compile(afastamentoDoc);
  return template({ afastamentoDoc: dados });
}

// 3. Gerar o PDF
export async function criarAfastamentoPDF(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = req.params.id;

    const afastamentoPath = path.join(
      process.cwd(),
      '/src/views/layouts/modeloAfastamento/afastamentoPDF.hbs',
    );
    const footerPath = path.join(
      process.cwd(),
      '/src/views/layouts/modeloAfastamento/footer.hbs',
    );
    const headerPath = path.join(
      process.cwd(),
      '/src/views/layouts/modeloAfastamento/header.hbs',
    );
    const dados = await getAfastamento(Number(id));
    console.log('Dados:', dados);
    const arquivoHTML = HBStoPDF(
      afastamentoPath,
      dados,
      footerPath,
      headerPath,
    );
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: '/usr/bin/chromium-browser',
      protocolTimeout: 60000,
    });
    const page = await browser.newPage();
    await page.setContent(arquivoHTML, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      path: path.join(
        __dirname,
        `/../../public/afastamentos/${dados!.usuarioNome}.pdf`,
      ),
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
    });
    // console.log('Tamanho do PDF Buffer:', pdf.length);

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${dados!.usuarioNome}.pdf`,
    );
    fs.createReadStream(
      path.join(
        __dirname,
        `/../../public/afastamentos/${dados!.usuarioNome}.pdf`,
      ),
    ).pipe(res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 500, details: error });
  }
}
