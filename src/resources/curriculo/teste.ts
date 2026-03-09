import fs from 'fs/promises';
// import parser from 'simple-xml-to-json';
import xml2json from 'xml2json';
import {
  LattesAtividadeProfissional,
  LattesFormacaoAcademicaTitulacao,
  LattesInstituicaoEmpresa,
  LattesPremioOuTitulo,
  LattesProfessor,
  LattesVinculoAtuacaoProfissional,
} from '@prisma/client';
import js from '@eslint/js';

// export async function parseLattesXml(filePath: string) {
//   try {
//     // Lê o XML
//     const xmlContent = await fs.readFile(filePath, 'utf-8');
//
//     // Converte para JSON
//     const json = parser.convertXML(xmlContent);
//     console.log(json);
//     const curriculoJson = json[Keys.CURRICULO]['DADOS-GERAIS'];
//     console.log(curriculoJson);
//     return json;
//   } catch (error) {
//     console.error('Erro ao converter XML:', error);
//     throw new Error('Falha ao processar XML do currículo Lattes');
//   }
// }
function parseDateDDMMYYYY(value: string) {
  if (!/^\d{8}$/.test(value)) {
    throw new Error('Data inválida');
  }

  const day = Number(value.slice(0, 2));
  const month = Number(value.slice(2, 4)) - 1; // meses começam em 0
  const year = Number(value.slice(4, 8));

  return new Date(year, month, day);
}

function toArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

const Keys = {
  CURRICULO: 'CURRICULO-VITAE',
  SISTEMA_ORIGEM: 'SISTEMA-ORIGEM',
  NUMERO_IDENTIFICADOR: 'NUMERO-IDENTIFICADOR',
  DATA_ATUALIZACAO: 'DATA-ATUALIZACAO',
  HORA_ATUALIZACAO: 'HORA-ATUALIZACAO',
  DADOS_GERAIS: 'DADOS-GERAIS',
  PREMIOS: 'PREMIOS-TITULOS',
};

const KeysDados = {
  NOME_COMPLETO: 'NOME-COMPLETO',
  NOME_EM_CITACOES_BIBLIOGRAFICAS: 'BIBLIOGRAFICAS',
};

type XmlJson = Record<string, any>;
type LattesProfessorDto = Pick<
  LattesProfessor,
  | 'nomeProfessor'
  | 'nomeEmCitacoesProfessor'
  | 'numeroCurriculo'
  | 'dataUltimaAtualizacaoCurriculo'
>;

type LattesPremioDto = Pick<
  LattesPremioOuTitulo,
  'anoPremioOuTitulo' | 'nomePremioOuTitulo' | 'nomeEntidadePromotora'
>;

type LattesFormacaoDto = Pick<
  LattesFormacaoAcademicaTitulacao,
  | 'sequenciaFormacaoAcademica'
  | 'nivelFormacaoAcademica'
  | 'codigoCurso'
  | 'nomeCurso'
  | 'codigoInstituicaoEmpresa'
  | 'nomeInstituicaoEmpresa'
  | 'statusDoCurso'
  | 'anoInicio'
  | 'anoConclusao'
  | 'anoObtencaoTitulo'
  | 'tituloTrabalhoConclusaoCurso'
  | 'nomeOrientador'
  | 'codigoAgenciaFinanciadora'
  | 'nomeAgenciaFinanciadora'
  | 'tipoFormacao'
>;

// type LattesAtividadeProfissionalDto = Pick<
//   LattesAtividadeProfissional,
//   'sequenciaAtividadeProfissional' | ''
// >;

type LattesInstituicaoEmpresaDto = Pick<
  LattesInstituicaoEmpresa,
  'codigoInstituicaoEmpresa' | 'nomeInstituicaoEmpresa'
>;
type LattesAtividadeProfissionalDto = Pick<
  LattesAtividadeProfissional,
  'sequenciaAtividadeProfissional' | 'instituicaoEmpresaId'
>;
//   {
//   sequenciaAtividadeProfissional: number;
//   codigoInstituicao?: string;
//   nomeInstituicao?: string;
// };

type LattesVinculoAtuacaoProfissionalDto = Pick<
  LattesVinculoAtuacaoProfissional,
  | 'sequenciaAtividadeProfissional'
  | 'sequenciaVinculoAtuacaoProfissional'
  | 'tipoVinculoAtuacaoProfissional'
  | 'enquadramentoFuncional'
  | 'cargaHorariaSemanal'
  | 'anoInicio'
  | 'anoFim'
  | 'outrasInformacoes'
