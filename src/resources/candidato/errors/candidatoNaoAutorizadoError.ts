import { StatusCodes } from 'http-status-codes';
import { BaseError } from '../../../utils/baseError';

export class CandidatoNaoAutorizadoError extends BaseError {
  constructor() {
    super('Credenciais inválidas para este edital.', StatusCodes.UNAUTHORIZED);
  }
}
