import pino from "pino"

// Configure log levels based on environment
const level = process.env.NODE_ENV === "production" ? "info" : "debug"

// Create a pino logger instance
const pinoLogger = pino({
  level,
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
  base: {
    env: process.env.NODE_ENV,
  },
  timestamp: () => `,"time":"${new Date().toISOString()}"`,
})

/**
 * Application logger
 */
export const logger = {
  info: (message: string, ...args: any[]) => {
    pinoLogger.info({ ...formatArgs(args) }, message)
  },
  warn: (message: string, ...args: any[]) => {
    pinoLogger.warn({ ...formatArgs(args) }, message)
  },
  error: (message: string, error?: any, ...args: any[]) => {
    if (error instanceof Error) {
      pinoLogger.error(
        {
          err: {
            message: error.message,
            stack: error.stack,
            ...error,
          },
          ...formatArgs(args),
        },
        message,
      )
    } else {
      pinoLogger.error({ ...formatArgs([error, ...args]) }, message)
    }
  },
  debug: (message: string, ...args: any[]) => {
    pinoLogger.debug({ ...formatArgs(args) }, message)
  },
}

/**
 * Format additional arguments for logging
 */
function formatArgs(args: any[]): Record<string, any> {
  if (args.length === 0) return {}

  if (args.length === 1 && typeof args[0] === "object") {
    return args[0]
  }

  return { data: args }
}

/**
 * HTTP request logger middleware
 */
export const httpLogger = pino.transport({
  target: "pino-http",
  options: {
    level,
    // Redact sensitive information
    redact: {
      paths: ["req.headers.authorization", "req.headers.cookie", "req.body.password", "req.body.token"],
      censor: "[REDACTED]",
    },
  },
})
