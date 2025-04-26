import { Router } from "express"
import jwt from "jsonwebtoken"
import { generateApiKey } from "@kushai/common"
import { UserModel } from "../models/user.model"
import { ApiKeyModel } from "../models/api-key.model"
import { logger } from "../lib/logger"

const router = Router()

/**
 * @route POST /v1/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", async (req, res, next) => {
  try {
    const { email, password, name } = req.body

    // Validate request
    if (!email || !password) {
      return res.status(400).json({
        code: "invalid_request",
        message: "Email and password are required",
        status: 400,
      })
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email }).exec()

    if (existingUser) {
      return res.status(400).json({
        code: "invalid_request",
        message: "User already exists",
        status: 400,
      })
    }

    // Create a new user (password will be hashed by the pre-save hook)
    const user = new UserModel({
      email,
      password,
      name,
    })

    await user.save()

    // Generate an API key for the new user
    const apiKey = new ApiKeyModel({
      key: generateApiKey("live"),
      userId: user._id,
      name: "Default API Key",
    })

    await apiKey.save()

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "default_jwt_secret", { expiresIn: "7d" })

    logger.info(`User registered: ${user._id}`)

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
      apiKey: apiKey.key,
    })
  } catch (error) {
    logger.error("Registration error", error)
    next(error)
  }
})

/**
 * @route POST /v1/auth/login
 * @desc Login a user
 * @access Public
 */
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validate request
    if (!email || !password) {
      return res.status(400).json({
        code: "invalid_request",
        message: "Email and password are required",
        status: 400,
      })
    }

    // Find the user
    const user = await UserModel.findOne({ email }).exec()

    if (!user) {
      return res.status(401).json({
        code: "unauthorized",
        message: "Invalid credentials",
        status: 401,
      })
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      logger.warn(`Failed login attempt for user: ${email}`)
      return res.status(401).json({
        code: "unauthorized",
        message: "Invalid credentials",
        status: 401,
      })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "default_jwt_secret", { expiresIn: "7d" })

    // Get the user's API keys
    const apiKeys = await ApiKeyModel.find({
      userId: user._id,
      revokedAt: null,
    }).exec()

    logger.info(`User logged in: ${user._id}`)

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
      apiKeys,
    })
  } catch (error) {
    logger.error("Login error", error)
    next(error)
  }
})

export default router
