import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import CandidatoRecomendacaoService from '@resources/candidatoRecomendacao/candidato.recomendacao.service';
import { getAfastamento } from '@utils/criarAfastamentoPDF';
import { getFormattedDataCandidateFinish } from '@resources/pdf/pdf.util';

type ContentPdf = 'recomendacoes' | 'afastamento' | 'inscricao';

async function compileTemplates(templatePath: string, data?: object) {
  const mainTemplate = await fs.readFile(templatePath, 'utf8');

  const template = Handlebars.compile(mainTemplate);
  return template(data);
}

export async function generatePdf(
  type: ContentPdf,
  pathSave: string,
  id?: string,
) {
  try {
    const footerPath = path.join(__dirname, 'views', 'footer.hbs');
    const headerPath = path.join(__dirname, 'views', 'header.hbs');
    const template = path.join(__dirname, 'views', `${type}.hbs`);
    let data = {};

    if (type === 'recomendacoes' && id) {
      data = {
        recommendations:
          await CandidatoRecomendacaoService.getRecomendationsForPDF(
            Number(id),
          ),
      };
    }

    if (type === 'afastamento' && id) {
      data = {
        afastamentoDoc: await getAfastamento(Number(id)),
      };
    }

    if (type === 'inscricao' && id) {
      data = await getFormattedDataCandidateFinish(id);
    }

    const arquivoHTML = await compileTemplates(template, data);
    const headerHtml = await fs
      .readFile(headerPath)
      .then((data) => data.toString());
    const footerHtml = await fs
      .readFile(footerPath)
      .then((data) => data.toString());

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

export async function generatePdfRecommendations(candidateId: string) {
  const pathSave = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'uploads',
    'candidato',
    candidateId,
    'Recomendacoes.pdf',
  );
  await generatePdf('recomendacoes', pathSave, candidateId);
}

export async function generatePdfEnrollment(candidateId: string) {
  const pathSave = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'uploads',
    'candidato',
    candidateId,
    'Inscricao2.pdf',
  );
  await generatePdf('inscricao', pathSave, candidateId);
}

export async function generatePdfLeave(id: string, name: string) {
  const pathSave = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'public',
    'afastamentos',
    `${name}.pdf`,
  );
  await generatePdf('afastamento', pathSave, id);
}
