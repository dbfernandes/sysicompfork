import fs from 'fs';
import path from 'path';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import {
  footerDoc,
  headerDoc,
  headerSection,
  lineOptions,
  listItems,
  printer,
  renderOptions,
  titlePage,
  titleSection,
} from './pdf';
import candidatoService from '../resources/candidato/candidato.service';
import { TYPES_PUBLICACAO } from '../resources/candidatoPublicacao/candidato.publicacao.types';
import { Nacionalidade } from '../resources/selecaoPPGI/selecao.ppgi.types';
import { CandidatoPublicacao } from '@prisma/client';

function formatarNumeroInscricao(numberId: number): string {
  const num = '000-0000-000';
  const id = numberId.toString();
  return num.substring(0, num.length - id.length) + id;
}

function formatarPublicacao(publicacao: CandidatoPublicacao) {
  return `${publicacao.autores.split(',').join(';')}; ${publicacao.titulo} ${publicacao.local}. ${publicacao.ano}.`;
}

// Função para gerar o PDF de inscrição de um candidato no PPGI
export async function gerarPDF(id: number) {
  try {
    const candidato =
      await candidatoService.listarTodasInformacoesDeCandidato(id);
    const periodicos = candidato.publicacoes.filter(
      (publicacao) => publicacao.tipoId === TYPES_PUBLICACAO.PERIODICOS,
    );
    const conferencias = candidato.publicacoes.filter(
      (publicacao) => publicacao.tipoId === TYPES_PUBLICACAO.EVENTOS,
    );
    const numberPeriodicos = periodicos.length;

    const numberConferencias = conferencias.length;

    // Configuração das fontes para o PDFMake

    const dadosPessoais = [
      [
        {
          label: 'Número da inscrição:',
          value: formatarNumeroInscricao(candidato.id),
        },
        {
          label: 'Edital: ',
          value: candidato.edital.id,
        },
      ],
      [
        { label: 'Nome:', value: candidato.nome },
        { label: 'Nome Social:', value: candidato.nomeSocial },
      ],
      [{ label: 'Endereço:', value: candidato.endereco }],
      [
        { label: 'CEP:', value: candidato.cep },
        { label: 'Bairro:', value: candidato.bairro },
      ],
      [
        { label: 'Cidade:', value: candidato.cidade },
        { label: 'Estado:', value: candidato.uf },
      ],
      [
        {
          label: 'Data de Nascimento:',
          value: new Date(candidato.dataNascimento).toLocaleDateString('pt-BR'),
        },
        ...(candidato.nacionalidade === Nacionalidade.BRASILEIRA
          ? [
              {
                label: 'CPF:',
                value: candidato.cpf,
              },
            ]
          : []),
      ],
      [
        ...(candidato.nacionalidade === Nacionalidade.ESTRANGEIRA
          ? [
              { label: 'País:', value: candidato.pais },
              { label: 'Passaporte:', value: candidato.passaporte },
            ]
          : []),
      ],
      [
        { label: 'Telefone Principal:', value: candidato.telefone },
        { label: 'Telefone Alternativo:', value: candidato.telefoneSecundario },
      ],
    ];
    const cursoGraduacao = [
      [{ label: 'Curso:', value: candidato.cursoGraduacao }],
      [
        { label: 'Instituição:', value: candidato.instituicaoGraduacao },
        { label: 'Ano Egresso:', value: String(candidato.anoEgressoGraduacao) },
      ],
    ];
    const cursoPosGraduacao = [
      [{ label: 'Curso:', value: candidato.cursoPos }],
      [
        { label: 'Instituição:', value: candidato.instituicaoPos },
        { label: 'Ano Egresso:', value: String(candidato.anoEgressoPos) },
      ],
    ];
    const publicacoes = [
      [
        { label: 'Em Periódicos:', value: numberPeriodicos.toString() },
        { label: 'Em Conferências:', value: numberConferencias.toString() },
      ],
    ];
    const pesquisa = [
      [{ label: 'Título da proposta:', value: candidato.tituloProposta }],
      [{ label: 'Linha de pesquisa:', value: candidato.linhaPesquisa.nome }],
    ];

    const outrasInformacoes = [
      [
        { label: 'Curso Desejado:', value: candidato.cursoDesejado },
        { label: 'Regime de Dedicação:', value: candidato.regime },
      ],
      [
        {
          label: 'Solicita Bolsa de Estudos?',
          value: candidato.bolsista ? 'Sim' : 'Não',
        },
        {
          label: 'Regime de Cotas?',
          value: candidato.cotista ? candidato.cotistaTipo : 'Não',
        },
      ],

      [
        {
          label:
            'Possui algum tipo de problema de saúde física ou psiquiátrica?',
          value: candidato.condicao ? candidato.condicaoTipo : 'Não',
        },
      ],
    ];

    const recomendacoes = candidato.recomendacoes.map((recomendacao) => {
      return [
        {
          label: 'Nome:',
          value: recomendacao.nome,
        },
        {
          label: 'Email:',
          value: recomendacao.email,
        },
      ];
    });

    const atividades = candidato.experienciasAcademicas.length
      ? candidato.experienciasAcademicas.reduce((acc, curr) => {
          acc.push([
            {
              label: 'Atividade:',
              value: curr.atividade,
            },
          ]);
          acc.push([
            {
              label: 'Instituição:',
              value: curr.instituicao,
            },

            {
              label: 'Período:',
              value: `${curr.periodo}`,
            },
          ]);
          return acc;
        }, [])
      : [[{ label: '', value: 'Não consta Informações.' }]];

    const [date, time] = new Date()
      .toLocaleString('pt-BR', {
        timeZone: 'America/Manaus',
      })
      .trim()
      .split(',');
    const timeWithoutMilliseconds = time
      .split(':')
      .reduce((acc, curr, index) => (index === 2 ? acc : `${acc}:${curr}`));

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
                      style: 'sectionHeader',
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
                  text: `Hora: ${timeWithoutMilliseconds}`,
                  style: 'infoHeader',
                },
                {
                  text: `Data: ${date}`,
                  style: 'infoHeader',
                },
              ],
            },
          ],
        },
        titleSection('Dados Pessoais'),
        renderOptions(dadosPessoais),

        headerSection('FORMAÇÃO ACADÊMICA', true),
        titleSection('Curso de Graduação'),
        renderOptions(cursoGraduacao),
        titleSection('Curso de Pos-Graduação Stricto-Senso'),
        renderOptions(cursoPosGraduacao),
        titleSection('Publicações'),
        renderOptions(publicacoes),
        titleSection('Experiência Acadêmica'),
        renderOptions(atividades),
        {
          ...headerSection('PROPOSTA DE TRABALHO', false),
          pageBreak: 'before',
        },
        {
          text: '',
          marginTop: 8,
        },
        renderOptions(pesquisa, true),
        {
          text: '',
          marginTop: 16,
        },
        renderOptions(outrasInformacoes, true),
        {
          text: '',
          marginTop: 16,
        },
        lineOptions({
          title: 'Exposição de motivos',
          info: '(exponha resumidamente os motivos que o(a) levaram a se candidatar):',
          titleBold: true,
        }),
        {
          layout: {
            vLineWidth: () => 3,
            hLineWidth: () => 3,
          },
          table: {
            body: [[candidato.motivos]],
            widths: ['*'],
            heights: 150,
          },
        },
        {
          text: '',
          marginTop: 16,
        },
        ...(candidato.edital.cartaOrientador === '1'
          ? [
              titleSection('Cartas de Recomendação'),
              renderOptions(recomendacoes, true),
            ]
          : []),
        ...(numberPeriodicos > 0
          ? [
              titlePage('PERIÓDICOS'),
              listItems(
                periodicos.map((periodico) => formatarPublicacao(periodico)),
              ),
            ]
          : []),
        ...(numberConferencias > 0
          ? [
              titlePage('CONFERÊNCIAS'),
              listItems(
                conferencias.map((periodico) => formatarPublicacao(periodico)),
              ),
            ]
          : []),
      ],
      styles: {
        header: { fontSize: 11, italics: true, bold: true, font: 'Roboto' },
        footer: {
          fontSize: 9,
          italics: true,
          bold: true,
          alignment: 'center',
        },
        sectionHeader: {
          fontSize: 12,
          alignment: 'center',
          bold: true,
        },
        infoHeader: {
          alignment: 'right',
          fontSize: 11,
        },
        sectionTitle: {
          bold: true,
        },
        titlePage: {
          fontSize: 18,
          bold: true,
        },
      },
      defaultStyle: {
        font: 'Courier',
        color: '#000',
        fontSize: 12,
      },
      pageMargins: [40, 120, 40, 60],
      pageSize: 'A4',
    };

    // Criar o documento PDF
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    // Caminho para salvar o arquivo na pasta public
    const outputPath = path.join(
      __dirname,
      '../..',
      'public',
      'uploads',
      'candidato',
      `${candidato.id}`,
      'Inscricao.pdf',
    );

    // Criar a pasta se não existir
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // Salvar o PDF na pasta public
    const writeStream = fs.createWriteStream(outputPath);
    pdfDoc.pipe(writeStream);

    pdfDoc.end();
  } catch (error) {
    console.error(error);
  }
}
