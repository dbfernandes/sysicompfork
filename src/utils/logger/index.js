const winston = require('winston');
const path = require('path');
// Custom tamplate for logs
// const logFormat = winston.format.printf(({ level, message, timestamp }) => {
//     return `${timestamp} ${level}: ${message}`;
// });

// Caminho para a pasta de logs
const logDir = path.join(__dirname, '../../../logs');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
//   defaultMeta: { service: 'user-service' },
  transports: [ new winston.transports.File({ filename: path.join(logDir, 'info.log') }) ]
});

export default logger;