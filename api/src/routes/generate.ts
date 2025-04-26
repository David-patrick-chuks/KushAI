import { Router } from "express"
import { GeminiService } from "../services/gemini-service"
import { logger } from "../lib/logger"
import { getModel } from "@kushai/common"

const router = Router()

/**
 * @route POST /v1/generate
 * @desc Generate text from a prompt
 * @access Private
 */
router.post("/", async (req, res, next) => {
  try {
    const { prompt, model, maxTokens, temperature, topP, stopSequences } = req.body

    // Validate request
    if (!prompt) {
      return res.status(400).json({
        code: "invalid_request",
        message: "Prompt is required",
        status: 400,
      })
    }

    // Validate model if provided
    if (model && !getModel(model)) {
      return res.status(400).json({
        code: "invalid_request",
        message: `Model '${model}' not found`,
        status: 400,
      })
    }

    logger.info("Text generation request", {
      userId: req.user?.id,
      promptLength: prompt.length,
      model: model || "default",
      temperature,
      maxTokens,
    })

    // Generate text
    const result = await GeminiService.generateText(prompt, {
      model,
      maxTokens,
      temperature,
      topP,
      stopSequences,
    })

    // Return the result
    res.status(200).json(result)
  } catch (error) {
    logger.error("Text generation request failed", error)
    next(error)
  }
})

/**
 * @route GET /v1/generate/models
 * @desc Get available text generation models
 * @access Private
 */
router.get("/models", (req, res) => {
  const models = Object.values(getModel)
    .filter((model) => model.capabilities.includes("text"))
    .map((model) => ({
      id: model.id,
      name: model.name,
      version: model.version,
      description: model.description,
      maxContext: model.maxContext,
      beta: model.beta || false,
      deprecated: model.deprecated || false,
    }))

  res.status(200).json({ models })
})

export default router
