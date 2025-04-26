import { Router } from "express"
import { GeminiService } from "../services/gemini-service"
import { logger } from "../lib/logger"
import { getModel, modelHasCapability } from "@kushai/common"

const router = Router()

/**
 * @route POST /v1/image
 * @desc Generate images from a prompt
 * @access Private
 */
router.post("/", async (req, res, next) => {
  try {
    const { prompt, model, width, height, numberOfImages, style, negativePrompt } = req.body

    // Validate request
    if (!prompt) {
      return res.status(400).json({
        code: "invalid_request",
        message: "Prompt is required",
        status: 400,
      })
    }

    // Validate model if provided
    if (model) {
      const modelInfo = getModel(model)
      if (!modelInfo) {
        return res.status(400).json({
          code: "invalid_request",
          message: `Model '${model}' not found`,
          status: 400,
        })
      }

      if (!modelHasCapability(model, "image-generation")) {
        return res.status(400).json({
          code: "invalid_request",
          message: `Model '${model}' does not support image generation`,
          status: 400,
        })
      }
    }

    // Validate dimensions
    if (width && (width < 256 || width > 2048)) {
      return res.status(400).json({
        code: "invalid_request",
        message: "Width must be between 256 and 2048 pixels",
        status: 400,
      })
    }

    if (height && (height < 256 || height > 2048)) {
      return res.status(400).json({
        code: "invalid_request",
        message: "Height must be between 256 and 2048 pixels",
        status: 400,
      })
    }

    // Validate number of images
    if (numberOfImages && (numberOfImages < 1 || numberOfImages > 4)) {
      return res.status(400).json({
        code: "invalid_request",
        message: "Number of images must be between 1 and 4",
        status: 400,
      })
    }

    logger.info("Image generation request", {
      userId: req.user?.id,
      promptLength: prompt.length,
      model: model || "default",
      width,
      height,
      numberOfImages,
      hasStyle: !!style,
      hasNegativePrompt: !!negativePrompt,
    })

    // Generate images
    const result = await GeminiService.generateImage(prompt, {
      model,
      width,
      height,
      numberOfImages,
      style,
      negativePrompt,
    })

    // Return the result
    res.status(200).json(result)
  } catch (error) {
    logger.error("Image generation request failed", error)
    next(error)
  }
})

/**
 * @route GET /v1/image/models
 * @desc Get available image generation models
 * @access Private
 */
router.get("/models", (req, res) => {
  const models = Object.values(getModel)
    .filter((model) => model.capabilities.includes("image-generation"))
    .map((model) => ({
      id: model.id,
      name: model.name,
      version: model.version,
      description: model.description,
      beta: model.beta || false,
      deprecated: model.deprecated || false,
    }))

  res.status(200).json({ models })
})

export default router
