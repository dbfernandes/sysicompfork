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

const getYearActual = () => {
  return new Date().getFullYear();
};

const isEnLng = (lng) => {
  return lng === 'en';
};

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

/* eslint-disable eqeqeq */
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

const ifEqual = (a, b, options) => {
  if (a === b) {
    return options.fn(this);
  }
  return options.inverse(this);
};

const checked = (a, b) => {
  if (a == b) {
    return 'selected';
  }
  return '';
};

const checkedIn = (a, b) => {
  if (a && a.includes(b)) {
    return 'checked';
  }
  return '';
};

const checkedUnica = (a) => {
  if (a !== '') {
    return 'checked';
  }
  return '';
};

// const getJsonContext = (data, options) => {
//   return options.fn(JSON.parse(data))
// }

const showError = function (errors, field) {
  if (errors instanceof Array) {
    const error = errors.find((e) => e.path == field);
    return error ? error.message : '';
  } else if (errors instanceof Object) {
    const error = errors[field];
    if (error instanceof Array) return error[0];
    else if (typeof error === 'string') return error;
    return '';
  }
};

const add = (a, b) => {
  return a + b;
};
const formataBioSex = (data) => {
  if (data === 'M') {
    return 'Masculino';
  } else if (data === 'F') {
    return 'Feminino';
  } else {
    return 'Outro';
  }
};
const formataData = (data) => {
  return moment(data).format('DD/MM/YYYY');
};
const formataDataLng = (data, lng) => {
  if (lng === 'en') {
    return moment(data).format('MM/DD/YYYY');
  }
  return moment(data).format('DD/MM/YYYY');
};
const formataFormacao = (formacao, lng) => {
  const formacaoArr = formacao.split(';');
  let prep = ' em ';
  if (lng === 'en') {
    prep = ' in ';
  }
  return (
    formacaoArr[0] +
    prep +
    formacaoArr[1] +
    '. ' +
    formacaoArr[2] +
    ', ' +
    formacaoArr[3] +
    '.'
  );
};
const formataFormacaoTitulo = (formacao, lng) => {
  const formacaoArr = formacao.split(';');
  let prep = ' em ';
  if (lng == 'en') {
    prep = ' in ';
  }
  return formacaoArr[0] + prep + formacaoArr[1];
};
const formataFormacaoLocal = (formacao) => {
  const formacaoArr = formacao.split(';');
  return formacaoArr[2];
};
const formataFormacaoAno = (formacao) => {
  const formacaoArr = formacao.split(';');
  return formacaoArr[3];
};

const validaLabel = (status, dataInicio, dataFim, options) => {
  const dataAtual = new Date();
  console.log(dataAtual);
  console.log(dataInicio);
  if (status == '1') {
    if (moment(dataAtual).isBefore(dataInicio)) {
      return '<span class="badge bg-info">Não Iniciado</span>';
    } else if (moment(dataAtual).isAfter(dataFim)) {
      return '<span class="badge bg-warning">Encerrado</span>';
    } else {
      return '<span class="badge bg-success">Aberto</span>';
    }
  } else {
    return options.inverse(this);
  }
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

  // Verifique se 'date' é uma instância de Date ou uma string válida
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return '';
  }

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
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  return dateObj.toLocaleString();
}
module.exports = {
  ...ops,
  ifEqual,
  checked,
  add,
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
};
