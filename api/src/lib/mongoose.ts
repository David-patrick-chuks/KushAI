import mongoose from "mongoose"
import { logger } from "./logger"

/**
 * MongoDB connection options
 */
const options = {
  autoIndex: true,
  serverSelectionTimeoutMS: 5000,
}

/**
 * Connect to MongoDB
 */
export async function connectToDatabase(): Promise<void> {
  try {
    const mongoUri = process.env.MONGODB_URI

    if (!mongoUri) {
      throw new Error("MONGODB_URI environment variable is not set")
    }

    await mongoose.connect(mongoUri, options)
    logger.info("Connected to MongoDB")
  } catch (error) {
    logger.error("Failed to connect to MongoDB", error)
    process.exit(1)
  }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectFromDatabase(): Promise<void> {
  try {
    await mongoose.disconnect()
    logger.info("Disconnected from MongoDB")
  } catch (error) {
    logger.error("Failed to disconnect from MongoDB", error)
  }
}

/**
 * MongoDB connection events
 */
mongoose.connection.on("error", (err) => {
  logger.error("MongoDB connection error:", err)
})

mongoose.connection.on("disconnected", () => {
  logger.warn("MongoDB disconnected")
})

mongoose.connection.on("reconnected", () => {
  logger.info("MongoDB reconnected")
})

// Handle process termination
process.on("SIGINT", async () => {
  await disconnectFromDatabase()
  process.exit(0)
})

process.on("SIGTERM", async () => {
  await disconnectFromDatabase()
  process.exit(0)
})
