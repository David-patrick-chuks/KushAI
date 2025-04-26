/**
 * Manages a pool of API keys with rotation and health tracking
 */
export class KeyPoolManager {
    private keys: string[] = []
    private exhaustedKeys: Set<string> = new Set()
    private inUseKeys: Set<string> = new Set()
    private envVarName: string
    private static instances: KeyPoolManager[] = []
  
    /**
     * Creates a new key pool manager
     * @param envVarName The environment variable name containing the keys
     */
    constructor(envVarName: string) {
      this.envVarName = envVarName
      this.loadKeysFromEnv()
  
      // Register this instance for global stats
      KeyPoolManager.instances.push(this)
    }
  
    /**
     * Loads API keys from environment variables
     */
    private loadKeysFromEnv(): void {
      const keysString = process.env[this.envVarName]
  
      if (!keysString) {
        console.warn(`No API keys found in ${this.envVarName}`)
        return
      }
  
      // Split by comma and trim each key
      this.keys = keysString.split(",").map((key) => key.trim())
      console.log(`Loaded ${this.keys.length} API keys from ${this.envVarName}`)
    }
  
    /**
     * Gets an available API key
     * @returns A promise that resolves to an API key
     * @throws Error if no keys are available
     */
    async getKey(): Promise<string> {
      // Filter out exhausted and in-use keys
      const availableKeys = this.keys.filter((key) => !this.exhaustedKeys.has(key) && !this.inUseKeys.has(key))
  
      if (availableKeys.length === 0) {
        // If all keys are in use but none are exhausted, wait for one to become available
        if (this.inUseKeys.size > 0 && this.exhaustedKeys.size < this.keys.length) {
          return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
              const newAvailableKeys = this.keys.filter((key) => !this.exhaustedKeys.has(key) && !this.inUseKeys.has(key))
  
              if (newAvailableKeys.length > 0) {
                clearInterval(checkInterval)
                const key = newAvailableKeys[0]
                this.inUseKeys.add(key)
                resolve(key)
              }
            }, 100)
          })
        }
  
        throw new Error("No API keys available")
      }
  
      // Get a random key from the available keys
      const randomIndex = Math.floor(Math.random() * availableKeys.length)
      const key = availableKeys[randomIndex]
  
      // Mark the key as in use
      this.inUseKeys.add(key)
  
      return key
    }
  
    /**
     * Releases a key back to the pool
     * @param key The API key to release
     */
    async releaseKey(key: string): Promise<void> {
      this.inUseKeys.delete(key)
    }
  
    /**
     * Marks a key as exhausted (e.g., quota exceeded)
     * @param key The API key to mark as exhausted
     */
    async markKeyAsExhausted(key: string): Promise<void> {
      this.exhaustedKeys.add(key)
      this.inUseKeys.delete(key)
  
      console.warn(`API key marked as exhausted: ${key.substring(0, 5)}...`)
  
      // If all keys are exhausted, log a critical error
      if (this.exhaustedKeys.size === this.keys.length) {
        console.error("CRITICAL: All API keys are exhausted!")
      }
    }
  
    /**
     * Resets all exhausted keys
     */
    resetExhaustedKeys(): void {
      this.exhaustedKeys.clear()
      console.log("Reset all exhausted API keys")
    }
  
    /**
     * Gets statistics about the key pool
     * @returns Key pool statistics
     */
    getStats(): Record<string, number> {
      return {
        total: this.keys.length,
        available: this.keys.length - this.inUseKeys.size - this.exhaustedKeys.size,
        inUse: this.inUseKeys.size,
        exhausted: this.exhaustedKeys.size,
      }
    }
  
    /**
     * Resets all exhausted keys across all instances
     */
    static resetAllExhaustedKeys(): void {
      for (const instance of KeyPoolManager.instances) {
        instance.resetExhaustedKeys()
      }
    }
  
    /**
     * Gets global statistics about all key pools
     * @returns Global key pool statistics
     */
    static getGlobalStats(): Record<string, any> {
      const stats = {
        instances: KeyPoolManager.instances.length,
        total: 0,
        available: 0,
        inUse: 0,
        exhausted: 0,
        pools: {} as Record<string, Record<string, number>>,
      }
  
      for (const instance of KeyPoolManager.instances) {
        const poolStats = instance.getStats()
        stats.total += poolStats.total
        stats.available += poolStats.available
        stats.inUse += poolStats.inUse
        stats.exhausted += poolStats.exhausted
        stats.pools[instance.envVarName] = poolStats
      }
  
      return stats
    }
  }
  