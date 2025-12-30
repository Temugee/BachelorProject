import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { preferences, budget, purpose } = await request.json()

    const db = await getDatabase()
    const products = await db.collection("products").find({ isActive: true }).toArray()

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: `Based on these customer preferences:
- Purpose: ${purpose || "general use"}
- Budget: ${budget || "any"}
- Preferences: ${preferences || "none specified"}

Available products:
${products.map((p) => `ID: ${p._id}, Name: ${p.name}, Price: ${p.price}₮, Category: ${p.category}, Description: ${p.description}`).join("\n")}

Return a JSON array of the top 3 recommended product IDs with brief explanations. Format:
[{"id": "...", "reason": "..."}]`,
    })

    try {
      const recommendations = JSON.parse(text)
      const recommendedProducts = await Promise.all(
        recommendations.map(async (rec: { id: string; reason: string }) => {
          const product = products.find((p) => p._id.toString() === rec.id)
          return product ? { ...product, recommendationReason: rec.reason } : null
        }),
      )

      return NextResponse.json({
        recommendations: recommendedProducts.filter(Boolean),
      })
    } catch {
      return NextResponse.json({ recommendations: products.slice(0, 3) })
    }
  } catch (error) {
    console.error("AI Recommend error:", error)
    return NextResponse.json({ error: "AI service unavailable" }, { status: 500 })
  }
}
