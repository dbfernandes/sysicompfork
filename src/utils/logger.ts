// src/logger.ts
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import fs from 'fs';
import path from 'path';

// Diretório de logs
const logDir = path.join(__dirname, '..', '..', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define cores para os níveis de log
const { combine, timestamp, printf, colorize } = format;

// Define o formato para o console (com cores)
const consoleFormat = combine(
  colorize({ all: true }), // habilita cor para todos os campos
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf((info) => `${info.timestamp} [${info.level}]: ${info.message}`),
);

// Define o formato para o arquivo (sem cor)
const fileFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  printf(
    (info) =>
      `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`,
  ),
);

const logger = createLogger({
  level: 'info',
  transports: [
    // Logs no console (com cor)
    new transports.Console({
      format: consoleFormat,
    }),
    // Logs em arquivo (sem cor)
    new DailyRotateFile({
      filename: path.join(logDir, 'app-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: fileFormat,
    }),
  ],
  exitOnError: false,
});

export default logger;
