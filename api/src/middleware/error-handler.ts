import type { Request, Response, NextFunction } from "express"

/**
 * Global error handling middleware
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  // Log the error
  console.error("Error:", err)

  // Set default status code and error details
  const statusCode = err.status || 500
  const errorCode = err.code || "internal_server_error"
  const message = err.message || "An unexpected error occurred"
  const details = err.details || undefined

  // Send error response
  res.status(statusCode).json({
    code: errorCode,
    message,
    status: statusCode,
    details,
  })
}
