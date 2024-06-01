import fs from 'fs'
import moment from 'moment'
import path from 'path'
import afastamentoService from '../services/afastamentoService'
import usuarioService from '../services/usuarioService'
const compileHTML = require('handlebars').compile
const compilePDF = require('html-pdf').create

const PDF_DIR = path.join(process.cwd(), '/src/views/layouts/modeloAfastamento')

function PDFOptions (footer) {
  return {
    format: 'A4',
    footer: {
      height: '3cm',
      contents: {
        first: footer,
        default: ''
      }
    }
  }
}
// Geração de PDF
async function HBStoPDF (afastamentoDoc, footerPath, caminho) {
  const footer = compileHTML(fs.readFileSync(footerPath, 'utf8'))()
  const conteudo = compileHTML(fs.readFileSync(caminho, 'utf8'))({ afastamentoDoc })
  return new Promise((resolve, reject) => compilePDF(conteudo, PDFOptions(footer))
    .toBuffer((err, buffer) => err ? reject(err) : resolve(buffer)))
}

async function getAfastamento (id) {
  const afastamento = await afastamentoService.retornarAfastamento(id)
  const usuario = await usuarioService.listarUmUsuario(id)
  const email = usuario.email
  const { usuarioNome, dataSaida, dataRetorno, tipoViagem, localViagem, justificativa, planoReposicao, createdAt } = afastamento
  const afastamentoDoc = {
    usuarioNome,
    dataSaida: moment(dataSaida).format('DD/MM/YYYY'),
    dataRetorno: moment(dataRetorno).format('DD/MM/YYYY'),
    localViagem,
    tipoViagem,
    justificativa,
    planoReposicao,
    data: moment(createdAt).format('DD/MM/YYYY'),
    hora: moment(createdAt).format('HH:mm'),
    email
  }
  return afastamentoDoc
}

async function gerarPDF (req, res, next) {
  const relatorio = await getAfastamento(req.params.id)
  const filename = `Afastamento-${relatorio.usuarioNome}.pdf`
  const footerPath = path.join(PDF_DIR, 'footer.hbs')
  const contentPath = path.join(PDF_DIR, 'afastamentoPDF.hbs')

  try {
    const pdfBuffer = await HBStoPDF(relatorio, footerPath, contentPath)
    return res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename=${filename}`
      // 'Content-Disposition': `attachment; filename=${filename}`
    }).send(pdfBuffer)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 500, details: error })
  }
}

export default { gerarPDF }
