import { PrismaClient } from '@prisma/client';
import moment from 'moment-timezone';
const prisma = new PrismaClient();

async function main() {
  await prisma.usuario.upsert({
    where: { email: 'user@icomp.ufam.edu.br' },
    update: {},
    create: {
      nomeCompleto: 'Usuario de teste inicial',
      cpf: '778.864.820-50',
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
      dataIngresso: new Date(),
      endereco:
        'Rua Real, Nº 171, Conjunto Real, Bairro Real, Manaus-AM, CEP 00000-000',
      telCelular: '(92) 00000-0000',
      telResidencial: '(92) 00000-0000',
      unidade: 'IComp',
      turno: 'Matutino e Vespertino',
      lattesId: 1234567891011121,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await prisma.usuario.upsert({
    where: { email: 'Jhoe@icomp.ufam.edu.br' },
    update: {},
    create: {
      nomeCompleto: 'JhonDoe',
      cpf: '202.259.530-05',
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
      dataIngresso: new Date(),
      endereco:
        'Rua Real, Nº 171, Conjunto Real, Bairro Real, Manaus-AM, CEP 00000-000',
      telCelular: '(92) 00000-0000',
      telResidencial: '(92) 00000-0000',
      unidade: 'IComp',
      turno: 'Matutino e Vespertino',
      lattesId: 126842094567,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await prisma.linhaPesquisa.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nome: 'Banco de Dados e Recuperacao de Informacao',
      sigla: 'BD e RI',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const data = moment.tz('America/Manaus').format('YYYY-MM-DDTHH:mm:ssZ');
  const year = new Date().getFullYear();
  const editais = [
    {
      id: '001-2024',
      vagasDoutorado: 2,
      cotasDoutorado: 2,
      vagasMestrado: 5,
      cotasMestrado: 5,
      cartaOrientador: '1',
      cartaRecomendacao: '1',
      documento: 'http://www.propesp.ufam.edu.br',
      dataInicio: new Date(year, 0, 0).toISOString(),
      dataFim: new Date(year, 2, 31).toISOString(),
      status: 1,
      inscricoesIniciadas: 0,
      inscricoesEncerradas: 0,
      createdAt: data,
      updatedAt: data,
    },
    {
      id: '002-2024',
      vagasDoutorado: 6,
      cotasDoutorado: 8,
      vagasMestrado: 1,
      cotasMestrado: 3,
      cartaOrientador: '0',
      cartaRecomendacao: '1',
      documento: 'http://www.propesp.ufam.edu.br',
      dataInicio: new Date(year, 3, 1).toISOString(),
      dataFim: new Date(year, 5, 30).toISOString(),
      status: 0,
      inscricoesIniciadas: 0,
      inscricoesEncerradas: 0,
      createdAt: data,
      updatedAt: data,
    },
    {
      id: '003-2024',
      vagasDoutorado: 9,
      cotasDoutorado: 2,
      vagasMestrado: 2,
      cotasMestrado: 3,
      cartaOrientador: '1',
      cartaRecomendacao: '0',
      documento: 'http://www.propesp.ufam.edu.br',
      dataInicio: new Date(year, 6, 1).toISOString(),
      dataFim: new Date(year, 8, 30).toISOString(),
      status: 1,
      inscricoesIniciadas: 0,
      inscricoesEncerradas: 0,
      createdAt: data,
      updatedAt: data,
    },
    {
      id: '004-2024',
      vagasDoutorado: 5,
      cotasDoutorado: 2,
      vagasMestrado: 10,
      cotasMestrado: 3,
      cartaOrientador: '0',
      cartaRecomendacao: '0',
      documento: 'http://www.propesp.ufam.edu.br',
      dataInicio: new Date(year, 9, 1).toISOString(),
      dataFim: new Date(year, 11, 31).toISOString(),
      status: 1,
      inscricoesIniciadas: 0,
      inscricoesEncerradas: 0,
      createdAt: data,
      updatedAt: data,
    },
  ];

  for (const edital of editais) {
    await prisma.edital.upsert({
      where: { id: edital.id },
      update: {},
      create: edital,
    });
  }
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
