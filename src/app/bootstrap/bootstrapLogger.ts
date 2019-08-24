import LoggerService, { LogLevel } from 'app/services/LoggerService';

export default function() {
  const logLevel = LogLevel[<LogLevel>process.env.LOG_LEVEL || LogLevel.ERROR];
  return new LoggerService(logLevel);
}
