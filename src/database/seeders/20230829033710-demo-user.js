const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt')
'use strict';

function gerarCpf() {
  const num1 = aleatorio();
  const num2 = aleatorio();
  const num3 = aleatorio();
  const dig1 = dig(num1, num2, num3);
  const dig2 = dig(num1, num2, num3, dig1); 
  return `${num1}.${num2}.${num3}-${dig1}${dig2}`;
}

function dig(n1, n2, n3, n4) { 
  
  const nums = n1.split("").concat(n2.split(""), n3.split(""));
  if (n4 !== undefined) nums[9] = n4
  let x = 0;
  for (let i = (n4 !== undefined ? 11:10), j = 0; i >= 2; i--, j++) {
    x += parseInt(nums[j]) * i;
  }
  const y = x % 11;
  return y < 2 ? 0 : 11 - y; 
}

function aleatorio() {
  const aleat = Math.floor(Math.random() * 999);
  return ("" + aleat).padStart(3, '0'); 
}

async function createUser(){
  const nomeCompleto = [faker.person.firstName(), faker.person.lastName()].join(" ");
  const unidades = ["ICB", "ICE", "IFCHS", "ICOMP", "FCA", "EEM", "FM", "FCF", "FAO", "FD", "FES", "FEFF", "FACED", "FT", 
  "FAPSI", "FIC", "FAARTES", "FLET"]
  const turnos = ["Matutino e Vespertino", "Matutino e Noturno", "Vespertino e Noturno", "Sem turno selecionado"] 
  let salt = await bcrypt.genSalt(12);
  let senhaHash = await bcrypt.hash("senha123", salt);
  const user = {
    nomeCompleto,
    cpf: gerarCpf(),
    senhaHash,
    tokenResetSenha: null,
    validadeTokenResetSenha: null,
    email: faker.internet.email({firstName: nomeCompleto.split(" ")[0] , lastName: nomeCompleto.split(" ")[1]}),
    status: 1,
    administrador: faker.number.int({ min: 0, max: 1 }),
    coordenador: faker.number.int({ min: 0, max: 1 }),
    secretaria: faker.number.int({ min: 0, max: 1 }),
    professor: faker.number.int({ min: 0, max: 1 }),
    siape: faker.string.numeric({ length: 9, allowLeadingZeros: false }),
    dataIngresso: faker.date.past().toLocaleString("pt-BR", {
        timeZone: 'America/Manaus',
    }).slice(0,10),
    endereco: [faker.location.streetAddress({ useFullAddress: true }), faker.location.city(), faker.location.country()].join(" "),
    telCelular: faker.phone.number("(92) 9####-####"),
    telResidencial: faker.phone.number("(92) 3####-####"),
    unidade: unidades[faker.number.int({ min: 0, max: 17 })],
    turno: turnos[faker.number.int({ min: 0, max: 3 })],
    idLattes: faker.number.int({ min: 10000000000, max: 99999999999 }),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  return user
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const usuarios = [{
      nomeCompleto: 'Usuario de teste inicial',
      cpf: '111.111.111-11',
      senhaHash: '$2a$12$8T7iExFehnA52apHy4ux3.ILtp41fcNq/aFuJ6OtxGZaAee5sGvNa',
      tokenResetSenha: null,
      validadeTokenResetSenha: null,
      email: 'user@icomp.ufam.edu.br',
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

    }]
    for (let i = 0; i < 50; i++) {
      usuarios.push( await createUser());
    }
    return queryInterface.bulkInsert('Usuario', usuarios);
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
