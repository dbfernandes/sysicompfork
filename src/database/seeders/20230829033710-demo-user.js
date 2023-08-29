'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    return queryInterface.bulkInsert('Usuario', [{
      nome: 'Usuario de teste inicial',
      username: '111.111.111-11',
      shortname: 'Usuario de teste inicial',
      auth_key: 'DbBMIkCPgYjyhuTQgdjTUxPpPk_HQtLG',
      password_hash: '$2a$12$8T7iExFehnA52apHy4ux3.ILtp41fcNq/aFuJ6OtxGZaAee5sGvNa',
      password_reset_token: null,
      email: 'email@icomp.ufam.edu.br',
      status: 10,
      visualizacao_candidatos: '2016-03-24 21:12:13',
      visualizacao_candidatos_finalizados: '2016-03-24 21:12:13',
      visualizacao_cartas_respondidas: '2016-03-24 21:12:13',
      administrador: 0,
      coordenador: 0,
      secretaria: 0,
      professor: 1,
      suporte: null,
      aluno: 0,
      siape: '0401114',
      dataIngresso: '27/11/1989',
      endereco: 'Rua Real, Nº 171, Conjunto Real, Bairro Real, Manaus-AM, CEP 00000-000',
      telcelular: '(92) 00000-0000',
      telresidencial: '(92) 00000-00000',
      unidade: 'IComp',
      titulacao: 'Doutor',
      classe: 'Associado',
      nivel: '4',
      regime: 'DE',
      turno: 'Matutino e Vespertino',
      idLattes: 1234567891011121,
      formacao: 'Doutorado;Computer Science - Artificial Intelligence;University of Edinburgh;1998',
      resumo: 'Possui graduação em Engenharia Civil pela Universidade Federal do Amazonas(1986), graduação em Tecnologia Eletrônica pelo Instituto de Tecnologia da Amazônia(1984), mestrado em Automação Industrial pela Universidade Federal do Espírito Santo(1993), doutorado em Computer Science - Artificial Intelligence pela University of Edinburgh(1998) e pós-doutorado pela University of Edinburgh(2010). Atualmente é professor titular da Universidade Federal do Amazonas e Membro de corpo editorial da Revista Brasileira de Informática na Educação (1414-5685). Tem experiência na área de Ciência da Computação, com ênfase em Metodologia e Técnicas da Computação. Atuando principalmente nos seguintes temas:program synthesis, logic programming, intelligent interfaces, knowledge-based systems.',
      alias: 'usuario.teste',
      ultimaAtualizacao: '19/05/2018',
      idRH: 1234,
      cargo: '',
      createdAt: new Date(),
      updatedAt: new Date(),


    }]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
