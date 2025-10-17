import moment from 'moment-timezone';
import language from '../../utils/i18n';

const whichCourse = (course, lng) => {
  const i18n = language.i18next;
  i18n.changeLanguage(lng);
  switch (course) {
    case 'Processamento de Dados':
      return i18n.t('students.processamentoDeDados');
    case 'Ciência Da Computação':
      return i18n.t('students.cienciaDaComputacao');
    case 'Engenharia de Software / Sistemas de Informação':
      return i18n.t('students.engenhariaESistemas');
    case 'Mestrado':
      return i18n.t('students.mestrado');
    case 'Doutorado':
      return i18n.t('students.doutorado');
  }
};

function formatarNome(nome) {
  if (!nome) return '';
  const partes = nome.split(' ');
  if (partes.length <= 2) return nome; // Retorna o nome completo se tiver apenas duas partes
  const primeiroNome = partes[0];
  const ultimoNome = partes[partes.length - 1];
  const nomeMeio = partes
    .slice(1, -1)
    .map((p) => p.charAt(0).toUpperCase() + '.')
    .join(' ');
  return `${primeiroNome} ${nomeMeio} ${ultimoNome}`;
}

function section(name, options) {
  if (!this._sections) this._sections = {};
  this._sections[name] = options.fn(this);
  return null; // não renderiza nada aqui
}
function groupByTipo(items) {
  const grouped = {};
  items.forEach((item) => {
    if (!grouped[item.tipoId]) {
      grouped[item.tipoId] = [];
    }
    grouped[item.tipoId].push(item);
  });
  return grouped;
}

const getYearActual = () => new Date().getFullYear();

const isEnLng = (lng) => lng === 'en';

const guidencesOnGoing = (course, lng) => {
  const i18n = language.i18next;
  i18n.changeLanguage(lng);
  switch (course) {
    case 'Graduação':
      return i18n.t('profile.orientacoesDeGraduacaoEmAndamento');
    case 'Mestrado':
      return i18n.t('profile.orientacoesDeMestradoEmAndamento');
    case 'Doutorado':
      return i18n.t('profile.orientacoesDeDoutoradoEmAndamento');
  }
};

const guidencesEnded = (course, lng) => {
  const i18n = language.i18next;
  i18n.changeLanguage(lng);
  switch (course) {
    case 'Graduação':
      return i18n.t('profile.orientacoesDeGraduacaoConcluidas');
    case 'Mestrado':
      return i18n.t('profile.orientacoesDeMestradoConcluidas');
    case 'Doutorado':
      return i18n.t('profile.orientacoesDeDoutoradoConcluidas');
  }
};

const ops = {
  not: (v1) => !v1,
  '!': (v1) => !v1,
  and: (v1, v2) => v1 && v2,
  '&&': (v1, v2) => v1 && v2,
  or: (v1, v2) => v1 || v2,
  '||': (v1, v2) => v1 || v2,
  eq: (v1, v2) => v1 == v2,
  '==': (v1, v2) => v1 == v2,
  ne: (v1, v2) => v1 != v2,
  '!=': (v1, v2) => v1 != v2,
  eqf: (v1, v2) => v1 === v2,
  '===': (v1, v2) => v1 === v2,
  nef: (v1, v2) => v1 !== v2,
  '!==': (v1, v2) => v1 !== v2,
  gt: (v1, v2) => v1 > v2,
  '>': (v1, v2) => v1 > v2,
  gte: (v1, v2) => v1 >= v2,
  '>=': (v1, v2) => v1 >= v2,
  lt: (v1, v2) => v1 < v2,
  '<': (v1, v2) => v1 < v2,
  lte: (v1, v2) => v1 <= v2,
  '<=': (v1, v2) => v1 <= v2,
  notEmpty: (v1) => v1 !== undefined && v1 !== null && v1 !== '',
};

const autorizarUsuario = (tipos, autorizacao) => {
  if (autorizacao === 'administrador' || autorizacao === 'secretaria') {
    return tipos.administrador || tipos.secretaria;
  } else if (autorizacao === 'coordenador') {
    return tipos.administrador || tipos.secretaria || tipos.coordenador;
  } else if (autorizacao === 'professor') {
    return tipos.administrador || tipos.secretaria || tipos.professor;
  }
};

