import { StatusCodes } from 'http-status-codes';
import { BaseError } from '../../../utils/baseError';

export class TokenInvalidoError extends BaseError {
  constructor() {
    super('Token inválido.', StatusCodes.UNAUTHORIZED);
  }
}
