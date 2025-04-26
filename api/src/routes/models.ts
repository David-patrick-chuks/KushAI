import { Router } from "express"
import { MODELS, getModelsWithCapability } from "@kushai/common"

const router = Router()

/**
 * @route GET /v1/models
 * @desc Get all available models
 * @access Private
 */
router.get("/", (req, res) => {
  // Return all models with their details
  const models = Object.values(MODELS).map((model) => ({
    id: model.id,
    name: model.name,
    provider: model.provider,
    version: model.version,
    capabilities: model.capabilities,
    maxContext: model.maxContext,
    description: model.description,
    pricing: model.pricing,
    deprecated: model.deprecated || false,
    beta: model.beta || false,
  }))

  res.status(200).json({ models })
})

/**
 * @route GET /v1/models/:id
 * @desc Get details for a specific model
 * @access Private
 */
router.get("/:id", (req, res) => {
  const { id } = req.params
  const model = MODELS[id]

  if (!model) {
    return res.status(404).json({
      code: "not_found",
      message: `Model '${id}' not found`,
      status: 404,
    })
  }

  res.status(200).json(model)
})

/**
 * @route GET /v1/models/capability/:capability
 * @desc Get models with a specific capability
 * @access Private
 */
router.get("/capability/:capability", (req, res) => {
  const { capability } = req.params

  // Validate capability
  const validCapabilities = [
    "text",
    "chat",
    "image-generation",
    "image-understanding",
    "video-understanding",
    "audio-understanding",
    "function-calling",
    "structured-output",
    "multimodal",
    "video-generation",
  ]

  if (!validCapabilities.includes(capability)) {
    return res.status(400).json({
      code: "invalid_request",
      message: `Invalid capability: ${capability}`,
      status: 400,
    })
  }

  const modelIds = getModelsWithCapability(capability as any)
  const models = modelIds.map((id) => MODELS[id])

  res.status(200).json({ models })
})

export default router
