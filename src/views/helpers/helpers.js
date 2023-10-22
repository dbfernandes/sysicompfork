const moment = require('moment-timezone');

const ops = {
  ['not']: (v1) => !v1,
  ['!']: (v1) => !v1,
  ['and']: (v1, v2) => v1 && v2,
  ['&&']: (v1, v2) => v1 && v2,
  ['or']: (v1, v2) => v1 || v2,
  ['||']: (v1, v2) => v1 || v2,
  ['eq']: (v1, v2) => v1 == v2,
  ['==']: (v1, v2) => v1 == v2,
  ['ne']: (v1, v2) => v1 != v2,
  ['!=']: (v1, v2) => v1 != v2,
  ['eqf']: (v1, v2) => v1 === v2,
  ['===']: (v1, v2) => v1 === v2,
  ['nef']: (v1, v2) => v1 !== v2,
  ['!==']: (v1, v2) => v1 !== v2,
  ['gt']: (v1, v2) => v1 > v2,
  ['>']: (v1, v2) => v1 > v2,
  ['gte']: (v1, v2) => v1 >= v2,
  ['>=']: (v1, v2) => v1 >= v2,
  ['lt']: (v1, v2) => v1 < v2,
  ['<']: (v1, v2) => v1 < v2,
  ['lte']: (v1, v2) => v1 <= v2,
  ['<=']: (v1, v2) => v1 <= v2,
};

const autorizarUsuario = (tipos, autorizacao) => {
  if(autorizacao == "administrador"){
    return tipos.administrador || tipos.secretaria 
  }else if(autorizacao == "coordenador"){
    return tipos.administrador || tipos.secretaria || tipos.coordenador
  }else if(autorizacao == "professor"){
    return tipos.administrador || tipos.secretaria || tipos.professor
  }
}

const ifEqual = (a, b, options) => {
  if (a === b)
      return options.fn(this)
  return options.inverse(this)
}


const checked = (a, b) => {
  if (a == b)
      return 'selected'
  return ''
}

const checked_in = (a, b) => {
  if (a.includes(b))
      return 'selected'
  return ''
}


const checked_unica = (a) => {
  if (typeof a !== "undefined")
      return 'selected'
  return ''
}


const getJsonContext = (data, options) => {
    return options.fn(JSON.parse(data));
};

const showError = function (errors, field) {
    if (errors instanceof Array) {
      const error = errors.find((e) => e.path == field);
      return error ? error.message : '';
    } else if (errors instanceof Object) {
      const error = errors[field];
      if (error instanceof Array) return error[0];
      else if (typeof error == 'string') return error;
      return '';
    }
  };

const add = (a, b) => {
    return a + b;
};


const formataData = (data) => {
  return moment(data).format('DD/MM/YYYY');
}


module.exports = { ...ops, ifEqual, checked, add, showError,checked_in, checked_unica, autorizarUsuario, formataData }