const ifEqual = function (a, b, options) {
  if (a === b) {
    return options.fn(this);
  }
  return options.inverse(this);
};

const checked = (a, b) => (a == b ? 'selected' : '');

const checkedIn = (a, b) => (a && a.includes(b) ? 'checked' : '');

const checkedUnica = (a) => (a !== '' ? 'checked' : '');

const showError = (errors, field) => {
  if (Array.isArray(errors)) {
    const error = errors.find((e) => e.path == field);
    return error ? error.message : '';
  } else if (typeof errors === 'object' && errors !== null) {
    const error = errors[field];
    if (Array.isArray(error)) return error[0];
    else if (typeof error === 'string') return error;
    return '';
  }
  return '';
};

const add = (a, b) => a + b;

const formataBioSex = (data) => {
  if (data === 'M') return 'Masculino';
  if (data === 'F') return 'Feminino';
  return 'Outro';
};

const formataData = (data) => moment(data).format('DD/MM/YYYY');

const formataDataLng = (data, lng) => {
  return moment(data).format(lng === 'en' ? 'MM/DD/YYYY' : 'DD/MM/YYYY');
};

const formataFormacao = (formacao, lng) => {
  if (!formacao) return '-';
  const arr = formacao.split(';');
  const prep = lng === 'en' ? ' in ' : ' em ';
  return arr[0] + prep + arr[1] + '. ' + arr[2] + ', ' + arr[3] + '.';
};

const formataFormacaoTitulo = (formacao, lng) => {
  const arr = formacao.split(';');
  const prep = lng === 'en' ? ' in ' : ' em ';
  return arr[0] + prep + arr[1];
};

const formataFormacaoLocal = (formacao) => formacao.split(';')[2];
const formataFormacaoAno = (formacao) => formacao.split(';')[3];

const validaLabel = (status, dataInicio, dataFim, options) => {
  const now = new Date();
  if (status == '1') {
    if (moment(now).isBefore(dataInicio)) {
      return '<span class="badge bg-info">Não Iniciado</span>';
    } else if (moment(now).isAfter(dataFim)) {
      return '<span class="badge bg-warning">Encerrado</span>';
    } else {
      return '<span class="badge bg-success">Aberto</span>';
    }
  }
  return options.inverse(this);
};

function setTitle(options) {
  this.title = options.hash.title;
  return '';
}

function concat() {
  return Array.prototype.slice.call(arguments, 0, -1).join('');
}

function dataAtualExtensa() {
  const date = new Date();
  return date.toLocaleString('pt-BR', {
    timeZone: 'America/Manaus',
    timeZoneName: 'long',
  });
}

function formatarDataExtensa(date) {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  return dateObj.toLocaleDateString('pt-BR', {
    timeZone: 'America/Manaus',
    timeZoneName: 'long',
  });
}

function dataAtualToLocaleString() {
  return new Date().toLocaleString();
}

function dataToLocaleString(date) {
  if (!date) return '';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';
  return dateObj.toLocaleString();
}
function safeJson(ctx) {
  const json = JSON.stringify(ctx);
  // evita fechar <script> e caracteres problemáticos
  return json
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
export default {
  ...ops,
  safeJson,
  ifEqual,
  checked,
  add,
  formatarNome,
  showError,
  checkedIn,
  checkedUnica,
  autorizarUsuario,
  formataBioSex,
  formataData,
  formataDataLng,
  validaLabel,
  formataFormacao,
  formataFormacaoLocal,
  formataFormacaoTitulo,
  formataFormacaoAno,
  whichCourse,
  guidencesOnGoing,
  guidencesEnded,
  isEnLng,
  setTitle,
  concat,
  formatarDataExtensa,
  dataAtualExtensa,
  dataAtualToLocaleString,
  dataToLocaleString,
  getYearActual,
  groupByTipo,
  section,
};
