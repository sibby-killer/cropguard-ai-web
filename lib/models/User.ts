import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IUser extends Document {
  clerkUserId: string
  email: string
  firstName?: string
  lastName?: string
  imageUrl?: string
  createdAt: Date
  lastLogin?: Date
}

const UserSchema = new Schema<IUser>({
  clerkUserId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    index: true
  },
  firstName: String,
  lastName: String,
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
})

// Create indexes for better performance
UserSchema.index({ clerkUserId: 1 })
UserSchema.index({ email: 1 })
UserSchema.index({ createdAt: -1 })

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export default User