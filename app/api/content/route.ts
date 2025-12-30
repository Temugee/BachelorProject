import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import type { Content } from "@/lib/models/content"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const accessType = searchParams.get("accessType")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const page = Number.parseInt(searchParams.get("page") || "1")

    const user = await getCurrentUser()
    const db = await getDatabase()

    const query: any = { isPublished: true }

    if (category) query.category = category
    if (accessType) query.accessType = accessType

    const contents = await db
      .collection<Content>("contents")
      .find(query)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    // Filter premium content for non-premium users
    const filteredContents = contents.map((content) => {
      if (content.accessType === "premium" && user?.subscriptionStatus !== "premium") {
        return {
          ...content,
          content: content.content.substring(0, 300) + "...",
          contentEn: content.contentEn.substring(0, 300) + "...",
          isLocked: true,
        }
      }
      return { ...content, isLocked: false }
    })

    const total = await db.collection<Content>("contents").countDocuments(query)

    return NextResponse.json({
      contents: filteredContents,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error("Content fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const data = await request.json()
    const db = await getDatabase()

    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const content: Content = {
      ...data,
      slug,
      author: { id: new ObjectId(user.id), name: user.name },
      views: 0,
      likes: 0,
      isPublished: data.isPublished || false,
      publishedAt: data.isPublished ? new Date() : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Content>("contents").insertOne(content)

    return NextResponse.json({
      content: { ...content, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Content creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
