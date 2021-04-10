
const ifEqual = (a, b, options) => {
    if (a === b)
        return options.fn(this)
    return options.inverse(this)
}


const getJsonContext = (data, options) => {
    return options.fn(JSON.parse(data));
};

module.exports = { ifEqual }