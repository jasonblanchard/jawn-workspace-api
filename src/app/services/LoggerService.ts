import logger, { LogLevelDesc } from 'loglevel';

export enum LogLevel {
  TRACE = 'TRACE',
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SILENT = 'SILENT'
}

// TODO: Build this out.
export default class LoggerService {
  private logger: logger.Logger;

  constructor(loglevel: LogLevelDesc) { // NOTE: Using LogLevelDesc to make sure the LogLevel keys stay in sync with LogLevelDesc options
    this.logger = logger;
    logger.setLevel(loglevel);
  }

  info(message: any, tag: string) {
    this.logger.debug(LoggerService.format('INFO', message, tag));
  }

  debug(message: any, tag: string) {
    this.logger.debug(LoggerService.format('DEBUG', message, tag));
  }

  error(message: any, tag: string) {
    this.logger.error(LoggerService.format('ERROR', message, tag));
  }

  static format(level: string, message: any, tag: string) {
    return `\n${level}: ${tag}\n${JSON.stringify(message, null, 2)}`;
  }
}
