type LogLevel = "DEBUG" | "LOG" | "WARN" | "ERROR";

export interface LogFn {
  (message?: unknown, ...optionalParams: unknown[]): void;
}

export interface Logger {
  log: LogFn;
  debug: LogFn;
  warn: LogFn;
  error: LogFn;
}

const EMPTY_LOG_FN: LogFn = () => {
  /* noop */
};

export class ConsoleLogger implements Logger {
  readonly log: LogFn;
  readonly debug: LogFn;
  readonly warn: LogFn;
  readonly error: LogFn;

  constructor(options?: { logLevel: LogLevel }) {
    const { logLevel } = options ?? {};

    this.error = console.error.bind(console);
    this.warn = console.warn.bind(console);

    if (logLevel === "WARN") {
      this.log = EMPTY_LOG_FN;
      this.debug = EMPTY_LOG_FN;
      return;
    }

    this.log = console.log.bind(console);
    this.debug = console.debug.bind(console);
  }
}

const logLevel = import.meta.env.VITE_LOG_LEVEL as LogLevel;
export const logger = new ConsoleLogger({ logLevel: logLevel });
