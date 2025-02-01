import { Prisma } from '@prisma/client';

// Candidato 2 = Token de reset de senha inválido pelo tempo
const dataAtual = new Date();
export const candidatos: Prisma.CandidatoCreateManyInput[] = [
  {
    nome: 'Candidato teste',
    email: 'francisco.junior@icomp.ufam.edu.br',
    senhaHash: '$2a$12$8T7iExFehnA52apHy4ux3.ILtp41fcNq/aFuJ6OtxGZaAee5sGvNa', // senha: senha123
    editalId: '001',
    posicaoEdital: 1,
  },
  {
    nome: 'Candidato teste 2',
    email: 'rivailjunior0906@gmail.com',
    senhaHash: '$2a$12$8T7iExFehnA52apHy4ux3.ILtp41fcNq/aFuJ6OtxGZaAee5sGvNa', // senha: senha123
    editalId: '001',
    posicaoEdital: 1,
    tokenResetSenha: 'f4ab2380176f355dcc2f8e8c0b1d55f750178a7',
    validadeTokenReset: new Date(
      dataAtual.getTime() - 1000 * 60 * 60 * 24,
    ).toISOString(),
  },
];
