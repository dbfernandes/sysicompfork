import fs from 'fs';
import path from 'path';
import pdfmake from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { footerDoc, headerDoc } from './pdf';

export async function criarPDF(req, res, next) {
  try {
    // Configuração das fontes para o PDFMake
    const fonts = {
      Roboto: {
        normal: path.join(
          __dirname,
          '../..',
          'public/fonts/Roboto/Roboto-Regular.ttf',
        ),
        bold: path.join(
          __dirname,
          '../..',
          'public/fonts/Roboto/Roboto-Bold.ttf',
        ),
        italics: path.join(
          __dirname,
          '../..',
          'public/fonts/Roboto/Roboto-Italic.ttf',
        ),
        bolditalics: path.join(
          __dirname,
          '../..',
          'public/fonts/Roboto/Roboto-BoldItalic.ttf',
        ),
      },
    };

    // Criação do PDFMake com as fontes configuradas
    const printer = new pdfmake(fonts);

    // Definição do conteúdo do documento PDF
    const docDefinition: TDocumentDefinitions = {
      header: headerDoc,
      footer: footerDoc,
      content: [
        {
          stack: [
            {
              layout: {
                hLineWidth: () => 2,
              },
              table: {
                widths: ['*'],
                body: [
                  [
                    {
                      text: 'COMPROVANTE DE INSCRIÇÃO',
                      style: 'titleSection',
                      border: [false, false, false, true],
                      marginBottom: 8,
                    },
                  ],
                ],
              },
            },
            {
              relativePosition: { x: 0, y: -30 },
              stack: [
                {
                  text: 'Hora: 20:30',
                  alignment: 'right',
                  fontSize: 11,
                  bold: true,
                },
                {
                  text: 'Data: 18/08/2024',
                  alignment: 'right',
                  fontSize: 11,
                  bold: true,
                },
              ],
            },
          ],
        },
      ],
      styles: {
        header: { fontSize: 11, italics: true, bold: true },
        footer: {
          fontSize: 10,
          italics: true,
          bold: true,
          alignment: 'center',
        },
        titleSection: {
          fontSize: 11,
          bold: true,
          alignment: 'center',
        },
      },
      pageMargins: [40, 120, 40, 60],
      pageSize: 'A4',
    };

    // Criar o documento PDF
    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    // Caminho para salvar o arquivo na pasta public
    const outputPath = path.join(
      __dirname,
      '../../public/afastamentos/relatorio_afastamento.pdf',
    );

    // Criar a pasta se não existir
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // Salvar o PDF na pasta public
    const writeStream = fs.createWriteStream(outputPath);
    pdfDoc.pipe(writeStream);

    pdfDoc.end();

    writeStream.on('finish', () => {
      res.status(200).json({
        message: 'PDF gerado com sucesso!',
        filePath: `/public/afastamentos/relatorio_afastamento.pdf`,
      });
    });
  } catch (error) {
    // Tratamento de erros
    next(error);
  }
}
