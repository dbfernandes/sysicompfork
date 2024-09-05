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
} from '../../utils/pdf';
import candidatoService from '../candidato/candidato.service';
import { TYPES_PUBLICACAO } from '../candidatoPublicacao/candidato.publicacao.types';
import { Publicacao } from '@prisma/client';

function formatarNumeroInscricao(numberId: number): string {
  const num = '000-0000-000';
  const id = numberId.toString();
  return num.substring(0, num.length - id.length) + id;
}

function formatarPublicacao(publicacao: Publicacao) {
  return `${publicacao.autores.split(',').join(';')}; ${publicacao.titulo} ${publicacao.local}. ${publicacao.ano}.`;
}
export async function gerarPDF(id: number) {
  try {
    const candidato = await candidatoService.listAllInfoCandidate(id);
    const periodicos = candidato.CandidatoPublicacoes.filter(
      (publicacao) => publicacao.tipo === TYPES_PUBLICACAO.PERIODICOS,
    );
    const conferencias = candidato.CandidatoPublicacoes.filter(
      (publicacao) => publicacao.tipo === TYPES_PUBLICACAO.EVENTOS,
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
          value: candidato.idEdital,
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
        { label: 'CPF:', value: 'Verificar' },
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
        { label: 'Ano Egresso:', value: candidato.anoEgressoGraduacao },
      ],
    ];
    const cursoPosGraduacao = [
      [{ label: 'Curso:', value: candidato.cursoPos }],
      [
        { label: 'Instituição:', value: candidato.instituicaoPos },
        { label: 'Ano Egresso:', value: candidato.anoEgressoPos },
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
      [{ label: 'Linha de pesquisa:', value: candidato.LinhasDePesquisa.nome }],
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

    const recomendacoes = candidato.CandidatoRecomendacao.map(
      (recomendacao) => {
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
      },
    );

    const atividades = candidato.CandidatoExperienciaAcademica.map(
      (experiencia) => {
        return [
          [
            {
              label: 'Atividade:',
              value: experiencia.atividade,
            },
          ],
          [
            {
              label: 'Instituição:',
              value: experiencia.instituicao,
            },
            {
              label: 'Período:',
              value: experiencia.periodo,
            },
          ],
        ];
      },
    );

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
                  text: 'Hora: 20:30',
                  style: 'infoHeader',
                },
                {
                  text: 'Data: 18/08/2024',
                  style: 'infoHeader',
                },
              ],
            },
          ],
        },
        titleSection('Dados Pessoais'),
        renderOptions(dadosPessoais),
        titleSection('Dados do PosComp'),

        headerSection('FORMAÇÃO ACADÊMICA', true),
        titleSection('Curso de Graduação'),
        renderOptions(cursoGraduacao),
        titleSection('Curso de Pos-Graduação Stricto-Senso'),
        renderOptions(cursoPosGraduacao),
        titleSection('Publicações'),
        renderOptions(publicacoes),
        titleSection('Experiência Acadêmica'),

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
        ...(candidato.Edital.cartaOrientador === '1'
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
      '../../..',
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
