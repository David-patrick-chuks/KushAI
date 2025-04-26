import type { Express } from "express"
import { apiKeyAuth } from "../middleware/api-key-auth"
import { rateLimiter } from "../middleware/rate-limiter"
import { usageTracker } from "../middleware/usage-tracker"
import generateRoutes from "./generate"
import imageRoutes from "./image"
import videoRoutes from "./video"
import structuredRoutes from "./structured"
import audioRoutes from "./audio-understanding"
import videoUnderstandingRoutes from "./video-understanding"
import imageUnderstandingRoutes from "./image-understanding"
import multimodalRoutes from "./multimodal"
import chatRoutes from "./chat"
import functionCallingRoutes from "./function-calling"
import keyRoutes from "./keys"
import authRoutes from "./auth"
import adminRoutes from "./admin"
import modelRoutes from "./models"

/**
 * Registers all API routes
 * @param app Express application
 */
export function registerRoutes(app: Express): void {
  // Public routes (no authentication required)
  app.use("/v1/auth", usageTracker, authRoutes)

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" })
  })

  // Admin routes (requires admin API key)
  app.use("/v1/admin", adminRoutes)

  // Model information routes
  app.use("/v1/models", apiKeyAuth, modelRoutes)

  // Protected routes (require API key authentication)
  app.use("/v1/generate", apiKeyAuth, rateLimiter, usageTracker, generateRoutes)
  app.use("/v1/image", apiKeyAuth, rateLimiter, usageTracker, imageRoutes)
  app.use("/v1/video", apiKeyAuth, rateLimiter, usageTracker, videoRoutes)
  app.use("/v1/structured", apiKeyAuth, rateLimiter, usageTracker, structuredRoutes)
  app.use("/v1/audio-understanding", apiKeyAuth, rateLimiter, usageTracker, audioRoutes)
  app.use("/v1/video-understanding", apiKeyAuth, rateLimiter, usageTracker, videoUnderstandingRoutes)
  app.use("/v1/image-understanding", apiKeyAuth, rateLimiter, usageTracker, imageUnderstandingRoutes)
  app.use("/v1/multimodal", apiKeyAuth, rateLimiter, usageTracker, multimodalRoutes)
  app.use("/v1/chat", apiKeyAuth, rateLimiter, usageTracker, chatRoutes)
  app.use("/v1/function-calling", apiKeyAuth, rateLimiter, usageTracker, functionCallingRoutes)
  app.use("/v1/keys", apiKeyAuth, usageTracker, keyRoutes)

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      code: "not_found",
      message: "The requested resource was not found",
      status: 404,
    })
  })
}
