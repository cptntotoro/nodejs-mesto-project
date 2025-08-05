import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';

const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const requestLogPath = path.join(logsDir, 'request.log');
const errorLogPath = path.join(logsDir, 'error.log');

const logToFile = (filePath: string, data: object) => {
  const logEntry = `${JSON.stringify({
    timestamp: new Date().toISOString(),
    ...data,
  })}\n`;

  fs.appendFile(filePath, logEntry, (err) => {
    // eslint-disable-next-line no-console
    if (err) console.error('Failed to write log:', err);
  });
};

export const logRequest = (req: Request, res: Response, next: Function) => {
  const {
    method, originalUrl, body, params, query,
  } = req;

  logToFile(requestLogPath, {
    type: 'request',
    method,
    path: originalUrl,
    body,
    params,
    query,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  next();
};

export const logError = (err: Error, req: Request) => {
  const {
    method, originalUrl, body, params, query,
  } = req;

  logToFile(errorLogPath, {
    type: 'error',
    method,
    path: originalUrl,
    body,
    params,
    query,
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
    },
    timestamp: new Date().toISOString(),
    ip: req.ip,
  });
};
