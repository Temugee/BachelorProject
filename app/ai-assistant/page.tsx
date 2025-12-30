"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "ai/react"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Send, Sparkles, User, Bot, Camera, Lightbulb, ShoppingBag, Heart, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const suggestedQuestions = [
  { icon: ShoppingBag, text: "What honey is best for cooking?" },
  { icon: Heart, text: "What are the health benefits of raw honey?" },
  { icon: Lightbulb, text: "How do I know if honey is authentic?" },
  { icon: Sparkles, text: "Recommend honey for a gift" },
]

export default function AIAssistantPage() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [imageUrl, setImageUrl] = useState<string>("")
  const [imageAnalysis, setImageAnalysis] = useState<any>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: "/api/ai/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: `# Welcome to Bataa's Honey AI Assistant! 🍯

I'm here to help you discover the perfect honey for your needs. Here's what I can do:

- **Product Recommendations**: Find the ideal honey based on your preferences
- **Health & Benefits**: Learn about honey's amazing health properties
- **Recipes & Tips**: Get delicious recipe ideas and usage tips
- **Quality Analysis**: Upload a honey photo for authenticity assessment
- **Mongolian Traditions**: Discover the rich heritage of Mongolian beekeeping

How can I assist you today?`,
      },
    ],
  })

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleQuestionClick = (question: string) => {
    append({ role: "user", content: question })
  }

  const analyzeImage = async () => {
    if (!imageUrl) return

    setIsAnalyzing(true)
    try {
      const res = await fetch("/api/ai/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      })

      if (res.ok) {
        const data = await res.json()
        setImageAnalysis(data.analysis)
      }
    } catch (error) {
      console.error("Image analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                <Sparkles className="h-5 w-5" />
                <span className="font-medium">AI-Powered Assistant</span>
              </div>
              <h1 className="font-serif text-4xl font-bold text-foreground mb-4">Honey Expert AI</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get personalized recommendations, learn about honey benefits, and even analyze honey quality with our
                intelligent assistant.
              </p>
            </div>

            <Tabs defaultValue="chat" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="chat">
                  <Bot className="mr-2 h-4 w-4" />
                  Chat Assistant
                </TabsTrigger>
                <TabsTrigger value="analyze">
                  <Camera className="mr-2 h-4 w-4" />
                  Image Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat">
                <Card>
                  <CardContent className="p-0">
                    {/* Chat Messages */}
                    <ScrollArea className="h-[500px] p-6" ref={scrollRef}>
                      <div className="space-y-6">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={cn("flex gap-4", message.role === "user" ? "flex-row-reverse" : "")}
                          >
                            <div
                              className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                                message.role === "user" ? "bg-primary" : "bg-muted",
                              )}
                            >
                              {message.role === "user" ? (
                                <User className="h-5 w-5 text-primary-foreground" />
                              ) : (
                                <Sparkles className="h-5 w-5 text-primary" />
                              )}
                            </div>
                            <div
                              className={cn(
                                "rounded-2xl px-4 py-3 max-w-[80%]",
                                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                              )}
                            >
                              <div className="prose prose-sm dark:prose-invert max-w-none">
                                {message.content.split("\n").map((line, i) => (
                                  <p key={i} className="mb-2 last:mb-0">
                                    {line}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                            </div>
                            <div className="rounded-2xl bg-muted px-4 py-3">
                              <div className="flex gap-1">
                                <span className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce" />
                                <span className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:100ms]" />
                                <span className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:200ms]" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>

                    {/* Suggested Questions */}
                    {messages.length <= 1 && (
                      <div className="px-6 pb-4">
                        <p className="text-sm text-muted-foreground mb-3">Try asking:</p>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {suggestedQuestions.map((q, i) => (
                            <button
                              key={i}
                              onClick={() => handleQuestionClick(q.text)}
                              className="flex items-center gap-2 p-3 text-left text-sm border rounded-lg hover:bg-muted transition-colors"
                            >
                              <q.icon className="h-4 w-4 text-primary shrink-0" />
                              {q.text}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="border-t p-4">
                      <div className="flex gap-2">
                        <Input
                          value={input}
                          onChange={handleInputChange}
                          placeholder="Ask me anything about honey..."
                          className="flex-1"
                        />
                        <Button type="submit" disabled={isLoading || !input.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analyze">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5 text-primary" />
                      Honey Quality Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground">
                      Upload a photo of honey to analyze its quality, authenticity, and get storage recommendations
                      using AI vision technology.
                    </p>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Image URL</label>
                        <div className="flex gap-2">
                          <Input
                            placeholder="Paste image URL here..."
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                          />
                          <Button onClick={analyzeImage} disabled={!imageUrl || isAnalyzing}>
                            {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Analyze"}
                          </Button>
                        </div>
                      </div>

                      {imageUrl && (
                        <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border">
                          <Image
                            src={imageUrl || "/placeholder.svg"}
                            alt="Honey to analyze"
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}

                      {imageAnalysis && (
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="p-4 bg-muted rounded-lg">
                            <h4 className="font-medium mb-2">Quality Assessment</h4>
                            <p className="text-2xl font-bold text-primary capitalize">{imageAnalysis.quality}</p>
                          </div>
                          <div className="p-4 bg-muted rounded-lg">
                            <h4 className="font-medium mb-2">Honey Type</h4>
                            <p className="text-lg font-medium">{imageAnalysis.honeyType}</p>
                          </div>
                          <div className="p-4 bg-muted rounded-lg">
                            <h4 className="font-medium mb-2">Authenticity Score</h4>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-background rounded-full h-3">
                                <div
                                  className="bg-primary h-3 rounded-full transition-all"
                                  style={{ width: `${imageAnalysis.authenticity.score}%` }}
                                />
                              </div>
                              <span className="font-bold">{imageAnalysis.authenticity.score}%</span>
                            </div>
                            <ul className="mt-2 text-sm text-muted-foreground">
                              {imageAnalysis.authenticity.indicators.map((ind: string, i: number) => (
                                <li key={i}>• {ind}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-4 bg-muted rounded-lg">
                            <h4 className="font-medium mb-2">Recommendations</h4>
                            <ul className="text-sm text-muted-foreground">
                              {imageAnalysis.recommendations.map((rec: string, i: number) => (
                                <li key={i}>• {rec}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
