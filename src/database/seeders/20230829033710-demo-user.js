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
      nomeCompleto: 'Usuario de teste inicial',
      cpf: '111.111.111-11',
      senhaHash: '$2a$12$8T7iExFehnA52apHy4ux3.ILtp41fcNq/aFuJ6OtxGZaAee5sGvNa',
      tokenResetSenha: null,
      validadeTokenResetSenha: null,
      email: 'email@icomp.ufam.edu.br',
      status: 1,
      administrador: 1,
      coordenador: 0,
      secretaria: 0,
      professor: 1,
      siape: '0401114',
      dataIngresso: '27/11/1989',
      endereco: 'Rua Real, Nº 171, Conjunto Real, Bairro Real, Manaus-AM, CEP 00000-000',
      telCelular: '(92) 00000-0000',
      telResidencial: '(92) 00000-0000',
      unidade: 'IComp',
      turno: 'Matutino e Vespertino',
      idLattes: 1234567891011121,
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
