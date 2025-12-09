import { StatusCodes } from 'http-status-codes';
import { BaseError } from '@utils/baseError';

export class DefesaNaoEncontradaError extends BaseError {
  constructor() {
    super('Defesa não encontrada.', StatusCodes.NOT_FOUND);
  }
}

export class TransicaoInvalidaError extends BaseError {
  constructor(msg?: string) {
    super(msg ?? 'Transição de status inválida.', StatusCodes.CONFLICT);
  }
}
