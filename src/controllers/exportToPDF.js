import fs from 'fs';
import moment from 'moment';
import path from 'path';
import  afastamentoService  from '../services/afastamentoService.js'
const compileHTML = require('handlebars').compile;
const compilePDF = require('html-pdf').create;
const pdf = require('html-pdf');

const PDF_dir = path.join(process.cwd(), '/src/views/layouts/modeloAfastamento')
function PDFOptions() {
    return {
      format: 'A4',
      header: {
        height: '4.2cm',
        width: '100%',
        // contents: header,
      },
      footer: {
        height: '3cm',
        width: '100%',
        // contents: footer,
      },
    }
}
// Geração de PDF
async function HBStoPDF(afastamentoDoc, caminho) {
    console.log("FunçãoPDF")
    const conteudo = compileHTML(fs.readFileSync(caminho, 'utf8'))({afastamentoDoc});
    console.log("oi")
    return new Promise((resolve, reject) => compilePDF(conteudo, PDFOptions()).toBuffer((err, pdf) => {
        if (err) return reject(err);
        resolve(pdf);
    }));
}

async function getAfastamento(id) {
    const afastamento = await afastamentoService.vizualizar(id);
    const { usuarioNome, dataSaida, dataRetorno, tipoViagem, localViagem, justificativa, planoReposicao } = afastamento;
    const afastamentoDoc = {
        usuarioNome,
        dataSaida,
        dataRetorno,
        localViagem,
        tipoViagem,
        justificativa,
        planoReposicao,
    }
    return afastamentoDoc;

}

async function gerarPDF(req, res, next) {
    // var template = fs.readFileSync(path.join(PDF_dir, 'afastamentoPDF.hbs'), 'utf8');
    var template = path.join(PDF_dir, 'afastamentoPDF.hbs')
    console.log(template)
    
    const relatorio = await getAfastamento(req.params.id);
    console.log(relatorio)
    var filename = template.replace('.hbs', '.pdf');
    var templateHTML = fs.readFileSync(path.join(PDF_dir, 'afastamentoPDF.hbs'), 'utf8');

    pdf.create(templateHTML, PDFOptions()).toFile(filename, function(err, pdf){
        if (err) {
            return console.log(err);
        } else {
            res.download(filename, function(err){
                if (err) {
                    return console.log(err);
                } else {
                    console.log("PDF gerado com sucesso!");
                }
            });
        }
    })

    // const id = req.params.id;
    // if (!id) return res.status(400).json({ message: 'Id do afastamento não informado' });

    // const afastamentoDoc = await getAfastamento(id);
    // if (!afastamentoDoc) return res.status(400).json({ message: 'Afastamento não encontrado' });

    //* Construir nome do arquivo de saída (PDF)
    // const nomeArquivo = `Afastamento-${afastamentoDoc.usuarioNome}.pdf`;

    
    //*Construir caminho para templates do PDF
    // // const caminho = path.join(__dirname, PDF_dir, 'afastamentoPDF.hbs');
    // console.log(caminho)
    // try {
    //     const pdf = await HBStoPDF(afastamentoDoc, caminho);
    //     res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename=${nomeArquivo}` }).send(pdf);
    //     return res.status(200).send(pdf);
    // } catch (error) {
    //     return res.status(400).json({ message: 'Não foi possível gerar o PDF' });
    // }
}

export default { gerarPDF };