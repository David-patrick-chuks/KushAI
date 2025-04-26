import type { AxiosError } from "axios"
import { ERROR_CODES } from "@kushai/common"
import type { KushaiError } from "./types"

/**
 * Creates a standardized Kushai error from an Axios error
 * @param error The original error
 * @returns A standardized Kushai error
 */
export function createKushaiError(error: unknown): KushaiError {
  if (isAxiosError(error)) {
    const status = error.response?.status || 500
    const data = error.response?.data || {}

    // Use the error code from the response if available
    const code = data.code || mapStatusToErrorCode(status)
    const message = data.message || error.message || "Unknown error occurred"
    const details = data.details || undefined

    return {
      code,
      message,
      status,
      details,
    }
  }

  // Handle non-Axios errors
  if (error instanceof Error) {
    return {
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: error.message,
      status: 500,
    }
  }

  // Handle unknown errors
  return {
    code: ERROR_CODES.INTERNAL_SERVER_ERROR,
    message: "Unknown error occurred",
    status: 500,
  }
}

/**
 * Type guard for Axios errors
 * @param error The error to check
 * @returns True if the error is an Axios error
 */
function isAxiosError(error: unknown): error is AxiosError {
  return typeof error === "object" && error !== null && "isAxiosError" in error && (error as any).isAxiosError === true
}

/**
 * Maps HTTP status codes to error codes
 * @param status The HTTP status code
 * @returns The corresponding error code
 */
function mapStatusToErrorCode(status: number): string {
  switch (status) {
    case 400:
      return ERROR_CODES.INVALID_REQUEST
    case 401:
      return ERROR_CODES.UNAUTHORIZED
    case 403:
      return ERROR_CODES.FORBIDDEN
    case 404:
      return ERROR_CODES.NOT_FOUND
    case 429:
      return ERROR_CODES.RATE_LIMIT_EXCEEDED
    case 503:
      return ERROR_CODES.SERVICE_UNAVAILABLE
    default:
      return ERROR_CODES.INTERNAL_SERVER_ERROR
  }
}
