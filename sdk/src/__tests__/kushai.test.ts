import { describe, it, expect, vi, beforeEach } from "vitest"
import { Kushai } from "../kushai"
import axios from "axios"
import { ERROR_CODES } from "@kushai/common"

// Mock axios
vi.mock("axios", () => {
  return {
    default: {
      create: vi.fn(() => ({
        request: vi.fn(),
        interceptors: {
          response: {
            use: vi.fn(),
          },
        },
      })),
    },
  }
})

describe("Kushai SDK", () => {
  let kushai: Kushai
  let mockAxiosInstance: any

  beforeEach(() => {
    vi.resetAllMocks()
    kushai = new Kushai("ksh_test_123456789012345678901234")
    mockAxiosInstance = (axios.create as any).mock.results[0].value
  })

  it("should initialize with a valid API key", () => {
    expect(kushai).toBeDefined()
  })

  it("should throw an error if API key is missing", () => {
    expect(() => new Kushai("")).toThrow("API key is required")
  })

  it("should throw an error if API key format is invalid", () => {
    expect(() => new Kushai("invalid-key")).toThrow("Invalid API key format")
  })

  it("should generate text successfully", async () => {
    const mockResponse = {
      data: {
        text: "Generated text",
        usage: {
          promptTokens: 10,
          completionTokens: 20,
          totalTokens: 30,
        },
      },
    }

    mockAxiosInstance.request.mockResolvedValueOnce(mockResponse)

    const result = await kushai.generate({ prompt: "Hello" })

    expect(mockAxiosInstance.request).toHaveBeenCalledWith({
      method: "POST",
      url: "/v1/generate",
      data: { prompt: "Hello" },
    })

    expect(result).toEqual(mockResponse.data)
  })

  it("should handle API errors correctly", async () => {
    const mockError = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          code: ERROR_CODES.INVALID_REQUEST,
          message: "Invalid request",
        },
      },
    }

    mockAxiosInstance.request.mockRejectedValueOnce(mockError)

    await expect(kushai.generate({ prompt: "Hello" })).rejects.toEqual({
      code: ERROR_CODES.INVALID_REQUEST,
      message: "Invalid request",
      status: 400,
    })
  })
})
