import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from "vitest"
import request from "supertest"
import app from "../index"
import { GeminiService } from "../services/gemini-service"
import { connectToDatabase, disconnectFromDatabase } from "../lib/mongoose"
import { UserModel } from "../models/user.model"
import { ApiKeyModel } from "../models/api-key.model"
import { generateApiKey } from "@kushai/common"

// Mock the GeminiService
vi.mock("../services/gemini-service", () => ({
  GeminiService: {
    generateImage: vi.fn(),
  },
}))

describe("Image Generation Route", () => {
  let apiKey: string

  beforeAll(async () => {
    // Connect to test database
    process.env.MONGODB_URI = "mongodb://localhost:27017/kushai_test"
    process.env.JWT_SECRET = "test_jwt_secret"
    await connectToDatabase()
  })

  afterAll(async () => {
    await disconnectFromDatabase()
  })

  beforeEach(async () => {
    // Clear database before each test
    await UserModel.deleteMany({})
    await ApiKeyModel.deleteMany({})

    // Create a test user and API key
    const user = await new UserModel({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    }).save()

    apiKey = generateApiKey("test")

    await new ApiKeyModel({
      key: apiKey,
      userId: user._id,
      name: "Test API Key",
    }).save()

    // Reset mocks
    vi.resetAllMocks()
  })

  it("should generate images successfully", async () => {
    // Mock the service response
    const mockImages = ["data:image/png;base64,abc123", "data:image/png;base64,def456"]

    vi.mocked(GeminiService.generateImage).mockResolvedValueOnce({
      images: mockImages,
      usage: {
        promptTokens: 100,
        completionTokens: 0,
        totalTokens: 100,
      },
    })

    const response = await request(app).post("/v1/image").set("Authorization", `Bearer ${apiKey}`).send({
      prompt: "A futuristic city with flying cars",
      width: 1024,
      height: 1024,
      numberOfImages: 2,
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("images")
    expect(response.body.images).toEqual(mockImages)
    expect(response.body).toHaveProperty("usage")

    expect(GeminiService.generateImage).toHaveBeenCalledWith("A futuristic city with flying cars", {
      width: 1024,
      height: 1024,
      numberOfImages: 2,
    })
  })

  it("should validate the prompt", async () => {
    const response = await request(app).post("/v1/image").set("Authorization", `Bearer ${apiKey}`).send({
      width: 1024,
      height: 1024,
    })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("code", "invalid_request")
    expect(response.body.message).toContain("Prompt is required")
  })

  it("should validate image dimensions", async () => {
    const response = await request(app).post("/v1/image").set("Authorization", `Bearer ${apiKey}`).send({
      prompt: "A futuristic city",
      width: 5000, // Too large
      height: 1024,
    })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("code", "invalid_request")
    expect(response.body.message).toContain("Width must be between")
  })
})
