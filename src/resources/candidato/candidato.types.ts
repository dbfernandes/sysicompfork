import { Candidato } from '@prisma/client';

export type SignInDto = Pick<Candidato, 'email' | 'editalId'> & {
  senha: string;
};

export type SignUpDto = Pick<Candidato, 'email' | 'editalId'> & {
  senha: string;
};

export type RecoverPasswordDto = NonNullable<
  Pick<Candidato, 'email' | 'editalId'>
>;

export type ChangePasswordDto = {
  token: string;
  senha: string;
};
