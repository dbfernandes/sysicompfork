import { StatusCodes } from 'http-status-codes';
import { BaseError } from '@utils/baseError';

export class SalaAlreahyReservedError extends BaseError {
  constructor(msg?: string) {
    super(
      `${msg || 'Sala já está reservada nesse período'}`,
      StatusCodes.CONFLICT,
    );
  }
}
