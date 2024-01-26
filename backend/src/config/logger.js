import winston, { format } from 'winston';  


const { combine, timestamp, label, colorize } = winston.format;
const customLevelOpt = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4,
        trace: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warn: 'yellow',
        info: 'green',
        debug: 'blue',
        trace: 'purple'
    }
};
winston.addColors(customLevelOpt.colors);

const logger = winston.createLogger({
    levels: customLevelOpt.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: combine(
                label({ label: 'right meow debug!' }),
                colorize({ colors: customLevelOpt.colors }),
                format.simple()
            ),
        }),
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: format.combine(
                label({ label: 'right meowerror!' }),
                format.simple(),
                format.timestamp(),
                format.json()
            )
        }),
        new winston.transports.File({
            filename: 'logs/loggers.log',
            level: 'warn',
            format: format.combine(
                label({ label: 'right meow warn!' }),
                format.simple(),
                format.timestamp(),
                format.json()
            )
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: 'logs/exceptions.log' })
    ]
});

// No captura excepciones en el transporte de consola
logger.transports.find(transport => transport instanceof winston.transports.Console).handleExceptions = false;



export const addLogger = (req, _res, next) => {
    req.logger = logger;
    // req.logger.debug(`${req.method} es ${req.path} - ${new Date().toLocaleTimeString()}`);
    next();
};
