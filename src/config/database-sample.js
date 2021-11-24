const { underscoredIf } = require("sequelize/types/lib/utils");

module.exports = {
    dev: {
      username: 'user',
      password: 'password',
      database: 'db',
      host: 'localhost',
      dialect: 'mysql',
      timezone: "-04:00",
      define: {
        timestamps: true,
        underscored: true
      }
    }
}