>;

export function getDadosProfessor(xml: XmlJson): LattesProfessorDto {
  const dadosGerais = xml[Keys.DADOS_GERAIS];

  const numeroCurriculo = xml['NUMERO-IDENTIFICADOR'];
  const nomeProfessor = dadosGerais['NOME-COMPLETO'];
  const nomeEmCitacoesProfessor =
    dadosGerais['NOME-EM-CITACOES-BIBLIOGRAFICAS'];

  const dataUltimaAtualizacaoCurriculo = parseDateDDMMYYYY(
    xml['DATA-ATUALIZACAO'],
  );

  return {
    nomeProfessor,
    numeroCurriculo,
    nomeEmCitacoesProfessor,
    dataUltimaAtualizacaoCurriculo,
  };
}

export function getPremiosTitulos(xml: XmlJson): LattesPremioDto[] {
  const dadosGerais = xml[Keys.DADOS_GERAIS];

  const premiosContainer = dadosGerais['PREMIOS-TITULOS'];
  if (!premiosContainer) return [];

  let premios = premiosContainer['PREMIO-TITULO'];
  if (!premios) return [];

  // 🔥 Normaliza para array
  if (!Array.isArray(premios)) {
    premios = [premios];
  }

  return premios.map((premio: any) => ({
    nomePremioOuTitulo: premio['NOME-DO-PREMIO-OU-TITULO'],
    nomeEntidadePromotora: premio['NOME-DA-ENTIDADE-PROMOTORA'],
    anoPremioOuTitulo: Number(premio['ANO-DA-PREMIACAO']),
  }));
}

