import fs from "fs";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";  // ✅ Correct import
import stringify from "safe-json-stringify";

const logDir = "debuglogs";

// ✅ Ensure log directory exists
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
    fs.chmodSync(logDir, 0o777);
}

const logLevel = "debug";
const loglevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
};

const logger = winston.createLogger({
    level: logLevel,
    levels: loglevels,
    format: winston.format.combine(
        winston.format.timestamp({ format: "DD-MM-YYYY hh:mm:ss A" }),
        winston.format.json(),
        winston.format.printf((info) => {
            const { timestamp, level, message, ...args } = info;
            return `${timestamp} ${level}: ${message} ${Object.keys(args).length ? stringify(args, null, 2) : ""}`;
        })
    ),
    transports: [
        new DailyRotateFile({   // ✅ Corrected usage
            filename: `${logDir}/api/%DATE%.log`,
            datePattern: "DDMMMYYYY",
            handleExceptions: true,
            json: true,
        }),
    ],
    exceptionHandlers: [
        new DailyRotateFile({   // ✅ Corrected usage
            filename: `${logDir}/exceptions/%DATE%.log`,
            datePattern: "DDMMMYYYY",
            handleExceptions: true,
            json: true,
        }),
    ],
    exitOnError: true,
});

// ✅ Enable console logging in development
if (process.env.NODE_ENV !== "prod") {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp({ format: "DD-MM-YYYY hh:mm:ss A" }),
                winston.format.json(),
                winston.format.prettyPrint(),
                winston.format.printf((info) => {
                    const { timestamp, level, message, ...args } = info;
                    return `${timestamp} ${level}: ${message} ${Object.keys(args).length ? stringify(args, null, 2) : ""}`;
                })
            ),
        })
    );
}

export default logger;
