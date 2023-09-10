
const ifEqual = (a, b, options) => {
    if (a === b)
        return options.fn(this)
    return options.inverse(this)
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

module.exports = { ifEqual, add, showError }