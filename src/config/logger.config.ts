import { Params } from 'nestjs-pino';
import pino from 'pino';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import type { IncomingMessage, ServerResponse } from 'http';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Создаем директорию для логов, если её нет
const logsDir = join(process.cwd(), 'logs');
if (!existsSync(logsDir)) {
  mkdirSync(logsDir, { recursive: true });
}

// Создаем стрим для записи ошибок в файл
const errorLogStream = pino.destination({
  dest: join(logsDir, 'error.log'),
  sync: false,
});

// Базовые опции для pino
const baseOptions: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  formatters: {
    level: (label: string) => {
      return { level: label };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
};

// Создаем основной логгер с записью ошибок в файл
const mainLogger = pino(
  {
    ...baseOptions,
    level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  },
  pino.multistream([
    {
      level: 'error' as pino.Level,
      stream: errorLogStream,
    },
    {
      level: (isDevelopment ? 'debug' : 'info') as pino.Level,
      stream: isDevelopment
        ? (pino.transport({
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }) as NodeJS.WritableStream)
        : process.stdout,
    },
  ]),
);

export const loggerConfig: Params = {
  pinoHttp: {
    logger: mainLogger,
    serializers: {
      req: (req: IncomingMessage) => ({
        method: req.method,
        url: req.url,
        headers: {
          'user-agent': req.headers?.['user-agent'],
        },
      }),
      res: (res: ServerResponse<IncomingMessage>) => ({
        statusCode: res.statusCode,
      }),
      err: pino.stdSerializers.err,
    },
    customLogLevel: (
      req: IncomingMessage,
      res: ServerResponse<IncomingMessage>,
    ) => {
      const statusCode = res.statusCode;
      if (statusCode && statusCode >= 400 && statusCode < 500) {
        return 'warn';
      } else if (statusCode && statusCode >= 500) {
        return 'error';
      }
      return 'info';
    },
    customSuccessMessage: (
      req: IncomingMessage,
      res: ServerResponse<IncomingMessage>,
    ) => {
      return `${req.method} ${req.url} ${res.statusCode}`;
    },
    customErrorMessage: (
      req: IncomingMessage,
      res: ServerResponse<IncomingMessage>,
      error: Error,
    ) => {
      return `${req.method} ${req.url} ${error.message}`;
    },
    customProps: () => ({
      context: 'HTTP',
    }),
  },
};
