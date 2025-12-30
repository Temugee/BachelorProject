import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  email: string
  password: string
  name: string
  role: "user" | "admin"
  avatar?: string
  phone?: string
  address?: {
    street: string
    city: string
    district: string
    zipCode: string
  }
  subscriptionStatus: "free" | "premium"
  subscriptionExpiry?: Date
  createdAt: Date
  updatedAt: Date
}

export interface UserSession {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  subscriptionStatus: "free" | "premium"
}
