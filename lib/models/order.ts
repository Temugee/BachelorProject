import type { ObjectId } from "mongodb"

export interface OrderItem {
  productId: ObjectId
  name: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  _id?: ObjectId
  userId: ObjectId
  orderNumber: string
  items: OrderItem[]
  subtotal: number
  shippingCost: number
  discount: number
  total: number
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  paymentMethod: "qpay" | "khanbank" | "card" | "cash"
  paymentDetails?: {
    transactionId?: string
    qrCode?: string
    invoiceId?: string
  }
  shippingAddress: {
    name: string
    phone: string
    street: string
    city: string
    district: string
    zipCode: string
  }
  notes?: string
  createdAt: Date
  updatedAt: Date
}
