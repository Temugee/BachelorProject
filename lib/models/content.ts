import type { ObjectId } from "mongodb"

export interface Content {
  _id?: ObjectId
  title: string
  titleEn: string
  slug: string
  content: string
  contentEn: string
  excerpt: string
  excerptEn: string
  coverImage: string
  category: "blog" | "recipe" | "education" | "news"
  tags: string[]
  accessType: "free" | "premium"
  author: {
    id: ObjectId
    name: string
  }
  views: number
  likes: number
  isPublished: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}
