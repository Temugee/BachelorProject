import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"

// Khan Bank API Integration
const KHANBANK_API_URL = process.env.KHANBANK_API_URL || "https://api.khanbank.com"
const KHANBANK_MERCHANT_ID = process.env.KHANBANK_MERCHANT_ID
const KHANBANK_SECRET = process.env.KHANBANK_SECRET

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderId, amount, description } = await request.json()

    // Demo mode for development
    const mockTransactionId = `KB_${Date.now()}`

    // Store transaction details
    const db = await getDatabase()
    await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          "paymentDetails.transactionId": mockTransactionId,
          paymentMethod: "khanbank",
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({
      transactionId: mockTransactionId,
      paymentUrl: `https://e.khanbank.com/payment?merchant=${KHANBANK_MERCHANT_ID}&amount=${amount}&txn=${mockTransactionId}`,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=KhanBank:${mockTransactionId}:${amount}`,
      accountNumber: "5012345678",
      accountName: "BATAA'S HONEY LLC",
      bankName: "Khan Bank",
      isDemo: true,
    })
  } catch (error) {
    console.error("Khan Bank error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
