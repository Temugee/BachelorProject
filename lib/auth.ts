import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { getDatabase } from "./mongodb"
import type { User, UserSession } from "./models/user"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: UserSession): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): UserSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSession
  } catch {
    return null
  }
}

export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) return null

  return verifyToken(token)
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete("auth_token")
}

export async function createUser(userData: Partial<User>): Promise<User> {
  const db = await getDatabase()
  const hashedPassword = await hashPassword(userData.password!)

  const user: User = {
    email: userData.email!,
    password: hashedPassword,
    name: userData.name!,
    role: userData.role || "user",
    subscriptionStatus: "free",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await db.collection("users").insertOne(user)
  user._id = result.insertedId

  return user
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const db = await getDatabase()
  return db.collection<User>("users").findOne({ email })
}
