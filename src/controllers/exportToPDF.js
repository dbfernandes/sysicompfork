import fs from 'fs';
import moment from 'moment';
import path from 'path';
import afastamentoService  from '../services/afastamentoService.js'
const compileHTML = require('handlebars').compile;
const compilePDF = require('html-pdf').create;

const PDF_dir = path.join(process.cwd(), '/src/views/layouts/modeloAfastamento')
function PDFOptions(header) {
    return {
      format: 'A4',
      header: {
        height: '28mm',
        contents: {
            first: header,
            default: '',
        },
      },
    }
}
// Geração de PDF
async function HBStoPDF(afastamentoDoc, headerPath, caminho) {
    const header = compileHTML(fs.readFileSync(headerPath, 'utf8'))();
    const conteudo = compileHTML(fs.readFileSync(caminho, 'utf8'))({afastamentoDoc});
    return new Promise((resolve, reject) => compilePDF(conteudo, PDFOptions(header))
        .toBuffer((err, buffer) => err ? reject(err) : resolve(buffer)));
}

async function getAfastamento(id) {
    const afastamento = await afastamentoService.pegarAfastamento(id);
    const { usuarioNome, dataSaida, dataRetorno, tipoViagem, localViagem, justificativa, planoReposicao, createdAt } = afastamento;
    const afastamentoDoc = {
        usuarioNome,
        dataSaida: moment(dataSaida).format('DD/MM/YYYY'),
        dataRetorno: moment(dataRetorno).format('DD/MM/YYYY'),
        localViagem,
        tipoViagem,
        justificativa,
        planoReposicao,
        data: moment(createdAt).format('DD/MM/YYYY'),
        hora: moment(createdAt).format('HH:mm')
    }
    return afastamentoDoc;

}

async function gerarPDF(req, res, next) {
    var contentPath = path.join(PDF_dir, 'afastamentoPDF.hbs')
    const relatorio = await getAfastamento(req.params.id);
    var filename = `Afastamento-${relatorio.usuarioNome}.pdf`;
    const headerPath = path.join(PDF_dir, 'header.hbs');

    try {
        const pdfBuffer = await HBStoPDF(relatorio, headerPath, contentPath); 
        return res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename=${filename}`
            // 'Content-Disposition': `attachment; filename=${filename}`
        }).send(pdfBuffer);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 500, details: err });
    }

}

export default { gerarPDF };