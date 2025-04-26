import { generateText, experimental_generateImage } from "ai"
import { google } from "@ai-sdk/google"
import { KeyPoolManager } from "../lib/key-pool-manager"
import { logger } from "../lib/logger"
import { getModel, modelHasCapability } from "@kushai/common"

// Initialize the key pool manager
const keyPoolManager = new KeyPoolManager("GEMINI_API_KEYS")

// Map Kushai model IDs to Gemini model IDs
const MODEL_MAPPING: Record<string, string> = {
  "kush-1.0-pro": "gemini-1.0-pro",
  "kush-1.0-flash": "gemini-1.0-pro-latest",
  "kush-1.0-vision": "gemini-1.0-pro-vision",
  "kush-2.0-pro": "gemini-1.5-pro",
  "kush-2.0-vision": "gemini-1.5-pro-vision",
  "kush-2.5-pro": "gemini-1.5-pro-latest",
  "kush-2.5-flash": "gemini-1.5-flash",
  "kush-2.5-creative": "gemini-1.5-pro-vision-latest",
}

/**
 * Service for interacting with Google Gemini models
 */
export class GeminiService {
  /**
   * Maps a Kushai model ID to a Gemini model ID
   * @param kushaiModelId The Kushai model ID
   * @param defaultGeminiModel Default Gemini model if mapping not found
   * @returns The corresponding Gemini model ID
   */
  private static mapToGeminiModel(kushaiModelId: string, defaultGeminiModel: string): string {
    return MODEL_MAPPING[kushaiModelId] || defaultGeminiModel
  }

  /**
   * Validates if a model supports a specific capability
   * @param modelId The model ID to check
   * @param capability The capability required
   * @throws Error if the model doesn't support the capability
   */
  private static validateModelCapability(
    modelId: string,
    capability: "text" | "image-generation" | "multimodal",
  ): void {
    if (!modelHasCapability(modelId, capability)) {
      const model = getModel(modelId)
      throw new Error(`Model ${modelId} (${model?.name || "Unknown"}) does not support ${capability} capability`)
    }
  }

  /**
   * Generates text using Gemini models
   * @param prompt The prompt to generate text from
   * @param options Additional options
   * @returns The generated text and usage information
   */
  static async generateText(prompt: string, options: any = {}) {
    // Get model ID or use default
    const modelId = options.model || "kush-2.0-pro"

    // Validate model capability
    this.validateModelCapability(modelId, "text")

    // Map to Gemini model
    const geminiModelId = this.mapToGeminiModel(modelId, "gemini-1.5-pro")

    // Get an API key from the pool
    const apiKey = await keyPoolManager.getKey()

    try {
      logger.debug("Generating text", { modelId, geminiModelId, promptLength: prompt.length })

      // Create a Gemini model instance
      const model = google(geminiModelId, {
        apiKey,
      })

      // Generate text
      const result = await generateText({
        model,
        prompt,
        maxTokens: options.maxTokens,
        temperature: options.temperature,
      })

      // Mark the key as successfully used
      await keyPoolManager.releaseKey(apiKey)

      return {
        text: result.text,
        usage: {
          promptTokens: result.usage?.promptTokens || 0,
          completionTokens: result.usage?.completionTokens || 0,
          totalTokens: result.usage?.totalTokens || 0,
        },
        model: modelId,
      }
    } catch (error) {
      // Handle key-specific errors
      if (this.isQuotaError(error)) {
        logger.warn("API key quota exceeded", { apiKey: apiKey.substring(0, 8) + "..." })
        await keyPoolManager.markKeyAsExhausted(apiKey)
        // Retry with a different key
        return this.generateText(prompt, options)
      }

      // Release the key back to the pool for other errors
      await keyPoolManager.releaseKey(apiKey)
      logger.error("Text generation error", error)
      throw error
    }
  }

  /**
   * Generates images using Gemini models
   * @param prompt The prompt to generate images from
   * @param options Additional options like width, height, and number of images
   * @returns The generated images and usage information
   */
  static async generateImage(prompt: string, options: any = {}) {
    // Get model ID or use default
    const modelId = options.model || "kush-2.5-creative"

    // Validate model capability
    this.validateModelCapability(modelId, "image-generation")

    // Map to Gemini model
    const geminiModelId = this.mapToGeminiModel(modelId, "gemini-1.5-pro-vision-latest")

    // Get an API key from the pool
    const apiKey = await keyPoolManager.getKey()

    try {
      // Create a Gemini model instance
      const model = google(geminiModelId, {
        apiKey,
      })

      // Set default options
      const width = options.width || 1024
      const height = options.height || 1024
      const numberOfImages = options.numberOfImages || 1
      const style = options.style || undefined
      const negativePrompt = options.negativePrompt || undefined

      logger.debug("Generating images", {
        modelId,
        geminiModelId,
        promptLength: prompt.length,
        width,
        height,
        numberOfImages,
        style: style ? true : false,
        negativePrompt: negativePrompt ? true : false,
      })

      // Generate images
      const images = []
      const startTime = Date.now()

      // Prepare the full prompt with style and negative prompt if provided
      let fullPrompt = prompt
      if (style) {
        fullPrompt += `. Style: ${style}`
      }
      if (negativePrompt) {
        fullPrompt += `. DO NOT INCLUDE: ${negativePrompt}`
      }

      for (let i = 0; i < numberOfImages; i++) {
        const result = await experimental_generateImage({
          model,
          prompt: fullPrompt,
          width,
          height,
        })

        images.push(result.images[0])
      }

      const duration = Date.now() - startTime
      logger.debug("Image generation completed", { duration, count: images.length })

      // Mark the key as successfully used
      await keyPoolManager.releaseKey(apiKey)

      // Calculate approximate token usage
      const promptTokens = Math.ceil(prompt.length / 4) + 50 // Rough estimate

      return {
        images,
        usage: {
          promptTokens,
          completionTokens: 0,
          totalTokens: promptTokens,
        },
        model: modelId,
      }
    } catch (error) {
      // Handle key-specific errors
      if (this.isQuotaError(error)) {
        logger.warn("API key quota exceeded", { apiKey: apiKey.substring(0, 8) + "..." })
        await keyPoolManager.markKeyAsExhausted(apiKey)
        // Retry with a different key
        return this.generateImage(prompt, options)
      }

      // Release the key back to the pool for other errors
      await keyPoolManager.releaseKey(apiKey)
      logger.error("Image generation error", error)
      throw error
    }
  }

  /**
   * Checks if an error is related to quota limits
   * @param error The error to check
   * @returns True if it's a quota-related error
   */
  private static isQuotaError(error: any): boolean {
    return (
      error?.message?.includes("quota") ||
      error?.message?.includes("rate limit") ||
      error?.status === 429 ||
      error?.message?.includes("capacity")
    )
  }

  // Additional methods for other Gemini features would be implemented here
}
