import { PrismaClient } from '@prisma/client';
import { candidatos } from './seed-data/candidatos';
import { editais } from './seed-data/editais';
import { linhasDePesquisa } from './seed-data/linhasDePesquisa';
import { usuarios } from './seed-data/usuarios';

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
      skipDuplicates: true,
    });

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
