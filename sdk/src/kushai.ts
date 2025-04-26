import axios, { type AxiosInstance, type AxiosRequestConfig } from "axios"
import {
  API_ENDPOINTS,
  DEFAULT_CONFIG,
  type GenerateTextRequest,
  type GenerateTextResponse,
  type GenerateImageRequest,
  type GenerateImageResponse,
  type GenerateVideoRequest,
  type GenerateVideoResponse,
  type StructuredOutputRequest,
  type StructuredOutputResponse,
  type AudioUnderstandingRequest,
  type AudioUnderstandingResponse,
  type VideoUnderstandingRequest,
  type VideoUnderstandingResponse,
  type ImageUnderstandingRequest,
  type ImageUnderstandingResponse,
  type MultimodalRequest,
  type MultimodalResponse,
  type FunctionCallingRequest,
  type FunctionCallingResponse,
  type ChatRequest,
  type ChatResponse,
  isValidApiKeyFormat,
  exponentialBackoff,
  delay,
} from "@kushai/common"
import type { KushaiError, KushaiOptions, ModelInfo } from "./types"
import { createKushaiError } from "./errors"

/**
 * Main Kushai SDK class
 */
export class Kushai {
  private client: AxiosInstance
  private apiKey: string
  private maxRetries: number
  private defaultModel?: string

