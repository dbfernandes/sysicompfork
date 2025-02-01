import { StatusCodes } from 'http-status-codes';
import { BaseError } from '../../../utils/baseError';

export class CandidatoJaExisteError extends BaseError {
  constructor() {
    super('Candidato já cadastrado para este edital.', StatusCodes.CONFLICT);
  }
}
