import { Candidato } from '@prisma/client';

export type SignInDto = Pick<Candidato, 'email' | 'idEdital'> & {
  senha: string;
};

export type SignUpDto = Pick<Candidato, 'email' | 'idEdital'> & {
  senha: string;
};

export type RecoverPasswordDto = Pick<Candidato, 'email' | 'idEdital'>;
