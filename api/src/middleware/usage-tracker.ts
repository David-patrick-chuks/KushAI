import type { Request, Response, NextFunction } from "express"
import { logger } from "../lib/logger"

// In-memory store for API usage statistics
const usageStats = {
  totalRequests: 0,
  endpointStats: new Map<string, number>(),
  userStats: new Map<string, number>(),
  errors: 0,
  lastReset: Date.now(),
}

// Reset stats daily
setInterval(() => {
  logger.info("Resetting usage statistics", {
    previousStats: {
      totalRequests: usageStats.totalRequests,
      endpoints: Object.fromEntries(usageStats.endpointStats),
      users: usageStats.userStats.size,
      errors: usageStats.errors,
      duration: Date.now() - usageStats.lastReset,
    },
  })

  usageStats.totalRequests = 0
  usageStats.endpointStats.clear()
  usageStats.userStats.clear()
  usageStats.errors = 0
  usageStats.lastReset = Date.now()
}, 86400000) // 24 hours

/**
 * Middleware to track API usage
 */
export function usageTracker(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now()

  // Track request
  usageStats.totalRequests++

  // Track endpoint usage
  const endpoint = req.path
  usageStats.endpointStats.set(endpoint, (usageStats.endpointStats.get(endpoint) || 0) + 1)

  // Track user usage
  if (req.user?.id) {
    const userId = req.user.id.toString()
    usageStats.userStats.set(userId, (usageStats.userStats.get(userId) || 0) + 1)
  }

  // Track response
  res.on("finish", () => {
    const duration = Date.now() - startTime

    // Log request details
    logger.debug("API Request", {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      userId: req.user?.id,
      apiKey: req.apiKey?.key ? `${req.apiKey.key.substring(0, 8)}...` : undefined,
    })

    // Track errors
    if (res.statusCode >= 400) {
      usageStats.errors++
    }

    // Log slow requests
    if (duration > 1000) {
      logger.warn("Slow API request", {
        method: req.method,
        path: req.path,
        duration,
      })
    }
  })

  next()
}

/**
 * Get current usage statistics
 * @returns Current usage statistics
 */
export function getUsageStats(): Record<string, any> {
  return {
    totalRequests: usageStats.totalRequests,
    endpoints: Object.fromEntries(usageStats.endpointStats),
    uniqueUsers: usageStats.userStats.size,
    errors: usageStats.errors,
    uptime: Date.now() - usageStats.lastReset,
  }
}