  /**
   * Creates a new Kushai SDK instance
   * @param apiKey Your Kushai API key
   * @param options Configuration options
   */
  constructor(apiKey: string, options: KushaiOptions = {}) {
    if (!apiKey) {
      throw new Error("API key is required")
    }

    if (!isValidApiKeyFormat(apiKey)) {
      throw new Error("Invalid API key format")
    }

    this.apiKey = apiKey
    this.maxRetries = options.maxRetries ?? DEFAULT_CONFIG.MAX_RETRIES
    this.defaultModel = options.defaultModel

    const baseURL = options.baseURL ?? DEFAULT_CONFIG.BASE_URL
    const timeout = options.timeout ?? DEFAULT_CONFIG.TIMEOUT

    this.client = axios.create({
      baseURL,
      timeout,
      headers: {
        ...DEFAULT_CONFIG.DEFAULT_HEADERS,
        Authorization: `Bearer ${this.apiKey}`,
        "User-Agent": `Kushai-SDK/0.1.0 Node/${process.version}`,
        ...options.headers,
      },
    })

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const kushaiError = createKushaiError(error)
        throw kushaiError
      },
    )
  }

  /**
   * Makes an API request with retry logic
   * @param config Axios request configuration
   * @returns The response data
   */
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    let attempt = 0
    let lastError: KushaiError | null = null

    while (attempt <= this.maxRetries) {
      try {
        const response = await this.client.request<T>(config)
        return response.data
      } catch (error) {
        lastError = error as KushaiError

        // Don't retry on client errors (except rate limiting)
        if (lastError.status < 500 && lastError.code !== "rate_limit_exceeded") {
          throw lastError
        }

        // Last attempt, throw the error
        if (attempt === this.maxRetries) {
          throw lastError
        }

        // Calculate backoff delay
        const backoffTime = exponentialBackoff(attempt)
        await delay(backoffTime)

        attempt++
      }
    }

    // This should never happen due to the throw in the loop
    throw lastError || new Error("Unknown error occurred")
  }

  /**
   * Applies the default model to a request if not already specified
   * @param params Request parameters
   * @returns Parameters with default model applied if needed
   */
  private applyDefaultModel<T extends { model?: string }>(params: T): T {
    if (!params.model && this.defaultModel) {
      return { ...params, model: this.defaultModel }
    }
    return params
  }

  /**
   * Gets information about available models
   * @returns List of available models
   */
  async listModels(): Promise<ModelInfo[]> {
    const response = await this.request<{ models: ModelInfo[] }>({
      method: "GET",
      url: "/v1/models",
    })
    return response.models
  }

  /**
   * Gets information about a specific model
   * @param modelId The model ID
   * @returns Model information
   */
  async getModel(modelId: string): Promise<ModelInfo> {
    return this.request<ModelInfo>({
      method: "GET",
      url: `/v1/models/${modelId}`,
    })
  }

  /**
   * Gets models with a specific capability
   * @param capability The capability to filter by
   * @returns List of models with the capability
   */
  async getModelsWithCapability(capability: string): Promise<ModelInfo[]> {
    const response = await this.request<{ models: ModelInfo[] }>({
      method: "GET",
      url: `/v1/models/capability/${capability}`,
    })
    return response.models
  }

  /**
   * Generates text from a prompt
   * @param params Text generation parameters
   * @returns Generated text response
   */
  async generate(params: GenerateTextRequest): Promise<GenerateTextResponse> {
    const paramsWithModel = this.applyDefaultModel(params)
    return this.request<GenerateTextResponse>({
      method: "POST",
      url: API_ENDPOINTS.GENERATE,
      data: paramsWithModel,
    })
  }

  /**
   * Generates images from a text prompt
   * @param params Image generation parameters
   * @returns Generated image response
   */
  async generateImage(params: GenerateImageRequest): Promise<GenerateImageResponse> {
    const paramsWithModel = this.applyDefaultModel(params)
    return this.request<GenerateImageResponse>({
      method: "POST",
      url: API_ENDPOINTS.IMAGE,
      data: paramsWithModel,
    })
  }

  /**
   * Generates a video from a text prompt
   * @param params Video generation parameters
   * @returns Generated video response
   */
  async generateVideo(params: GenerateVideoRequest): Promise<GenerateVideoResponse> {
    const paramsWithModel = this.applyDefaultModel(params)
    return this.request<GenerateVideoResponse>({
      method: "POST",
      url: API_ENDPOINTS.VIDEO,
      data: paramsWithModel,
    })
  }

  /**
   * Generates structured data output from a prompt
   * @param params Structured output parameters
   * @returns Structured data response
   */
  async generateStructured(params: StructuredOutputRequest): Promise<StructuredOutputResponse> {
    const paramsWithModel = this.applyDefaultModel(params)
    return this.request<StructuredOutputResponse>({
      method: "POST",
      url: API_ENDPOINTS.STRUCTURED,
      data: paramsWithModel,
    })
  }

  /**
   * Analyzes audio content
   * @param params Audio understanding parameters
   * @returns Audio analysis response
   */
  async understandAudio(params: AudioUnderstandingRequest): Promise<AudioUnderstandingResponse> {
    const paramsWithModel = this.applyDefaultModel(params)
    return this.request<AudioUnderstandingResponse>({
      method: "POST",
      url: API_ENDPOINTS.AUDIO_UNDERSTANDING,
      data: paramsWithModel,
    })
  }

  /**
   * Analyzes video content
   * @param params Video understanding parameters
   * @returns Video analysis response
   */
  async understandVideo(params: VideoUnderstandingRequest): Promise<VideoUnderstandingResponse> {
    const paramsWithModel = this.applyDefaultModel(params)
    return this.request<VideoUnderstandingResponse>({
      method: "POST",
      url: API_ENDPOINTS.VIDEO_UNDERSTANDING,
      data: paramsWithModel,
    })
  }

  /**
   * Analyzes image content
   * @param params Image understanding parameters
   * @returns Image analysis response
   */
  async understandImage(params: ImageUnderstandingRequest): Promise<ImageUnderstandingResponse> {
    const paramsWithModel = this.applyDefaultModel(params)
    return this.request<ImageUnderstandingResponse>({
      method: "POST",
      url: API_ENDPOINTS.IMAGE_UNDERSTANDING,
      data: paramsWithModel,
    })
  }

  /**
   * Processes multimodal input (text + image)
   * @param params Multimodal request parameters
   * @returns Multimodal response
   */
  async multimodal(params: MultimodalRequest): Promise<MultimodalResponse> {
    const paramsWithModel = this.applyDefaultModel(params)
    return this.request<MultimodalResponse>({
      method: "POST",
      url: API_ENDPOINTS.MULTIMODAL,
      data: paramsWithModel,
    })
  }

  /**
   * Makes function calls based on the prompt
   * @param params Function calling parameters
   * @returns Function calling response
   */
  async functionCall(params: FunctionCallingRequest): Promise<FunctionCallingResponse> {
    const paramsWithModel = this.applyDefaultModel(params)
    return this.request<FunctionCallingResponse>({
      method: "POST",
      url: API_ENDPOINTS.FUNCTION_CALLING,
      data: paramsWithModel,
    })
  }

  /**
   * Sends a chat request
   * @param params Chat request parameters
   * @returns Chat response
   */
  async chat(params: ChatRequest): Promise<ChatResponse> {
    const paramsWithModel = this.applyDefaultModel(params)
    return this.request<ChatResponse>({
      method: "POST",
      url: API_ENDPOINTS.CHAT,
      data: paramsWithModel,
    })
  }
}
