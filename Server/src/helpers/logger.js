import { Logger, transports, createLogger, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const trans: any[] = [];

const formatter = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
  format.align(),
  format.printf((info) => {
    const { timestamp, level, message, ...args } = info;
    let messageToPrint = message;
    if (typeof message === "object") {
      const messageKeys = Object.keys(message);
      if (messageKeys.length === 0) {
        messageToPrint = "";
      } else {
        const arg1 = { ...args };
        messageToPrint = JSON.stringify(arg1, null, 2);
      }
    }
    const arg2 = { ...args };
    return `${timestamp} [${level}]: ${messageToPrint} ${
      Object.keys(args).length ? JSON.stringify(arg2, null, 2) : ""
    }`;
  })
);

const colorizedFormatter = format.combine(
  format.colorize(),
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
  format.align(),
  format.printf((info) => {
    const { timestamp, level, message, ...args } = info;
    let messageToPrint = message;
    if (typeof message === "object") {
      const messageKeys = Object.keys(message);
      if (messageKeys.length === 0) {
        messageToPrint = "";
      } else {
        messageToPrint = JSON.stringify(args, null, 2);
      }
    }
    return `${timestamp} [${level}]: ${messageToPrint} ${
      Object.keys(args).length ? JSON.stringify(args, null, 2) : ""
    }`;
  })
);

function registerFileTransports() {
  const path = process.env.LOGFILEPATH || "";
  const maxNoOfFiles = parseInt(process.env.MAX_NUM_LOG_FILES || "0");
  const maxSize = parseInt(process.env.MAX_LOG_FILE_SIZE_BYTES || "0");
  const fName = "daq";

  if (process.env.LOG_LEVEL) {
    trans.push(
      new DailyRotateFile({
        format: formatter,
        level: process.env.LOG_LEVEL,
        maxFiles: maxNoOfFiles,
        maxSize: maxSize,
        filename: `${path}${fName}-%DATE%.log`,
        zippedArchive: true,
        handleExceptions: true,
      })
    );
  } else if (process.env.isProduction && !process.env.LOG_LEVEL) {
    trans.push(
      new DailyRotateFile({
        format: formatter,
        level: "error",
        maxFiles: maxNoOfFiles,
        maxSize: maxSize,
        filename: `${path}${fName}-%DATE%.log`,
        zippedArchive: true,
        handleExceptions: true,
      })
    );
  } else {
    trans.push(
      new DailyRotateFile({
        format: formatter,
        level: "debug",
        maxFiles: maxNoOfFiles,
        maxSize: maxSize,
        filename: `${path}${fName}-%DATE%.log`,
        zippedArchive: true,
        handleExceptions: true,
      })
    );
  }
}

function registerConsoleTransports() {
  if (process.env.isProduction) {
    trans.push(
      new transports.Console({
        level: "error",
        format: colorizedFormatter,
      })
    );
  } else {
    trans.push(
      new transports.Console({
        format: colorizedFormatter,
      })
    );
  }
}

const initializeLogger = (): Logger => {
  if (process.env.LOGTARGET === "FILE_ONLY") {
    registerFileTransports();
  } else if (process.env.LOGTARGET === "CONSOLE_ONLY") {
    registerConsoleTransports();
  } else {
    registerFileTransports();
    registerConsoleTransports();
  }

  const logger = createLogger({
    transports: trans,
  });

  if (process.env.NODE_ENV !== "production") {
    logger.debug("Logging initialized at debug level");
  }

  return logger;
};

export { initializeLogger };
