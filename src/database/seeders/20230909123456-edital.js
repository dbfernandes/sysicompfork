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
        cartaOrientador: 'on',
        cartaRecomendacao: 'on',
        documento: 'http://www.propesp.ufam.edu.br',
        dataInicio: '2023-09-08',
        dataFim: '2023-10-15',        
        status: '1',
      },
      {
        editalId: '002-2023',
        vagaDoutorado: 6,
        cotasDoutorado: 8,
        vagaMestrado: 1,
        cotasMestrado: 3,
        cartaOrientador: 'off',
        cartaRecomendacao: 'on',
        documento: 'http://www.propesp.ufam.edu.br',
        dataInicio: '2023-09-08',
        dataFim: '2023-10-15',        
        status: '1',
      },
      {
        editalId: '003-2023',
        vagaDoutorado: 9,
        cotasDoutorado: 2,
        vagaMestrado: 2,
        cotasMestrado: 3,
        cartaOrientador: 'on',
        cartaRecomendacao: 'off',
        documento: 'http://www.propesp.ufam.edu.br',
        dataInicio: '2023-07-10',
        dataFim: '2023-18-11',
        status: '1',
      },
      {
        editalId: '004-2023',
        vagaDoutorado: 5,
        cotasDoutorado: 2,
        vagaMestrado: 10,
        cotasMestrado: 3,
        cartaOrientador: 'off',
        cartaRecomendacao: 'off',
        documento: 'http://www.propesp.ufam.edu.br',
        dataInicio: '2023-09-08',
        dataFim: '2023-10-15',        
        status: '1',
      },
      
    ]);

   
  },

  down: async (queryInterface, Sequelize) => {
    
  },
};
