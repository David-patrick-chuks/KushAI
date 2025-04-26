import mongoose, { type Document, Schema } from "mongoose"
import bcrypt from "bcrypt"
import type { User } from "@kushai/common"

/**
 * User document interface
 */
export interface UserDocument extends User, Document {
  password: string
  tier: "FREE_TIER" | "PRO_TIER" | "ENTERPRISE_TIER"
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

/**
 * User schema
 */
const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    tier: {
      type: String,
      enum: ["FREE_TIER", "PRO_TIER", "ENTERPRISE_TIER"],
      default: "FREE_TIER",
    },
  },
  {
    timestamps: true,
  },
)

// Create index on email field
userSchema.index({ email: 1 })

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next()

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10)

    // Hash the password along with the new salt
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

/**
 * User model
 */
export const UserModel = mongoose.model<UserDocument>("User", userSchema)
