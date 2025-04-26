/**
 * SDK-specific types
 */

/**
 * Kushai SDK options
 */
export interface KushaiOptions {
    /**
     * Base URL for the API
     * @default 'https://api.kushai.com'
     */
    baseURL?: string
  
    /**
     * Request timeout in milliseconds
     * @default 30000 (30 seconds)
     */
    timeout?: number
  
    /**
     * Maximum number of retries for failed requests
     * @default 3
     */
    maxRetries?: number
  
    /**
     * Default model to use for requests
     * @default undefined (uses API default)
     */
    defaultModel?: string
  
    /**
     * Additional headers to include in requests
     */
    headers?: Record<string, string>
  }
  
  /**
   * Kushai error interface
   */
  export interface KushaiError {
    /**
     * Error code
     */
    code: string
  
    /**
     * Error message
     */
    message: string
  
    /**
     * HTTP status code
     */
    status: number
  
    /**
     * Additional error details
     */
    details?: Record<string, any>
  }
  
  /**
   * Model information
   */
  export interface ModelInfo {
    /**
     * Model ID
     */
    id: string
  
    /**
     * Model name
     */
    name: string
  
    /**
     * Model provider
     */
    provider: string
  
    /**
     * Model version
     */
    version: string
  
    /**
     * Model capabilities
     */
    capabilities: string[]
  
    /**
     * Maximum context length
     */
    maxContext: number
  
    /**
     * Model description
     */
    description: string
  
    /**
     * Pricing information
     */
    pricing: {
      inputPerMillionTokens: number
      outputPerMillionTokens: number
      currency: string
    }
  
    /**
     * Whether the model is deprecated
     */
    deprecated?: boolean
  
    /**
     * Whether the model is in beta
     */
    beta?: boolean
  }
  