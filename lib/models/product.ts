import type { ObjectId } from "mongodb"

export interface Product {
  _id?: ObjectId
  name: string
  nameEn: string
  description: string
  descriptionEn: string
  price: number
  salePrice?: number
  images: string[]
  category: "raw" | "flavored" | "gift-set" | "bee-products"
  tags: string[]
  stock: number
  weight: number // in grams
  origin: string
  harvestDate?: Date
  nutritionFacts?: {
    calories: number
    carbs: number
    sugar: number
    protein: number
  }
  benefits: string[]
  isOrganic: boolean
  isFeatured: boolean
  isActive: boolean
  ratings: {
    average: number
    count: number
  }
  createdAt: Date
  updatedAt: Date
}
