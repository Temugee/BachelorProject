import { streamText } from "ai"
import type { NextRequest } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { messages, productContext } = await request.json()

    // Get product recommendations context
    const db = await getDatabase()
    const featuredProducts = await db
      .collection("products")
      .find({ isActive: true, isFeatured: true })
      .limit(5)
      .toArray()

    const systemPrompt = `You are a helpful AI assistant for Bataa's Honey, a premium Mongolian honey store. 
    
Your role is to:
- Help customers find the perfect honey products
- Answer questions about honey benefits, uses, and recipes
- Provide recommendations based on customer needs
- Share information about Mongolian honey and beekeeping traditions

Available Products:
${featuredProducts.map((p) => `- ${p.name}: ${p.description} (${p.price}₮)`).join("\n")}

Be friendly, knowledgeable, and helpful. Respond in the same language the customer uses (Mongolian or English).
If asked about orders or payments, guide them to the checkout process.`

    const result = streamText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      messages,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error("AI Chat error:", error)
    return new Response(JSON.stringify({ error: "AI service unavailable" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
