import { StatusCodes } from 'http-status-codes';
import { BaseError } from '@utils/baseError';

export class SalaAlreahyReservedError extends BaseError {
  constructor() {
    super(
      'Sala já está reservada para a data selecionada',
      StatusCodes.CONFLICT,
    );
  }
}
