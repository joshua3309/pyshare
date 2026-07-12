import winston from 'winston';

/**
 * Structured logger for all microservices.
 * In production, logs are JSON-formatted for CloudWatch/ELK ingestion.
 */
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: process.env.SERVICE_NAME || 'paysphere',
    version: process.env.SERVICE_VERSION || '1.0.0',
  },
  transports: [
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === 'production'
          ? winston.format.json()
          : winston.format.combine(
              winston.format.colorize(),
              winston.format.simple()
            ),
    }),
  ],
});

export default logger;
