import { Request, Response, NextFunction } from 'express';
import logger from './logger'; // seu logger do winston

// Middleware para logar requisição + resposta
export function logRequestResponse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const chunks: Buffer[] = [];

  // Intercepta o body da resposta
  const originalWrite = res.write;
  const originalEnd = res.end;

  res.write = function (chunk) {
    chunks.push(Buffer.from(chunk));
    // eslint-disable-next-line prefer-rest-params
    return originalWrite.apply(res, arguments as any);
  };

  res.end = function (chunk) {
    if (chunk) chunks.push(Buffer.from(chunk));
    const body = Buffer.concat(chunks).toString('utf8');

    logger.info(
      `[RESPONSE] ${req.method} ${req.originalUrl} ${res.statusCode} `,
    );
    // eslint-disable-next-line prefer-rest-params
    return originalEnd.apply(res, arguments as any);
  };

  next();
}
