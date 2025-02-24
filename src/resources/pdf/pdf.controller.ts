import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import CandidatoRecomendacaoService from '@resources/candidatoRecomendacao/candidato.recomendacao.service';

async function compilarTemplates(templatePath: string, data?: object) {
  const mainTemplate = await fs.readFile(templatePath, 'utf8');

  const template = Handlebars.compile(mainTemplate);
  return template(data);
}

export async function gerarPdf() {
  try {
    const footerPath = path.join(__dirname, 'views', 'footer.hbs');
    const headerPath = path.join(__dirname, 'views', 'header.hbs');
    const afastamentoPath = path.join(__dirname, 'views', 'template.hbs');
    const recommendations =
      await CandidatoRecomendacaoService.getRecomendationsForPDF(3);
    console.log({
      recommendations,
    });

    const arquivoHTML = await compilarTemplates(afastamentoPath, {
      recommendations,
    });
    const headerHtml = await fs
      .readFile(headerPath)
      .then((data) => data.toString());
    const footerHtml = await fs
      .readFile(footerPath)
      .then((data) => data.toString());
    // 1. Ler o arquivo de template (ex.: "template.hbs")

    const pathSave = path.join(__dirname, 'saida.pdf');

    // 4. Abrir o navegador com Puppeteer
    const browser = await puppeteer.launch({
      headless: true, // ou 'new' dependendo da sua versão do Puppeteer
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: '/usr/bin/chromium-browser',
    });
    const page = await browser.newPage();

    // 5. Carregar o HTML gerado
    await page.setContent(arquivoHTML, {
      waitUntil: 'networkidle0',
    });

    // 6. Gerar o PDF
    await page.pdf({
      path: pathSave,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: headerHtml,
      footerTemplate: footerHtml,
      outline: true,

      margin: {
        top: '180px', // ajuste conforme o tamanho do seu header
        bottom: '100px', // ajuste conforme o tamanho do seu footer
        left: '1.5cm',
        right: '1.5cm',
      },
    });

    await browser.close();
    console.log('PDF gerado com sucesso!');
  } catch (err) {
    console.error('Erro ao gerar PDF:', err);
  }
}
