
module.exports = {
    dev: {
      dialect: 'mysql',
      username: 'user',
      password: 'password',
      database: 'db',
      host: 'localhost',
      timezone: "-04:00",
      define: {
        timestamps: true,
        underscored: true
      }
    }
}