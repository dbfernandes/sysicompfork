const moment = require('moment-timezone');

const whichCourse = (course, lng) => {
  const language = require('../../utils/i18n.js');
  console.log(course);
  const i18n = language.default.i18next;
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

const isEnLng = (lng) => {
  return lng === 'en';
};

const guidencesOnGoing = (course, lng) => {
  const language = require('../../utils/i18n.js');
  console.log(course);
  const i18n = language.default.i18next;
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
  const language = require('../../utils/i18n.js');
  console.log(course);
  const i18n = language.default.i18next;
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
  console.log(a)
  if (a && a.includes(b)) { return 'checked' }
  return ''
}

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
  const dataAtual = moment.tz('America/Manaus').format('YYYY-MM-DD');

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

module.exports = {
  ...ops,
  ifEqual,
  checked,
  add,
  showError,
  checkedIn,
  checkedUnica,
  autorizarUsuario,
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
};
