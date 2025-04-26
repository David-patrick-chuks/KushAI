import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from "vitest"
import request from "supertest"
import app from "../index"
import { UserModel } from "../models/user.model"
import { ApiKeyModel } from "../models/api-key.model"
import { connectToDatabase, disconnectFromDatabase } from "../lib/mongoose"

// Mock JWT
vi.mock("jsonwebtoken", () => ({
  sign: vi.fn(() => "test_token"),
}))

describe("Auth Routes", () => {
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
  })

  it("should register a new user", async () => {
    const response = await request(app).post("/v1/auth/register").send({
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("token")
    expect(response.body).toHaveProperty("apiKey")
    expect(response.body.user).toHaveProperty("email", "test@example.com")

    // Verify user was created in database
    const user = await UserModel.findOne({ email: "test@example.com" })
    expect(user).not.toBeNull()
  })

  it("should not register a user with an existing email", async () => {
    // Create a user first
    await new UserModel({
      email: "existing@example.com",
      password: "hashedpassword",
      name: "Existing User",
    }).save()

    // Try to register with the same email
    const response = await request(app).post("/v1/auth/register").send({
      email: "existing@example.com",
      password: "password123",
      name: "Test User",
    })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty("code", "invalid_request")
  })

  it("should login a user with valid credentials", async () => {
    // Create a user first
    await new UserModel({
      email: "login@example.com",
      password: "password123", // In real app, this would be hashed
      name: "Login User",
    }).save()

    const response = await request(app).post("/v1/auth/login").send({
      email: "login@example.com",
      password: "password123",
    })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("token")
    expect(response.body.user).toHaveProperty("email", "login@example.com")
  })

  it("should not login a user with invalid credentials", async () => {
    // Create a user first
    await new UserModel({
      email: "login@example.com",
      password: "password123", // In real app, this would be hashed
      name: "Login User",
    }).save()

    const response = await request(app).post("/v1/auth/login").send({
      email: "login@example.com",
      password: "wrongpassword",
    })

    expect(response.status).toBe(401)
    expect(response.body).toHaveProperty("code", "unauthorized")
  })
})
