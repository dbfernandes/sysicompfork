import { StatusCodes } from 'http-status-codes';
import { BaseError } from '../../../utils/baseError';

export class TokenExpiradoError extends BaseError {
  constructor() {
    super('Token expirado.', StatusCodes.UNAUTHORIZED);
  }
}
