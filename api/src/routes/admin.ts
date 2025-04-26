import { Router } from "express"
import { getUsageStats } from "../middleware/usage-tracker"
import { getApiUsageStats } from "../middleware/rate-limiter"
import { KeyPoolManager } from "../lib/key-pool-manager"

const router = Router()

// Admin authentication middleware
const adminAuth = (req: any, res: any, next: any) => {
  const adminKey = process.env.ADMIN_API_KEY

  if (!adminKey || req.headers["x-admin-key"] !== adminKey) {
    return res.status(401).json({
      code: "unauthorized",
      message: "Admin authentication required",
      status: 401,
    })
  }

  next()
}

/**
 * @route GET /v1/admin/stats
 * @desc Get API usage statistics
 * @access Admin
 */
router.get("/stats", adminAuth, async (req, res) => {
  const stats = {
    usage: getUsageStats(),
    rateLimit: getApiUsageStats(),
    keyPool: KeyPoolManager.getGlobalStats(),
    system: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
    },
  }

  res.status(200).json(stats)
})

/**
 * @route POST /v1/admin/reset-keys
 * @desc Reset exhausted API keys
 * @access Admin
 */
router.post("/reset-keys", adminAuth, async (req, res) => {
  KeyPoolManager.resetAllExhaustedKeys()

  res.status(200).json({
    message: "All exhausted API keys have been reset",
    keyPool: KeyPoolManager.getGlobalStats(),
  })
})

export default router
