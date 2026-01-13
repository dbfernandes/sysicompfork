// pdf.service.ts ------------------------------------------------------------
import { HtmlConverter, Chromiumly } from 'chromiumly';
import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { randomUUID } from 'crypto';

import CandidatoRecomendacaoService from '@resources/candidatoRecomendacao/candidato.recomendacao.service';
import { getAfastamento } from '@utils/criarAfastamentoPDF';
import { getFormattedDataCandidateFinish } from '@resources/pdf/pdf.util';

type ContentPdf = 'recomendacoes' | 'afastamento' | 'inscricao';

/**
 * Configure apenas uma vez logo que a aplicação subir.
 * Em Docker Compose, considere expor o serviço como http://gotenberg:3000
 */
Chromiumly.configure({
  endpoint: process.env.GOTENBERG_ENDPOINT ?? 'http://gotenberg:3000',
});

// --------------------------------------------------------------------------
async function compileTemplates(templatePath: string, data?: object) {
  const mainTemplate = await fs.readFile(templatePath, 'utf8');
  const template = Handlebars.compile(mainTemplate);
  return template(data);
}

// --------------------------------------------------------------------------
export async function generatePdf(
  type: ContentPdf,
  pathSave: string,
  id?: string,
) {
  try {
    /* ---------- 1. DADOS ------------------------------ */
    const footerPathSrc = path.join(__dirname, 'views', 'footer.hbs');
    const headerPathSrc = path.join(__dirname, 'views', 'header.hbs');
    const templateSrc = path.join(__dirname, 'views', `${type}.hbs`);

    let data: object = {};

    if (type === 'recomendacoes' && id) {
      data = {
        recommendations:
          await CandidatoRecomendacaoService.getRecomendationsForPDF(id),
      };
    }

    if (type === 'afastamento' && id) {
      data = { afastamentoDoc: await getAfastamento(Number(id)) };
    }

    if (type === 'inscricao' && id) {
      data = await getFormattedDataCandidateFinish(id);
    }
    /* ---------- 2. HTML compilado --------------------- */
    const compiledHtml = await compileTemplates(templateSrc, data);
    const compiledHeader = await compileTemplates(headerPathSrc, data);
    const compiledFooter = await compileTemplates(footerPathSrc, data);

    /* ---------- 3. Arquivos temporários --------------- */
    const workDir = await fs.mkdtemp(
      path.join(os.tmpdir(), `pdf-${randomUUID()}-`),
    );
    const htmlFile = path.join(workDir, 'index.html');
    const headerFile = path.join(workDir, 'header.html');
    const footerFile = path.join(workDir, 'footer.html');

    await Promise.all([
      fs.writeFile(htmlFile, compiledHtml),
      fs.writeFile(headerFile, compiledHeader),
      fs.writeFile(footerFile, compiledFooter),
    ]);

    /* ---------- 4. Conversão via Gotenberg ------------ */
    const htmlConverter = new HtmlConverter();
    const pdfBuffer = await htmlConverter.convert({
      html: htmlFile,
      header: headerFile,
      footer: footerFile,
      properties: {
        printBackground: true,
        size: { width: 8.27, height: 11.69 }, // A4 em polegadas
        margins: {
          top: 1.9, // ≅ 180 px
          bottom: 1.05, // ≅ 100 px
          left: 0.6,
          right: 0.6,
        },
      },
    });

    /* ---------- 5. Salvando no destino --------------- */
    await fs.mkdir(path.dirname(pathSave), { recursive: true });
    await fs.writeFile(pathSave, pdfBuffer);

    /* ---------- 6. Limpeza --------------------------- */
    await fs.rm(workDir, { recursive: true, force: true });
  } catch (err) {
    console.error('Erro ao gerar PDF:', err);
  }
}

/* ------------------------------------------------------------------------ */
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
    'Inscricao.pdf',
  );
  await generatePdf('inscricao', pathSave, candidateId);
}

export async function generatePdfLeave(id: string, name: string) {
  const pathSave = path.join(
    __dirname,
    '..',
    '..',
    '..',
    'tmp',
    'afastamentos',
    `${name}.pdf`,
  );
  await generatePdf('afastamento', pathSave, id);
}
