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
        cartaOrientador: 'carta_orientador1.pdf',
        cartaRecomendacao: 'carta_recomendacao1.pdf',
        documento: '',
        dataInicio: '2023-09-08',
        dataFim: '2023-10-15',
        curso: 'Ciência da Computação',
        status: 'ativo',
      },
      {
        editalId: '002-2023',
        vagaDoutorado: 6,
        cotasDoutorado: 8,
        vagaMestrado: 1,
        cotasMestrado: 3,
        cartaOrientador: 'carta_orientador1.pdf',
        cartaRecomendacao: 'carta_recomendacao1.pdf',
        documento: '',
        dataInicio: '2023-09-08',
        dataFim: '2023-10-15',
        curso: 'Ciência da Computação',
        status: 'ativo',
      },
      {
        editalId: '003-2023',
        vagaDoutorado: 9,
        cotasDoutorado: 2,
        vagaMestrado: 2,
        cotasMestrado: 3,
        cartaOrientador: '',
        cartaRecomendacao: '',
        documento: '',
        dataInicio: '2023-07-10',
        dataFim: '2023-18-11',
        curso: 'Engenharia da Computação',
        status: 'ativo',
      },
      {
        editalId: '004-2023',
        vagaDoutorado: 5,
        cotasDoutorado: 2,
        vagaMestrado: 10,
        cotasMestrado: 3,
        cartaOrientador: 'carta.pdf',
        cartaRecomendacao: 'carta.pdf',
        documento: '',
        dataInicio: '2023-09-08',
        dataFim: '2023-10-15',
        curso: 'Engenharia de Software',
        status: 'ativo',
      },
      
    ]);

   
  },

  down: async (queryInterface, Sequelize) => {
    
  },
};
