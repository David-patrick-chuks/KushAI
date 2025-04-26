import { Router } from "express"
import { generateApiKey } from "@kushai/common"
import { ApiKeyModel } from "../models/api-key.model"

const router = Router()

/**
 * @route GET /v1/keys
 * @desc Get all API keys for the authenticated user
 * @access Private
 */
router.get("/", async (req, res, next) => {
  try {
    const userId = req.user.id

    const apiKeys = await ApiKeyModel.find({
      userId,
      revokedAt: null,
    })
      .sort({ createdAt: -1 })
      .exec()

    res.status(200).json(apiKeys)
  } catch (error) {
    next(error)
  }
})

/**
 * @route POST /v1/keys
 * @desc Create a new API key
 * @access Private
 */
router.post("/", async (req, res, next) => {
  try {
    const { name } = req.body
    const userId = req.user.id

    if (!name) {
      return res.status(400).json({
        code: "invalid_request",
        message: "Name is required",
        status: 400,
      })
    }

    // Generate a new API key
    const key = generateApiKey("live")

    // Create a new API key record
    const apiKey = new ApiKeyModel({
      key,
      userId,
      name,
    })

    await apiKey.save()

    res.status(201).json(apiKey)
  } catch (error) {
    next(error)
  }
})

/**
 * @route DELETE /v1/keys/:id
 * @desc Revoke an API key
 * @access Private
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const apiKey = await ApiKeyModel.findOne({
      _id: id,
      userId,
      revokedAt: null,
    }).exec()

    if (!apiKey) {
      return res.status(404).json({
        code: "not_found",
        message: "API key not found",
        status: 404,
      })
    }

    // Revoke the API key
    apiKey.revokedAt = new Date()
    await apiKey.save()

    res.status(200).json({ message: "API key revoked successfully" })
  } catch (error) {
    next(error)
  }
})

export default router
