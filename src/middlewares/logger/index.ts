const winston = require('winston')
const path = require('path')
import { Request, Response, NextFunction } from 'express'
// Custom tamplate for logs
// const logFormat = winston.format.printf(({ level, message, timestamp }) => {
//     return `${timestamp} ${level}: ${message}`;
// });

// Caminho para a pasta de logs
const logDir = path.join(__dirname, '../../../logs')

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  // level: 'info',
  transports: [new winston.transports.File({ filename: path.join(logDir, 'info.log') })]
})

export function resgistro(req:Request, res: Response, next: NextFunction) {
  if (req.session.uid) {
    logger.info(`USER ID:${req.session.uid}, URL: ${req.originalUrl}, SESSION ID: ${req.session.id}`)
  }
  next()
}

export default resgistro
