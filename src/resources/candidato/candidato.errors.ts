import { StatusCodes } from 'http-status-codes';
import { BaseError } from '../../utils/baseError';

export class CandidatoNotFoundError extends BaseError {
  constructor(email: string) {
    super(
      `Candidato com o e-mail ${email} não encontrado.`,
      StatusCodes.NOT_FOUND,
    );
  }
}

export class InvalidPasswordRecoveryError extends BaseError {
  constructor() {
    super(
      'Recuperação de senha inválida ou token expirado.',
      StatusCodes.BAD_REQUEST,
    );
  }
}
