import { StatusCodes } from 'http-status-codes';
import { BaseError } from '../../../utils/baseError';

export class CandidatoFinalizadoError extends BaseError {
  constructor() {
    super(
      'Candidato já finalizou sua inscrição para este edital.',
      StatusCodes.CONFLICT,
    );
  }
}
