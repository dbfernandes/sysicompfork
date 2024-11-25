import { StatusCodes } from 'http-status-codes';
import { BaseError } from '../../../utils/baseError';

export class CandidatoExisteError extends BaseError {
  constructor() {
    super('Candidato já cadastrado para este edital.', StatusCodes.CONFLICT);
  }
}
