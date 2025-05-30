import winston from 'winston';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

// Caminho para a pasta de logs
const logDir = path.join(__dirname, '../../../logs');

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json(),
  ),
  // level: 'info',
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'info.log') }),
  ],
});

export function resgistro(req: Request, res: Response, next: NextFunction) {
  if (req.session.uid) {
    logger.info(
      `USER ID:${req.session.uid}, URL: ${req.originalUrl}, SESSION ID: ${req.session.id}`,
    );
  }
  next();
}

export default resgistro;
