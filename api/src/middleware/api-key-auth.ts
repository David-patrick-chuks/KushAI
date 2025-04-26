import type { Request, Response, NextFunction } from "express"
import { isValidApiKeyFormat } from "@kushai/common"
import { ApiKeyModel } from "../models/api-key.model"
import { UserModel } from "../models/user.model"

/**
 * Middleware to authenticate requests using API key
 */
export async function apiKeyAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // Get the API key from the Authorization header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        code: "unauthorized",
        message: "API key is missing",
        status: 401,
      })
      return
    }

    const apiKey = authHeader.split(" ")[1]

    // Validate API key format
    if (!isValidApiKeyFormat(apiKey)) {
      res.status(401).json({
        code: "unauthorized",
        message: "Invalid API key format",
        status: 401,
      })
      return
    }

    // Check if the API key exists and is not revoked
    const keyRecord = await ApiKeyModel.findOne({
      key: apiKey,
      revokedAt: null,
    }).exec()

    if (!keyRecord) {
      res.status(401).json({
        code: "unauthorized",
        message: "Invalid or revoked API key",
        status: 401,
      })
      return
    }

    // Get the user associated with the API key
    const user = await UserModel.findById(keyRecord.userId).exec()

    if (!user) {
      res.status(401).json({
        code: "unauthorized",
        message: "User not found",
        status: 401,
      })
      return
    }

    // Update last used timestamp
    keyRecord.lastUsedAt = new Date()
    await keyRecord.save()

    // Attach user and API key info to the request
    req.user = user
    req.apiKey = keyRecord

    next()
  } catch (error) {
    console.error("API key authentication error:", error)
    res.status(500).json({
      code: "internal_server_error",
      message: "An error occurred during authentication",
      status: 500,
    })
  }
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: any
      apiKey?: any
    }
  }
}
