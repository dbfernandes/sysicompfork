
const ifEqual = (a, b, options) => {
    if (a === b)
        return options.fn(this)
    return options.inverse(this)
}


const getJsonContext = (data, options) => {
    return options.fn(JSON.parse(data));
};

const add = (a, b) => {
    return a + b;
};

module.exports = { ifEqual, add }