import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import type { Order } from "@/lib/models/order"
import { ObjectId } from "mongodb"

function generateOrderNumber(): string {
  const date = new Date()
  const year = date.getFullYear().toString().slice(-2)
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `BH${year}${month}${random}`
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const query = user.role === "admin" ? {} : { userId: new ObjectId(user.id) }

    const orders = await db.collection<Order>("orders").find(query).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Orders fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const db = await getDatabase()

    const order: Order = {
      userId: new ObjectId(user.id),
      orderNumber: generateOrderNumber(),
      items: data.items,
      subtotal: data.subtotal,
      shippingCost: data.shippingCost || 5000,
      discount: data.discount || 0,
      total: data.total,
      status: "pending",
      paymentStatus: "pending",
      paymentMethod: data.paymentMethod,
      shippingAddress: data.shippingAddress,
      notes: data.notes,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection<Order>("orders").insertOne(order)

    return NextResponse.json({
      order: { ...order, _id: result.insertedId },
    })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
