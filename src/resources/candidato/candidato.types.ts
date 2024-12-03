import { Candidato } from '@prisma/client';

export type CreateCandidatoDto = Pick<
  Candidato,
  | 'email'
  | 'senhaHash'
  | 'editalId'
  | 'posicaoEdital'
  | 'linhaPesquisaId'
  | 'telefone'
  | 'nome'
  | 'bairro'
  | 'cep'
  | 'cidade'
  | 'bolsista'
  | 'anoEgressoGraduacao'
  | 'cursoPos'
  | 'instituicaoGraduacao'
  | 'comoSoube'
  | 'condicao'
  | 'condicaoTipo'
  | 'cotista'
  | 'cotistaTipo'
  | 'cursoDesejado'
  | 'anoEgressoPos'
  | 'cursoGraduacao'
  | 'instituicaoPos'
  | 'tipoPos'
  | 'endereco'
  | 'nacionalidade'
  | 'dataNascimento'
  | 'nomeSocial'
  | 'regime'
  | 'sexo'
  | 'telefoneSecundario'
  | 'uf'
>;

export type UpdateCandidatoDto = Partial<CreateCandidatoDto>;

export type CandidatoSemSenha = Omit<Candidato, 'senhaHash'>;

export interface Publicacao {
  titulo?: string;
  ano?: number;
  local?: string;
  natureza?: string;
  autores: {
    nomeCompleto: string[];
  };
  issn?: string;
}
