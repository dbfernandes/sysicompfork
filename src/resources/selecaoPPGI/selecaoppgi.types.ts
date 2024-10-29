import { Candidato } from '@prisma/client';

export const CURRICULUM_FILE = 'Curriculum.pdf';
export const PROVA_ANTERIOR_FILE = 'ProvaAnterior.pdf';
export const PROPOSTA_FILE = 'PropostaTrabalho.pdf';
export const COMPROVANTE_FILE = 'ComprovantePagamento.pdf';
export const CARTA_ACEITE_ORIENTADOR_FILE = 'CartaAceiteOrientador.pdf';

export enum Nacionalidade {
  BRASILEIRA = 'Brasileira',
  ESTRANGEIRA = 'Estrangeira',
}

export type SignInDto = Pick<Candidato, 'email' | 'idEdital'> & {
  senha: string;
};

export type SignUpDto = Pick<Candidato, 'email' | 'idEdital'> & {
  senha: string;
};

export type RecoverPasswordDto = Pick<Candidato, 'email' | 'idEdital'>;
