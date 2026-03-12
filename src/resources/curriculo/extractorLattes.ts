/* eslint-disable */
import fs from 'fs/promises';
import X2JS from 'x2js';

function getIndex(obj, idx) {
  if (!obj || typeof obj !== 'object') return '';

  const keys = Object.keys(obj);
  for (const key of keys) {
    if (key.includes(idx)) {
      return key;
    }
  }

  return '';
}

function ensureArray(value) {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

function getProjetosFromInstituicao(instituicoes) {
  const instituicoesArr = ensureArray(instituicoes);

  if (instituicoesArr.length > 0) {
    for (const instituicao of instituicoesArr) {
      if (instituicao?.['_CODIGO-INSTITUICAO'] === '008200000000') {
        return instituicao['ATIVIDADES-DE-PARTICIPACAO-EM-PROJETO'];
      }
    }
  }

  return instituicoes?.['ATIVIDADES-DE-PARTICIPACAO-EM-PROJETO'] || null;
}

function getPublicDict(dados) {
  const autoresArr = ensureArray(dados?.['AUTORES']);
  const autores = {
    nomeCompleto: [],
    nomeAbreviado: [],
  };

  for (const autor of autoresArr) {
    autores.nomeCompleto.push(autor?.['_NOME-COMPLETO-DO-AUTOR'] || '');
    autores.nomeAbreviado.push(autor?.['_NOME-PARA-CITACAO'] || '');
  }

  const dbIndx = getIndex(dados, 'DADOS-BASICOS');
  const anoIdx = getIndex(dados?.[dbIndx] || {}, '_ANO');
  const tituloIdx = getIndex(dados?.[dbIndx] || {}, '_TITULO');
  const natIdx = getIndex(dados?.[dbIndx] || {}, '_NATUREZA');

  const dtIndx = getIndex(dados, 'DETALHAMENTO');
  const issnIdx = getIndex(dados?.[dtIndx] || {}, '_IS');

  const localIdx =
    getIndex(dados?.[dtIndx] || {}, '_NOME-DO-EVENTO') !== ''
      ? getIndex(dados?.[dtIndx] || {}, '_NOME-DO-EVENTO')
      : getIndex(dados?.[dtIndx] || {}, '_TITULO-');

  return {
    titulo: dados?.[dbIndx]?.[tituloIdx] || '',
    autores,
    ano: dados?.[dbIndx]?.[anoIdx] || '',
    issn: dados?.[dtIndx]?.[issnIdx] || '',
    local: dados?.[dtIndx]?.[localIdx] || '',
    natureza: dados?.[dbIndx]?.[natIdx] || '',
  };
}

function getProjectDict(dados, nome, lattesId) {
  const titulo = dados?.['_NOME-DO-PROJETO'] || '';
  const descricao = dados?.['_DESCRICAO-DO-PROJETO'] || '';
  const inicio = dados?.['_ANO-INICIO'] || '';
  const fim =
    dados?.['_ANO-FIM'] === '' || dados?.['_ANO-FIM'] === undefined
      ? 0
      : dados?.['_ANO-FIM'];

  let integrantes = [];
  let papel = '';
  let financiadores = [];

  const integrantesArr = ensureArray(
    dados?.['EQUIPE-DO-PROJETO']?.['INTEGRANTES-DO-PROJETO'],
  );

  if (integrantesArr.length > 0) {
    for (const integrante of integrantesArr) {
      integrantes.push(integrante?.['_NOME-COMPLETO'] || '');

      if (
        integrante?.['_NRO-ID-CNPQ'] === lattesId ||
        integrante?.['_NOME-COMPLETO'] === nome
      ) {
        papel =
          integrante?.['_FLAG-RESPONSAVEL'] === 'SIM'
            ? 'Coordenador'
            : 'Participante';
      }
    }
  }

  const financiadoresArr = ensureArray(
    dados?.['FINANCIADORES-DO-PROJETO']?.['FINANCIADOR-DO-PROJETO'],
  );

  if (financiadoresArr.length > 0) {
    for (const financiador of financiadoresArr) {
      const nomeFinanciador = financiador?.['_NOME-INSTITUICAO'] || '';
      financiadores.push(
        nomeFinanciador === '' ? 'Não possui' : nomeFinanciador,
      );
    }
  } else {
    financiadores.push('Não possui');
  }

  return {
    titulo,
    descricao,
    inicio,
    fim,
    integrantes: integrantes.join('; '),
    financiadores: financiadores.join('; '),
    papel,
  };
}

function formatNatureza(natureza) {
  if (!natureza || typeof natureza !== 'string') return '';

  if (natureza.split('_').length > 1) {
    return (
      natureza.toLowerCase().charAt(0).toUpperCase() +
      natureza.toLowerCase().slice(1)
    )
      .split('_')
      .join(' ');
  }

  return natureza;
}

function getGuidenceDict(dados) {
  const dadosBasicosIDX = getIndex(dados, 'DADOS-BASICOS');
  const detalhamentoIDX = getIndex(dados, 'DETALHAMENTO');
  const tituloIDX = getIndex(dados?.[dadosBasicosIDX] || {}, '_TITULO');
  const alunoIDX = getIndex(dados?.[detalhamentoIDX] || {}, '_NOME-DO-ORIENTA');

  const natureza = formatNatureza(dados?.[dadosBasicosIDX]?.['_NATUREZA']);

  return {
    titulo: dados?.[dadosBasicosIDX]?.[tituloIDX] || '',
    aluno: dados?.[detalhamentoIDX]?.[alunoIDX] || '',
    ano: dados?.[dadosBasicosIDX]?.['_ANO'] || '',
    natureza,
  };
}

function parseDateDDMMYYYY(value) {
  if (!/^\d{8}$/.test(value)) {
    throw new Error('Data inválida');
  }

  const day = Number(value.slice(0, 2));
  const month = Number(value.slice(2, 4)) - 1;
  const year = Number(value.slice(4, 8));

  return new Date(year, month, day);
}

function buildFormacaoTexto(formacao) {
  let formacaoTexto = '';
  let formacaoTextoIngles = '';

  if (!formacao) {
    return {
      formacaoTexto,
      formacaoTextoIngles,
    };
  }

  const buildFromItem = (item, prefixPt, prefixEn) => {
    const row = ensureArray(item)[0] || {};
    const curso = (row['_NOME-CURSO'] || '') + ';';
    const cursoIngles =
      (row['_NOME-CURSO-INGLES'] || '') === ''
        ? (row['_NOME-CURSO'] || '') + ';'
        : row['_NOME-CURSO-INGLES'] + ';';
    const instituicao = (row['_NOME-INSTITUICAO'] || '') + ';';
    const ano = (row['_ANO-DE-CONCLUSAO'] || '') + ';';

    return {
      pt: prefixPt + curso + instituicao + ano,
      en: prefixEn + cursoIngles + instituicao + ano,
    };
  };

  if (formacao.hasOwnProperty('DOUTORADO')) {
    const data = buildFromItem(
      formacao['DOUTORADO'],
      'Doutorado;',
      'Doctorate;',
    );
    formacaoTexto = data.pt;
    formacaoTextoIngles = data.en;
  } else if (formacao.hasOwnProperty('MESTRADO')) {
    const data = buildFromItem(
      formacao['MESTRADO'],
      'Mestrado;',
      "Master's degree;",
    );
    formacaoTexto = data.pt;
    formacaoTextoIngles = data.en;
  } else if (formacao.hasOwnProperty('GRADUACAO')) {
    const data = buildFromItem(formacao['GRADUACAO'], 'Graduado;', 'Graduate;');
    formacaoTexto = data.pt;
    formacaoTextoIngles = data.en;
  }

  return {
    formacaoTexto,
    formacaoTextoIngles,
  };
}

function extractPublicacoes(xmlText) {
  const publicacoes = xmlText?.['CURRICULO-VITAE']?.['PRODUCAO-BIBLIOGRAFICA'];
  const publicDict = {};

  if (!publicacoes) return publicDict;

  for (const i in publicacoes) {
    const val = publicacoes[i];

    for (const j in val) {
      const subVal = val[j];

      if (Array.isArray(subVal)) {
        publicDict[j] = [];
        for (const item of subVal) {
          publicDict[j].push(getPublicDict(item));
        }
      } else if (subVal?.hasOwnProperty?.('AUTORES')) {
        publicDict[j] = [getPublicDict(subVal)];
      } else if (subVal && typeof subVal === 'object') {
        for (const k in subVal) {
          const nested = subVal[k];

          if (Array.isArray(nested)) {
            publicDict[k] = [];
            for (const item of nested) {
              publicDict[k].push(getPublicDict(item));
            }
          } else if (nested?.hasOwnProperty?.('AUTORES')) {
            publicDict[k] = [getPublicDict(nested)];
          }
        }
      }
    }
  }

  return publicDict;
}

function extractProjetos(xmlText, nomeCompleto, lattesId) {
  const instituicoes =
    xmlText?.['CURRICULO-VITAE']?.['DADOS-GERAIS']?.[
      'ATUACOES-PROFISSIONAIS'
    ]?.['ATUACAO-PROFISSIONAL'] ?? [];

  const projetos = getProjetosFromInstituicao(instituicoes);
  const projectDict = { projetos: [] };

  if (!projetos) {
    return projectDict;
  }

  const participacoes = ensureArray(projetos['PARTICIPACAO-EM-PROJETO']);

  for (const participacao of participacoes) {
    const projetosPesquisa = ensureArray(participacao?.['PROJETO-DE-PESQUISA']);

    for (const projeto of projetosPesquisa) {
      if (!projeto) continue;

      const project = getProjectDict(projeto, nomeCompleto, lattesId);
      projectDict.projetos.push(project);
    }
  }

  return projectDict;
}

function getTipoOrientacao(tipo) {
  switch (tipo) {
    case 'ORIENTACAO-EM-ANDAMENTO-DE-DOUTORADO':
    case 'ORIENTACOES-CONCLUIDAS-PARA-DOUTORADO':
      return 3;
    case 'ORIENTACAO-EM-ANDAMENTO-DE-MESTRADO':
    case 'ORIENTACOES-CONCLUIDAS-PARA-MESTRADO':
      return 2;
    case 'ORIENTACAO-EM-ANDAMENTO-DE-POS-DOUTORADO':
    case 'ORIENTACOES-CONCLUIDAS-PARA-POS-DOUTORADO':
      return 4;
    default:
      return 1;
  }
}

function extractOrientacoes(xmlText) {
  const orientacaoDict = { orientacoes: [] };

  const orientacoesAndamento =
    xmlText?.['CURRICULO-VITAE']?.['DADOS-COMPLEMENTARES']?.[
      'ORIENTACOES-EM-ANDAMENTO'
    ];

  if (orientacoesAndamento) {
    for (const tipo in orientacoesAndamento) {
      const t = getTipoOrientacao(tipo);
      const items = ensureArray(orientacoesAndamento[tipo]);

      for (const item of items) {
        const orientacao: any = getGuidenceDict(item);
        orientacao.tipo = t;
        orientacao.status = 1;
        orientacaoDict.orientacoes.push(orientacao);
      }
    }
  }

  const orientacoesConcluida =
    xmlText?.['CURRICULO-VITAE']?.['OUTRA-PRODUCAO']?.[
      'ORIENTACOES-CONCLUIDAS'
    ];

  if (orientacoesConcluida) {
    for (const tipo in orientacoesConcluida) {
      const t = getTipoOrientacao(tipo);
      const items = ensureArray(orientacoesConcluida[tipo]);

      for (const item of items) {
        const orientacao: any = getGuidenceDict(item);
        orientacao.tipo = t;
        orientacao.status = 0;
        orientacaoDict.orientacoes.push(orientacao);
      }
    }
  }

  return orientacaoDict;
}

function extractPremios(xmlText) {
  const premios =
    xmlText?.['CURRICULO-VITAE']?.['DADOS-GERAIS']?.['PREMIOS-TITULOS']?.[
      'PREMIO-TITULO'
    ];

  const premiosArr = [];
  const items = ensureArray(premios);

  for (const premio of items) {
    premiosArr.push({
      titulo: premio?.['_NOME-DO-PREMIO-OU-TITULO'] || '',
      ano: premio?.['_ANO-DA-PREMIACAO'] || '',
      entidade: premio?.['_NOME-DA-ENTIDADE-PROMOTORA'] || '',
    });
  }

  return { premios: premiosArr };
}

function parseLattesXmlString(xmlString) {
  const x2js = new X2JS();
  return x2js.xml2js(xmlString);
}

async function parseLattesXmlFile(filePath, encoding = 'latin1') {
  const xmlString = await fs.readFile(filePath, 'latin1');
  return parseLattesXmlString(xmlString);
}

async function getCompleteDataFromFile(filePath) {
  const xmlText = await parseLattesXmlFile(filePath);
  return {
    publicacoes: extractPublicacoes(xmlText),
  };
}

export async function getCompleteFormDataFromFile(filePath) {
  const xmlText = await parseLattesXmlFile(filePath);

  const nomeCompleto =
    xmlText?.['CURRICULO-VITAE']?.['DADOS-GERAIS']?.['NOME-COMPLETO'] || '';

  const dataAtualizacao =
    xmlText?.['CURRICULO-VITAE']?.['_DATA-ATUALIZACAO'] || '';

  const formacao =
    xmlText?.['CURRICULO-VITAE']?.['DADOS-GERAIS']?.[
      'FORMACAO-ACADEMICA-TITULACAO'
    ];

  const { formacaoTexto, formacaoTextoIngles } = buildFormacaoTexto(formacao);

  const userDict = {
    lattesId: xmlText?.['CURRICULO-VITAE']?.['_NUMERO-IDENTIFICADOR'] || '',
    resumo:
      xmlText?.['CURRICULO-VITAE']?.['DADOS-GERAIS']?.['RESUMO-CV']?.[
        '_TEXTO-RESUMO-CV-RH'
      ] || '',
    resumoIngles:
      xmlText?.['CURRICULO-VITAE']?.['DADOS-GERAIS']?.['RESUMO-CV']?.[
        '_TEXTO-RESUMO-CV-RH-EN'
      ] || '',
    ultimaAtualizacao: new Date(),
    // ultimaAtualizacao: parseDateDDMMYYYY(dataAtualizacao),
    formacao: formacaoTexto,
    formacaoIngles: formacaoTextoIngles,
    dataAtualizacaoXml: dataAtualizacao,
  };

  const publicacoes = extractPublicacoes(xmlText);
  const projetos = extractProjetos(xmlText, nomeCompleto, userDict.lattesId);
  const orientacoes = extractOrientacoes(xmlText);
  const premios = extractPremios(xmlText);

  return {
    info: userDict,
    publicacoes,
    projetos,
    orientacoes,
    premios,
  };
}
