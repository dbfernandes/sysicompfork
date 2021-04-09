var DataTypes = require("sequelize").DataTypes;
var _Usuario = require("./Usuario");

function initModels(sequelize) {
  var Usuario = _Usuario(sequelize, DataTypes);


  return {
    Usuario,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
