'use strict'
const moment = require('moment-timezone')

const data = moment.tz('America/Manaus').format('YYYY-MM-DD HH:mm:ss')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Edital', [
      {
        editalId: '001-2023',
        vagaDoutorado: 2,
        cotasDoutorado: 2,
        vagaMestrado: 5,
        cotasMestrado: 5,
        cartaOrientador: '1',
        cartaRecomendacao: '1',
        documento: 'http://www.propesp.ufam.edu.br',
        dataInicio: '2023-08-23',
        dataFim: '2023-09-09',
        status: '1',
        inscricoesIniciadas: 0,
        inscricoesEncerradas: 0,
        createdAt: data,
        updatedAt: data
      },
      {
        editalId: '002-2023',
        vagaDoutorado: 6,
        cotasDoutorado: 8,
        vagaMestrado: 1,
        cotasMestrado: 3,
        cartaOrientador: '0',
        cartaRecomendacao: '1',
        documento: 'http://www.propesp.ufam.edu.br',
        dataInicio: '2023-05-27',
        dataFim: '2023-06-027',
        status: '0',
        inscricoesIniciadas: 0,
        inscricoesEncerradas: 0,
        createdAt: data,
        updatedAt: data
      },
      {
        editalId: '003-2023',
        vagaDoutorado: 9,
        cotasDoutorado: 2,
        vagaMestrado: 2,
        cotasMestrado: 3,
        cartaOrientador: '1',
        cartaRecomendacao: '0',
        documento: 'http://www.propesp.ufam.edu.br',
        dataInicio: '2023-07-14',
        dataFim: '2023-08-01',
        status: '1',
        inscricoesIniciadas: 0,
        inscricoesEncerradas: 0,
        createdAt: data,
        updatedAt: data
      },
      {
        editalId: '004-2023',
        vagaDoutorado: 5,
        cotasDoutorado: 2,
        vagaMestrado: 10,
        cotasMestrado: 3,
        cartaOrientador: '0',
        cartaRecomendacao: '0',
        documento: 'http://www.propesp.ufam.edu.br',
        dataInicio: '2023-08-02',
        dataFim: '2023-09-30',
        status: '1',
        inscricoesIniciadas: 0,
        inscricoesEncerradas: 0,
        createdAt: data,
        updatedAt: data
      }

    ])
  },

  down: async (queryInterface, Sequelize) => {

  }
}