export function getFormacaoAcademicaTitulacao(
  xml: XmlJson,
): LattesFormacaoDto[] {
  const dadosGerais = xml[Keys.DADOS_GERAIS];
  if (!dadosGerais) return [];

  const formacaoContainer = dadosGerais['FORMACAO-ACADEMICA-TITULACAO'];
  if (!formacaoContainer) return [];

  const tiposFormacao = [
    'GRADUACAO',
    'ESPECIALIZACAO',
    'MESTRADO',
    'DOUTORADO',
    'POS-DOUTORADO',
    'LIVRE-DOCENCIA',
    'CURSO-TECNICO-PROFISSIONALIZANTE',
    'MESTRADO-PROFISSIONALIZANTE',
    'ENSINO-FUNDAMENTAL-PRIMEIRO-GRAU',
    'ENSINO-MEDIO-SEGUNDO-GRAU',
    'RESIDENCIA-MEDICA',
    'APERFEICOAMENTO',
  ];

  const resultado: LattesFormacaoDto[] = [];

  for (const tipo of tiposFormacao) {
    let registros = formacaoContainer[tipo];
    if (!registros) continue;

    // 🔥 Normaliza para array
    if (!Array.isArray(registros)) {
      registros = [registros];
    }

    for (const item of registros) {
      resultado.push({
        sequenciaFormacaoAcademica: Number(item['SEQUENCIA-FORMACAO']),
        tipoFormacao: tipo.replace(/-/g, '_') as any,

        nivelFormacaoAcademica: item['NIVEL'] ?? tipo,

        codigoCurso: item['CODIGO-CURSO'] ?? null,
        nomeCurso: item['NOME-CURSO'] ?? null,

        codigoInstituicaoEmpresa: item['CODIGO-INSTITUICAO'] ?? null,
        nomeInstituicaoEmpresa: item['NOME-INSTITUICAO'] ?? null,

        statusDoCurso: item['STATUS-DO-CURSO'] ?? null,

        anoInicio: item['ANO-DE-INICIO'] ? Number(item['ANO-DE-INICIO']) : null,

        anoConclusao: item['ANO-DE-CONCLUSAO']
          ? Number(item['ANO-DE-CONCLUSAO'])
          : null,

        anoObtencaoTitulo: item['ANO-DE-OBTENCAO-DO-TITULO']
          ? Number(item['ANO-DE-OBTENCAO-DO-TITULO'])
          : null,

        tituloTrabalhoConclusaoCurso:
          item['TITULO-DO-TRABALHO-DE-CONCLUSAO-DE-CURSO'] ??
          item['TITULO-DA-DISSERTACAO-TESE'] ??
          item['TITULO-DA-MONOGRAFIA'] ??
          item['TITULO-DO-TRABALHO'] ??
          item['TITULO-DA-RESIDENCIA-MEDICA'] ??
          null,

        nomeOrientador:
          item['NOME-DO-ORIENTADOR'] ??
          item['NOME-COMPLETO-DO-ORIENTADOR'] ??
          item['NOME-ORIENTADOR-GRAD'] ??
          item['NOME-ORIENTADOR-DOUT'] ??
          null,

        codigoAgenciaFinanciadora: item['CODIGO-AGENCIA-FINANCIADORA'] ?? null,

        nomeAgenciaFinanciadora: item['NOME-AGENCIA'] ?? null,
      });
    }
  }

  return resultado;
}
export function getAtuacoesProfissionais(xml: XmlJson) {
  const atuacoesRoot = xml['DADOS-GERAIS']?.['ATUACOES-PROFISSIONAIS'];

  if (!atuacoesRoot) {
    return { instituicoes: [], atividades: [], vinculos: [] };
  }

  const atuacoes = toArray(atuacoesRoot['ATUACAO-PROFISSIONAL']);
  const instituicoesMap = new Map<string, LattesInstituicaoEmpresaDto>();

  const atividades: LattesAtividadeProfissionalDto[] = [];
  const vinculos: LattesVinculoAtuacaoProfissionalDto[] = [];

  for (const atuacao of atuacoes) {
    const sequenciaAtividade = Number(atuacao['SEQUENCIA-ATIVIDADE']);

    const codigoInstituicao = atuacao['CODIGO-INSTITUICAO'];
    const nomeInstituicao = atuacao['NOME-INSTITUICAO'];

    // 🔹 Registrar instituição se ainda não existir
    if (codigoInstituicao && !instituicoesMap.has(codigoInstituicao)) {
      instituicoesMap.set(codigoInstituicao, {
        codigoInstituicaoEmpresa: codigoInstituicao,
        nomeInstituicaoEmpresa: nomeInstituicao,
      });
    }

    atividades.push({
      sequenciaAtividadeProfissional: sequenciaAtividade,
      // aqui você depois vai mapear instituicaoEmpresaId
      instituicaoEmpresaId: undefined as any,
    });

    const vinculosXml = toArray(atuacao['VINCULOS']);

    for (const vinculo of vinculosXml) {
      let tipoVinculoAtuacaoProfissional = vinculo['TIPO-DE-VINCULO'];

      if (
        tipoVinculoAtuacaoProfissional === 'LIVRE' &&
        typeof vinculo['OUTRO-VINCULO-INFORMADO'] === 'string' &&
        vinculo['OUTRO-VINCULO-INFORMADO'].length
      ) {
        tipoVinculoAtuacaoProfissional = vinculo['OUTRO-VINCULO-INFORMADO'];
      }

      vinculos.push({
        sequenciaAtividadeProfissional: sequenciaAtividade,
        sequenciaVinculoAtuacaoProfissional: Number(
          vinculo['SEQUENCIA-HISTORICO'],
        ),
        tipoVinculoAtuacaoProfissional,
        enquadramentoFuncional: vinculo['ENQUADRAMENTO-FUNCIONAL'],
        cargaHorariaSemanal: vinculo['CARGA-HORARIA-SEMANAL']
          ? Number(vinculo['CARGA-HORARIA-SEMANAL'])
          : undefined,
        anoInicio: vinculo['ANO-INICIO']
          ? Number(vinculo['ANO-INICIO'])
          : undefined,
        anoFim: vinculo['ANO-FIM'] ? Number(vinculo['ANO-FIM']) : undefined,
        outrasInformacoes: vinculo['OUTRAS-INFORMACOES'],
      });
    }
  }

  return {
    instituicoes: Array.from(instituicoesMap.values()),
    atividades,
    vinculos,
  };
}

export async function parseLattesXml(filePath: string) {
  try {
    const xml = await fs.readFile(filePath, 'utf-8');

    const json = xml2json.toJson(xml, {
      object: true, // já retorna objeto JS
      trim: true, // remove espaços extras
      sanitize: false,
      coerce: false,
    });
    const curriculo = json[Keys.CURRICULO];

    const professor = getDadosProfessor(curriculo);
    const premios = getPremiosTitulos(curriculo);
    const formacoes = getFormacaoAcademicaTitulacao(curriculo);
    const atuações = getAtuacoesProfissionais(curriculo);

    return json;
  } catch (error) {
    console.error('Erro ao converter XML:', error);
    throw new Error('Erro ao processar XML do Lattes');
  }
}
