import { Candidato } from '@prisma/client';

export type CreateCandidatoDto = {
  email: string;
  senhaHash: string;
  editalId: string;
  posicaoEdital: number;
  linhaPesquisaId?: number;
  telefone?: string;
  nome?: string;
  bairro?: string;
  cep?: string;
  cidade?: string;
  bolsista: number;
  anoEgressoGraduacao?: number;
  cursoPos?: string;
  instituicaoGraduacao?: string;
  comoSoube?: string;
  condicao: number;
  condicaoTipo?: string;
  cotista: number;
  cotistaTipo?: string;
  cursoDesejado?: string;
  anoEgressoPos?: number;
  cursoGraduacao?: string;
  instituicaoPos?: string;
  tipoPos?: string;
  endereco?: string;
  nacionalidade?: string;
  dataNascimento?: Date;
  nomeSocial?: string;
  regime?: string;
  sexo?: string;
  telefoneSecundario?: string;
  uf?: string;
};

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
