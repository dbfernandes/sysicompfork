import { Request, Response, NextFunction } from 'express';
import logger from './logger';
import { STATIC_SKIP } from '@utils/constantes';

export function logRequestResponse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // pular estáticos e favicon
  if (STATIC_SKIP.test(req.path) || req.path === '/favicon.ico') {
    return next();
  }

  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number((process.hrtime.bigint() - start) / 1_000_000n);
    logger.info(
      `[RESPONSE] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`,
    );
  });

  return next();
}
