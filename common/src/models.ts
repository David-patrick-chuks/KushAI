import type { ModelInfo, ModelCapability } from "./types"

/**
 * Registry of all available models in Kushai
 */
export const MODELS: Record<string, ModelInfo> = {
  // Kushai 1.0 models (based on Gemini 1.0)
  "kush-1.0-pro": {
    id: "kush-1.0-pro",
    name: "Kushai 1.0 Pro",
    provider: "gemini",
    version: "1.0",
    capabilities: ["text", "chat", "function-calling", "structured-output"],
    maxContext: 32768,
    description: "General purpose model with strong reasoning capabilities",
    pricing: {
      inputPerMillionTokens: 0.5,
      outputPerMillionTokens: 1.5,
      currency: "USD",
    },
  },
  "kush-1.0-flash": {
    id: "kush-1.0-flash",
    name: "Kushai 1.0 Flash",
    provider: "gemini",
    version: "1.0",
    capabilities: ["text", "chat"],
    maxContext: 16384,
    description: "Fast and efficient model for simple tasks",
    pricing: {
      inputPerMillionTokens: 0.25,
      outputPerMillionTokens: 0.75,
      currency: "USD",
    },
  },
  "kush-1.0-vision": {
    id: "kush-1.0-vision",
    name: "Kushai 1.0 Vision",
    provider: "gemini",
    version: "1.0",
    capabilities: ["text", "chat", "image-understanding", "multimodal"],
    maxContext: 16384,
    description: "Specialized model for image understanding and multimodal tasks",
    pricing: {
      inputPerMillionTokens: 0.75,
      outputPerMillionTokens: 2.0,
      currency: "USD",
    },
  },

  // Kushai 2.0 models (based on Gemini 1.5)
  "kush-2.0-pro": {
    id: "kush-2.0-pro",
    name: "Kushai 2.0 Pro",
    provider: "gemini",
    version: "2.0",
    capabilities: ["text", "chat", "function-calling", "structured-output", "multimodal"],
    maxContext: 128000,
    description: "Advanced model with extended context window and improved reasoning",
    pricing: {
      inputPerMillionTokens: 1.0,
      outputPerMillionTokens: 3.0,
      currency: "USD",
    },
  },
  "kush-2.0-vision": {
    id: "kush-2.0-vision",
    name: "Kushai 2.0 Vision",
    provider: "gemini",
    version: "2.0",
    capabilities: ["text", "chat", "image-understanding", "multimodal", "image-generation"],
    maxContext: 64000,
    description: "Advanced vision model with image generation capabilities",
    pricing: {
      inputPerMillionTokens: 1.25,
      outputPerMillionTokens: 3.5,
      currency: "USD",
    },
  },

  // Kushai 2.5 models (latest generation)
  "kush-2.5-pro": {
    id: "kush-2.5-pro",
    name: "Kushai 2.5 Pro",
    provider: "gemini",
    version: "2.5",
    capabilities: [
      "text",
      "chat",
      "function-calling",
      "structured-output",
      "multimodal",
      "image-understanding",
      "video-understanding",
      "audio-understanding",
    ],
    maxContext: 256000,
    description: "State-of-the-art model with comprehensive capabilities",
    pricing: {
      inputPerMillionTokens: 2.0,
      outputPerMillionTokens: 6.0,
      currency: "USD",
    },
    beta: true,
  },
  "kush-2.5-flash": {
    id: "kush-2.5-flash",
    name: "Kushai 2.5 Flash",
    provider: "gemini",
    version: "2.5",
    capabilities: ["text", "chat", "function-calling"],
    maxContext: 128000,
    description: "High-performance model optimized for speed and efficiency",
    pricing: {
      inputPerMillionTokens: 1.0,
      outputPerMillionTokens: 3.0,
      currency: "USD",
    },
    beta: true,
  },
  "kush-2.5-creative": {
    id: "kush-2.5-creative",
    name: "Kushai 2.5 Creative",
    provider: "gemini",
    version: "2.5",
    capabilities: ["text", "chat", "image-generation", "video-generation"],
    maxContext: 64000,
    description: "Specialized model for creative content generation",
    pricing: {
      inputPerMillionTokens: 2.5,
      outputPerMillionTokens: 7.5,
      currency: "USD",
    },
    beta: true,
  },
}

/**
 * Get a model by ID
 * @param modelId The model ID
 * @returns The model info or undefined if not found
 */
export function getModel(modelId: string): ModelInfo | undefined {
  return MODELS[modelId]
}

/**
 * Get the default model for a specific capability
 * @param capability The capability to find a model for
 * @returns The default model ID for the capability
 */
export function getDefaultModelForCapability(capability: ModelCapability): string {
  switch (capability) {
    case "text":
    case "chat":
    case "function-calling":
    case "structured-output":
      return "kush-2.0-pro"
    case "image-understanding":
    case "multimodal":
      return "kush-2.0-vision"
    case "image-generation":
      return "kush-2.5-creative"
    case "video-generation":
      return "kush-2.5-creative"
    case "video-understanding":
    case "audio-understanding":
      return "kush-2.5-pro"
    default:
      return "kush-2.0-pro"
  }
}

/**
 * Get all models with a specific capability
 * @param capability The capability to filter by
 * @returns Array of model IDs with the capability
 */
export function getModelsWithCapability(capability: ModelCapability): string[] {
  return Object.keys(MODELS).filter((modelId) => MODELS[modelId].capabilities.includes(capability))
}

/**
 * Check if a model has a specific capability
 * @param modelId The model ID
 * @param capability The capability to check
 * @returns True if the model has the capability
 */
export function modelHasCapability(modelId: string, capability: ModelCapability): boolean {
  const model = MODELS[modelId]
  return model ? model.capabilities.includes(capability) : false
}
