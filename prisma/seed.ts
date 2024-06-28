import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.usuario.create({
    data: {
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
      endereco:
        'Rua Real, Nº 171, Conjunto Real, Bairro Real, Manaus-AM, CEP 00000-000',
      telCelular: '(92) 00000-0000',
      telResidencial: '(92) 00000-0000',
      unidade: 'IComp',
      turno: 'Matutino e Vespertino',
      idLattes: 1234567891011121,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  await prisma.usuario.create({
    data: {
      nomeCompleto: 'JhonDoe',
      cpf: '222.222.222-22',
      senhaHash: '$2a$12$8T7iExFehnA52apHy4ux3.ILtp41fcNq/aFuJ6OtxGZaAee5sGvNa',
      tokenResetSenha: null,
      validadeTokenResetSenha: null,
      email: 'Jhoe@icomp.ufam.edu.br',
      status: 1,
      administrador: 0,
      coordenador: 0,
      secretaria: 0,
      professor: 1,
      siape: '0401114',
      dataIngresso: '27/11/1989',
      endereco:
        'Rua Real, Nº 171, Conjunto Real, Bairro Real, Manaus-AM, CEP 00000-000',
      telCelular: '(92) 00000-0000',
      telResidencial: '(92) 00000-0000',
      unidade: 'IComp',
      turno: 'Matutino e Vespertino',
      idLattes: 126842094567,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  await prisma.linhasDePesquisa.create({
    data: {
      id: 1,
      nome: 'Banco de Dados e Recuperacao de Informacao',
      sigla: 'BD e RI',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
}
// Gera todas as seeds
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
