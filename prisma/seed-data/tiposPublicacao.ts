import { Prisma } from '@prisma/client';
// Candidato 2 = Token de reset de senha inválido pelo tempo
const dataAtual = new Date();
export const tiposPublicacoes: Prisma.TipoPublicacaoCreateManyInput[] = [
  {
    nome: 'Artigos Publicados em Conferências',
    chave: 'TRABALHO-EM-EVENTOS',
    createdAt: dataAtual,
    updatedAt: dataAtual,
  },
  {
    nome: 'Artigos Publicados em Periódicos',
    chave: 'ARTIGO-PUBLICADO',
    createdAt: dataAtual,
    updatedAt: dataAtual,
  },
  {
    nome: 'Livros Publicados',
    chave: 'LIVRO-PUBLICADO-OU-ORGANIZADO',
    createdAt: dataAtual,
    updatedAt: dataAtual,
  },
  {
    nome: 'Capítulos de Livros Publicados',
    chave: 'CAPITULO-DE-LIVRO-PUBLICADO',
    createdAt: dataAtual,
    updatedAt: dataAtual,
  },
  {
    nome: 'Trabalhos Técnicos ou Relatórios Científicos',
    chave: 'OUTRA-PRODUCAO-BIBLIOGRAFICA',
    createdAt: dataAtual,
    updatedAt: dataAtual,
  },
  {
    nome: 'Prefácio ou Posfácio',
    chave: 'PREFACIO-POSFACIO',
    createdAt: dataAtual,
    updatedAt: dataAtual,
  },
];
