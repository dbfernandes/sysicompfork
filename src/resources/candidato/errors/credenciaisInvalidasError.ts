import { StatusCodes } from 'http-status-codes';
import { BaseError } from '../../../utils/baseError';

export class CredenciaisInvalidasError extends BaseError {
  constructor() {
    super(
      'Recuperação de senha inválida ou token expirado.',
      StatusCodes.BAD_REQUEST,
    );
  }
}
