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

export type FormPassoDadosDto = {
  teste: string;
};
export type MudarSenhaDto = {
  token: string;
  senha: string;
};
