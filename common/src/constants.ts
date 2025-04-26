// API endpoints
export const API_ENDPOINTS = {
    GENERATE: "/v1/generate",
    IMAGE: "/v1/image",
    VIDEO: "/v1/video",
    STRUCTURED: "/v1/structured",
    AUDIO_UNDERSTANDING: "/v1/audio-understanding",
    VIDEO_UNDERSTANDING: "/v1/video-understanding",
    IMAGE_UNDERSTANDING: "/v1/image-understanding",
    MULTIMODAL: "/v1/multimodal",
    CHAT: "/v1/chat",
    FUNCTION_CALLING: "/v1/function-calling",
    KEYS: "/v1/keys",
    AUTH: "/v1/auth",
  }
  
  // Error codes
  export const ERROR_CODES = {
    UNAUTHORIZED: "unauthorized",
    FORBIDDEN: "forbidden",
    NOT_FOUND: "not_found",
    RATE_LIMIT_EXCEEDED: "rate_limit_exceeded",
    INVALID_REQUEST: "invalid_request",
    INTERNAL_SERVER_ERROR: "internal_server_error",
    SERVICE_UNAVAILABLE: "service_unavailable",
  }
  
  // Default configuration
  export const DEFAULT_CONFIG = {
    BASE_URL: "https://api.kushai.com",
    MAX_RETRIES: 3,
    TIMEOUT: 30000, // 30 seconds
    DEFAULT_HEADERS: {
      "Content-Type": "application/json",
    },
  }
  
  // Rate limits
  export const RATE_LIMITS = {
    FREE_TIER: {
      REQUESTS_PER_MINUTE: 10,
      REQUESTS_PER_DAY: 100,
    },
    PRO_TIER: {
      REQUESTS_PER_MINUTE: 60,
      REQUESTS_PER_DAY: 1000,
    },
    ENTERPRISE_TIER: {
      REQUESTS_PER_MINUTE: 300,
      REQUESTS_PER_DAY: 10000,
    },
  }
  