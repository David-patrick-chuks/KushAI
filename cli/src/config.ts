import Conf from "conf"
import { isValidApiKeyFormat } from "@kushai/common"

// Define the configuration schema
interface KushaiConfig {
  apiKey?: string
  baseUrl?: string
}

// Create a config instance
const config = new Conf<KushaiConfig>({
  projectName: "kushai",
  schema: {
    apiKey: {
      type: "string",
    },
    baseUrl: {
      type: "string",
      default: "https://api.kushai.com",
    },
  },
})

/**
 * Loads the configuration
 * @returns The current configuration
 */
export function loadConfig(): KushaiConfig {
  return {
    apiKey: config.get("apiKey"),
    baseUrl: config.get("baseUrl"),
  }
}

/**
 * Saves the configuration
 * @param newConfig The configuration to save
 */
export function saveConfig(newConfig: KushaiConfig): void {
  if (newConfig.apiKey !== undefined) {
    config.set("apiKey", newConfig.apiKey)
  }

  if (newConfig.baseUrl !== undefined) {
    config.set("baseUrl", newConfig.baseUrl)
  }
}

/**
 * Validates that an API key is configured
 * @returns True if a valid API key is configured
 */
export function hasValidApiKey(): boolean {
  const apiKey = config.get("apiKey")
  return typeof apiKey === "string" && isValidApiKeyFormat(apiKey)
}

/**
 * Gets the configured API key
 * @returns The API key or undefined if not set
 */
export function getApiKey(): string | undefined {
  return config.get("apiKey")
}

/**
 * Gets the configured base URL
 * @returns The base URL
 */
export function getBaseUrl(): string {
  return config.get("baseUrl") || "https://api.kushai.com"
}

/**
 * Clears the configuration
 */
export function clearConfig(): void {
  config.clear()
}
