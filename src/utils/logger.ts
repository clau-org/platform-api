interface ILogger {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
}

export type LogLevel = "debug" | "info" | "warn" | "error";
export type LogLevels = {
  [key in LogLevel]: number;
};

class Logger implements ILogger {
  private readonly prefix: string;
  private level: string;
  private levels: LogLevels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(prefix: string, level: LogLevel = "debug") {
    this.prefix = prefix;
    this.level = level;
  }

  private log(level: string, ...args: any[]) {
    const colors: any = {
      debug: "blue",
      info: "green",
      warn: "orange",
      error: "red",
    };

    const logStyles = `color: ${colors[level] || "black"}; font-weight: bold;`;
    const timeStyles = "color: gray; font-style: italic;";

    console.log(
      `%c[${new Date().toISOString()}]%c [%c${level.toUpperCase()}%c] %c${
        this.prefix
      }`,
      timeStyles,
      "",
      logStyles,
      "",
      "",
      ...args
    );
  }

  private shouldLog(level: LogLevel) {
    return this.levels[level] >= this.levels[this.level as LogLevel];
  }

  debug(...args: any[]) {
    if (!this.shouldLog("debug" as LogLevel)) return;
    this.log("debug", ...args);
  }

  info(...args: any[]) {
    if (!this.shouldLog("info" as LogLevel)) return;
    this.log("info", ...args);
  }

  warn(...args: any[]) {
    if (!this.shouldLog("warn" as LogLevel)) return;
    this.log("warn", ...args);
  }

  error(...args: any[]) {
    this.log("error", ...args);
  }

  setLevel(level: string) {
    this.level = level;
  }

  setLevelDebug() {
    this.level = "debug";
  }

  setLevelInfo() {
    this.level = "info";
  }

  setLevelWarn() {
    this.level = "warn";
  }

  setLevelError() {
    this.level = "error";
  }
}

const logger = new Logger("[CLAU]");

export { logger };
