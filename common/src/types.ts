// Common types used across packages

// Model types
export type ModelProvider = "gemini" | "anthropic" | "mistral" | "llama" | "custom"

export interface ModelVersion {
  provider: ModelProvider
  version: string
  capabilities: ModelCapability[]
  maxContext?: number
  deprecated?: boolean
}

export type ModelCapability =
  | "text"
  | "chat"
  | "image-generation"
  | "image-understanding"
  | "video-understanding"
  | "audio-understanding"
  | "function-calling"
  | "structured-output"
  | "multimodal"
  | "video-generation"

// API Key types
export interface ApiKey {
  id: string
  key: string
  userId: string
  name: string
  createdAt: Date
  lastUsedAt: Date | null
  revokedAt: Date | null
  allowedModels?: string[] // Restrict to specific models
  allowedCapabilities?: ModelCapability[] // Restrict to specific capabilities
}

// User types
export interface User {
  id: string
  email: string
  name: string | null
  createdAt: Date
  tier: "FREE_TIER" | "PRO_TIER" | "ENTERPRISE_TIER"
  organization?: string
  customModelAccess?: boolean
}

// Request types
export interface GenerateTextRequest {
  prompt: string
  model?: string // e.g., "kush-1.0-pro", "kush-2.5-flash"
  maxTokens?: number
  temperature?: number
  topP?: number
  stopSequences?: string[]
}

export interface GenerateImageRequest {
  prompt: string
  model?: string
  width?: number
  height?: number
  numberOfImages?: number
  style?: string
  negativePrompt?: string
}

export interface GenerateVideoRequest {
  prompt: string
  model?: string
  duration?: number
  resolution?: string
  fps?: number
}

export interface StructuredOutputRequest {
  prompt: string
  model?: string
  schema: Record<string, any>
}

export interface AudioUnderstandingRequest {
  audioUrl?: string
  audioData?: string // base64
  language?: string
  model?: string
}

export interface VideoUnderstandingRequest {
  videoUrl?: string
  videoData?: string // base64
  model?: string
}

export interface ImageUnderstandingRequest {
  imageUrl?: string
  imageData?: string // base64
  prompt?: string
  model?: string
}

export interface MultimodalRequest {
  prompt: string
  imageUrl?: string
  imageData?: string // base64
  model?: string
}

export interface FunctionCallingRequest {
  prompt: string
  functions: FunctionDefinition[]
  model?: string
}

export interface FunctionDefinition {
  name: string
  description: string
  parameters: Record<string, any>
}

export interface ChatRequest {
  messages: ChatMessage[]
  model?: string
  temperature?: number
  maxTokens?: number
  tools?: FunctionDefinition[]
}

export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
  name?: string
}

// Response types
export interface GenerateTextResponse {
  text: string
  usage: UsageInfo
  model: string
}

export interface GenerateImageResponse {
  images: string[] // base64 encoded or URLs
  usage: UsageInfo
  model: string
}

export interface GenerateVideoResponse {
  videoUrl: string
  usage: UsageInfo
  model: string
}

export interface StructuredOutputResponse {
  data: Record<string, any>
  usage: UsageInfo
  model: string
}

export interface AudioUnderstandingResponse {
  text: string
  usage: UsageInfo
  model: string
}

export interface VideoUnderstandingResponse {
  analysis: string
  usage: UsageInfo
  model: string
}

export interface ImageUnderstandingResponse {
  analysis: string
  usage: UsageInfo
  model: string
}

export interface MultimodalResponse {
  text: string
  usage: UsageInfo
  model: string
}

export interface FunctionCallingResponse {
  functionCalls: FunctionCall[]
  usage: UsageInfo
  model: string
}

export interface FunctionCall {
  name: string
  arguments: Record<string, any>
}

export interface ChatResponse {
  message: ChatMessage
  usage: UsageInfo
  model: string
}

export interface UsageInfo {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost?: number
}

// Error types
export interface KushaiError {
  code: string
  message: string
  status: number
  details?: Record<string, any>
}

// Model information
export interface ModelInfo {
  id: string
  name: string
  provider: ModelProvider
  version: string
  capabilities: ModelCapability[]
  maxContext: number
  description: string
  pricing: {
    inputPerMillionTokens: number
    outputPerMillionTokens: number
    currency: string
  }
  deprecated?: boolean
  beta?: boolean
}
