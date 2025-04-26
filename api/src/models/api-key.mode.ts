import mongoose, { type Document, Schema } from "mongoose"
import type { ApiKey } from "@kushai/common"

/**
 * API key document interface
 */
export interface ApiKeyDocument extends ApiKey, Document {
  updatedAt: Date
}

/**
 * API key schema
 */
const apiKeySchema = new Schema<ApiKeyDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    lastUsedAt: {
      type: Date,
      default: null,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

// Create indexes
apiKeySchema.index({ key: 1 })
apiKeySchema.index({ userId: 1 })

/**
 * API key model
 */
export const ApiKeyModel = mongoose.model<ApiKeyDocument>("ApiKey", apiKeySchema)
