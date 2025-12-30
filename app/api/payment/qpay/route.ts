import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"

// QPay API Integration (Mongolian Payment)
const QPAY_API_URL = process.env.QPAY_API_URL || "https://merchant.qpay.mn/v2"
const QPAY_USERNAME = process.env.QPAY_USERNAME
const QPAY_PASSWORD = process.env.QPAY_PASSWORD
const QPAY_INVOICE_CODE = process.env.QPAY_INVOICE_CODE

async function getQPayToken(): Promise<string | null> {
  try {
    const response = await fetch(`${QPAY_API_URL}/auth/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${QPAY_USERNAME}:${QPAY_PASSWORD}`).toString("base64")}`,
      },
    })

    if (!response.ok) return null

    const data = await response.json()
    return data.access_token
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderId, amount, description } = await request.json()

    const token = await getQPayToken()
    if (!token) {
      // Demo mode - return mock QR code for testing
      const mockInvoiceId = `DEMO_${Date.now()}`
      return NextResponse.json({
        invoiceId: mockInvoiceId,
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=QPay:${mockInvoiceId}:${amount}`,
        qrImage: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=QPay:${mockInvoiceId}:${amount}`,
        urls: [
          { name: "Khan Bank", link: `khanbank://payment?invoice=${mockInvoiceId}` },
          { name: "Golomt Bank", link: `golomtbank://payment?invoice=${mockInvoiceId}` },
          { name: "State Bank", link: `statebank://payment?invoice=${mockInvoiceId}` },
        ],
        isDemo: true,
      })
    }

    // Real QPay integration
    const invoiceResponse = await fetch(`${QPAY_API_URL}/invoice`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invoice_code: QPAY_INVOICE_CODE,
        sender_invoice_no: orderId,
        invoice_receiver_code: "terminal",
        invoice_description: description || "Bataa's Honey Order",
        amount: amount,
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/qpay/callback`,
      }),
    })

    if (!invoiceResponse.ok) {
      return NextResponse.json({ error: "Failed to create QPay invoice" }, { status: 500 })
    }

    const invoiceData = await invoiceResponse.json()

    // Update order with payment details
    const db = await getDatabase()
    await db.collection("orders").updateOne(
      { _id: new ObjectId(orderId) },
      {
        $set: {
          "paymentDetails.invoiceId": invoiceData.invoice_id,
          "paymentDetails.qrCode": invoiceData.qr_image,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({
      invoiceId: invoiceData.invoice_id,
      qrCode: invoiceData.qr_text,
      qrImage: invoiceData.qr_image,
      urls: invoiceData.urls,
    })
  } catch (error) {
    console.error("QPay error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
