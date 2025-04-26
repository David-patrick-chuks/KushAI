import rateLimit from "express-rate-limit"
import type { Request, Response, NextFunction } from "express"
import { RATE_LIMITS } from "@kushai/common"
import { logger } from "../lib/logger"

// Store for tracking API usage
const apiUsageStore = new Map<string, { count: number; resetAt: number }>()

// Clean up the store periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, data] of apiUsageStore.entries()) {
    if (data.resetAt <= now) {
      apiUsageStore.delete(key)
    }
  }
}, 60000) // Clean up every minute

/**
 * Rate limiting middleware based on user tier and endpoint
 */
export function rateLimiter(req: Request, res: Response, next: NextFunction): void {
  // Get user tier from the authenticated user
  const userTier = req.user?.tier || "FREE_TIER"

  // Get rate limits for the user's tier
  const limits = RATE_LIMITS[userTier as keyof typeof RATE_LIMITS]

  // Get the endpoint path for more granular rate limiting
  const endpoint = req.path.split("/")[1] || "default"

  // Adjust limits based on endpoint
  let requestsPerMinute = limits.REQUESTS_PER_MINUTE

  // Apply different limits for resource-intensive endpoints
  if (["image", "video"].includes(endpoint)) {
    requestsPerMinute = Math.floor(requestsPerMinute / 2) // More restrictive for resource-intensive operations
  }

  // Create a rate limiter instance
  const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: requestsPerMinute,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      // Use API key as the rate limit key
      return req.apiKey?.key || req.ip
    },
    handler: (req, res) => {
      logger.warn(`Rate limit exceeded for ${req.apiKey?.key || req.ip} on ${endpoint}`)

      res.status(429).json({
        code: "rate_limit_exceeded",
        message: "Rate limit exceeded. Please try again later.",
        status: 429,
        details: {
          retryAfter: Math.ceil(60 - (Date.now() % 60000) / 1000), // Seconds until the next minute
        },
      })
    },
    skip: (req) => {
      // Skip rate limiting for certain endpoints or conditions if needed
      return false
    },
  })

  // Track API usage for analytics
  const apiKey = req.apiKey?.key || req.ip
  const now = Date.now()
  const resetTime = now + 86400000 // 24 hours from now

  if (!apiUsageStore.has(apiKey)) {
    apiUsageStore.set(apiKey, { count: 0, resetAt: resetTime })
  }

  const usage = apiUsageStore.get(apiKey)!
  usage.count++

  // Apply the rate limiter
  limiter(req, res, next)
}

/**
 * Get API usage statistics
 * @returns API usage statistics
 */
export function getApiUsageStats(): Record<string, any> {
  const stats: Record<string, any> = {
    totalKeys: apiUsageStore.size,
    totalRequests: 0,
  }

  for (const [key, data] of apiUsageStore.entries()) {
    stats.totalRequests += data.count
  }

  return stats
}
