/**
 * Utility functions shared across packages
 */

/**
 * Validates an API key format
 * @param apiKey The API key to validate
 * @returns True if the API key format is valid
 */
export function isValidApiKeyFormat(apiKey: string): boolean {
    // Example: ksh_live_xxxxxxxxxxxxxxxxxxxx
    return /^ksh_(live|test)_[a-zA-Z0-9]{24}$/.test(apiKey)
  }
  
  /**
   * Generates a random API key
   * @param prefix The prefix for the API key (live or test)
   * @returns A new API key
   */
  export function generateApiKey(prefix: "live" | "test"): string {
    const randomPart = Array.from({ length: 24 }, () =>
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(Math.floor(Math.random() * 62)),
    ).join("")
  
    return `ksh_${prefix}_${randomPart}`
  }
  
  /**
   * Safely parses JSON with error handling
   * @param json The JSON string to parse
   * @param fallback Optional fallback value if parsing fails
   * @returns The parsed object or fallback value
   */
  export function safeJsonParse<T>(json: string, fallback: T): T {
    try {
      return JSON.parse(json) as T
    } catch (error) {
      return fallback
    }
  }
  
  /**
   * Creates a delay promise
   * @param ms Milliseconds to delay
   * @returns A promise that resolves after the specified time
   */
  export function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }
  
  /**
   * Implements exponential backoff for retries
   * @param attempt The current attempt number (starting from 0)
   * @param baseDelay The base delay in milliseconds
   * @param maxDelay The maximum delay in milliseconds
   * @returns The delay to wait before the next attempt
   */
  export function exponentialBackoff(attempt: number, baseDelay = 100, maxDelay = 10000): number {
    const delay = Math.min(maxDelay, baseDelay * Math.pow(2, attempt) * (0.5 + Math.random() * 0.5))
    return delay
  }
  
  /**
   * Truncates a string to a maximum length
   * @param str The string to truncate
   * @param maxLength The maximum length
   * @param suffix The suffix to add when truncated (default: '...')
   * @returns The truncated string
   */
  export function truncate(str: string, maxLength: number, suffix = "..."): string {
    if (str.length <= maxLength) return str
    return str.substring(0, maxLength - suffix.length) + suffix
  }
  