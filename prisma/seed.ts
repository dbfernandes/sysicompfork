import { PrismaClient } from '@prisma/client';
import { candidatos } from './seed-data/candidatos.ts';
import { editais } from './seed-data/editais.ts';
import { linhasDePesquisa } from './seed-data/linhasDePesquisa.ts';
import { usuarios } from './seed-data/usuarios.ts';

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async (prisma) => {
    await prisma.usuario.createMany({
      data: usuarios,
      skipDuplicates: true,
    });

    await prisma.linhaPesquisa.createMany({
      data: linhasDePesquisa,
      skipDuplicates: true,
    });

    await prisma.edital.createMany({
      data: editais,
    });
    console.log('candidatos criados');
    await prisma.candidato.createMany({
      data: candidatos,
      skipDuplicates: true,
    });
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
