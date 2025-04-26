import express from "express"
import cors from "cors"
import helmet from "helmet"
import dotenv from "dotenv"
import { errorHandler } from "./middleware/error-handler"
import { registerRoutes } from "./routes"
import { connectToDatabase } from "./lib/mongoose"
import { logger, httpLogger } from "./lib/logger"
import pinoHttp from "pino-http"

// Load environment variables
dotenv.config()

// Create Express app
const app = express()
const port = process.env.PORT || 3000

// Connect to MongoDB
connectToDatabase()
  .then(() => {
    // Apply middleware
    app.use(helmet())
    app.use(cors())

    // Add HTTP request logging
    app.use(
      pinoHttp({
        logger: httpLogger,
      }),
    )

    app.use(express.json({ limit: "50mb" }))
    app.use(express.urlencoded({ extended: true, limit: "50mb" }))

    // Register routes
    registerRoutes(app)

    // Apply error handler
    app.use(errorHandler)

    // Start the server
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`)
    })
  })
  .catch((error) => {
    logger.error("Failed to start server", error)
    process.exit(1)
  })

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection", { reason, promise })
})

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception", error)
  process.exit(1)
})

export default app
