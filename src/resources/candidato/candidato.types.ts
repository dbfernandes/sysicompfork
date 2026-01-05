import { Candidato } from '@prisma/client';

export type SignInDto = Pick<Candidato, 'email' | 'editalId'> & {
  senha: string;
};

export type SignUpDto = Pick<Candidato, 'email' | 'editalId'> & {
  senha: string;
};

export type RecuperarSenhaDto = NonNullable<
  Pick<Candidato, 'email' | 'editalId'>
>;

export type MudarSenhaDto = {
  token: string;
  senha: string;
};

export enum StepCandidateEdital {
  DADOS_PESSOAIS = 1,
  HISTORICO = 2,
  PROPOSTA = 3,
  REVISAO = 5,
  FINALIZACAO = 4,
}
