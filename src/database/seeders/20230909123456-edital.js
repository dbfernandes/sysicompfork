'use strict';

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
        dataInicio: '18-09-2023',
        dataFim: '20-11-2023',       
        status: '1',
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
        dataInicio: '08-09-2023',
        dataFim: '15-10-2023',        
        status: '1',
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
        dataInicio: '09-09-2023',
        dataFim: '05-12-2023',
        status: '1',
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
        dataInicio: '28-10-2023',
        dataFim: '18-11-2023',        
        status: '1',
      },
      
    ]);

   
  },

  down: async (queryInterface, Sequelize) => {
    
  },
};
