"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { AIChatWidget } from "@/components/ai-chat-widget"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search, Filter, X, Sparkles, Loader2 } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const categories = [
  { value: "all", label: "All Products" },
  { value: "raw", label: "Raw Honey" },
  { value: "flavored", label: "Flavored Honey" },
  { value: "gift-set", label: "Gift Sets" },
  { value: "bee-products", label: "Bee Products" },
]

// Mock products for demo
const mockProducts = [
  {
    _id: "1",
    name: "Цэцгийн Зөгийн Бал",
    nameEn: "Wildflower Honey",
    price: 45000,
    images: ["/golden-wildflower-honey-jar.jpg"],
    category: "raw",
    stock: 50,
    weight: 500,
    isOrganic: true,
    ratings: { average: 4.8, count: 124 },
  },
  {
    _id: "2",
    name: "Нарны Зөгийн Бал",
    nameEn: "Buckwheat Honey",
    price: 55000,
    salePrice: 48000,
    images: ["/dark-buckwheat-honey-jar.jpg"],
    category: "raw",
    stock: 30,
    weight: 500,
    isOrganic: true,
    ratings: { average: 4.9, count: 89 },
  },
  {
    _id: "3",
    name: "Чацаргана Зөгийн Бал",
    nameEn: "Sea Buckthorn Honey",
    price: 65000,
    images: ["/orange-sea-buckthorn-honey-jar.jpg"],
    category: "flavored",
    stock: 25,
    weight: 350,
    isOrganic: true,
    ratings: { average: 4.7, count: 56 },
  },
  {
    _id: "4",
    name: "Бэлэг Сет",
    nameEn: "Premium Gift Set",
    price: 150000,
    images: ["/luxury-honey-gift-set-box.jpg"],
    category: "gift-set",
    stock: 15,
    weight: 1500,
    isOrganic: true,
    ratings: { average: 5.0, count: 34 },
  },
  {
    _id: "5",
    name: "Шар Цэцгийн Бал",
    nameEn: "Sunflower Honey",
    price: 42000,
    images: ["/light-yellow-sunflower-honey-jar.jpg"],
    category: "raw",
    stock: 45,
    weight: 500,
    isOrganic: false,
    ratings: { average: 4.6, count: 78 },
  },
  {
    _id: "6",
    name: "Лавандерын Бал",
    nameEn: "Lavender Honey",
    price: 58000,
    images: ["/purple-tinted-lavender-honey-jar.jpg"],
    category: "flavored",
    stock: 20,
    weight: 350,
    isOrganic: true,
    ratings: { average: 4.8, count: 45 },
  },
  {
    _id: "7",
    name: "Зөгийн Шүү",
    nameEn: "Propolis Extract",
    price: 35000,
    images: ["/dark-propolis-extract-bottle.jpg"],
    category: "bee-products",
    stock: 60,
    weight: 100,
    isOrganic: true,
    ratings: { average: 4.9, count: 92 },
  },
  {
    _id: "8",
    name: "Зөгийн Тос",
    nameEn: "Royal Jelly",
    price: 95000,
    images: ["/royal-jelly-golden-jar-luxury.jpg"],
    category: "bee-products",
    stock: 10,
    weight: 50,
    isOrganic: true,
    ratings: { average: 5.0, count: 28 },
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts)
  const [isLoading, setIsLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [organicOnly, setOrganicOnly] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([])

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.nameEn.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === "all" || product.category === category
    const matchesOrganic = !organicOnly || product.isOrganic
    return matchesSearch && matchesCategory && matchesOrganic
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.salePrice || a.price) - (b.salePrice || b.price)
      case "price-high":
        return (b.salePrice || b.price) - (a.salePrice || a.price)
      case "rating":
        return b.ratings.average - a.ratings.average
      case "newest":
        return 0 // Would sort by date in real implementation
      default:
        return 0
    }
  })

  const getAIRecommendations = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: search,
          purpose: category !== "all" ? category : undefined,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setAiRecommendations(data.recommendations.map((r: any) => r._id || r.id))
      }
    } catch (error) {
      console.error("AI recommendation error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                category === cat.value ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Filters</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="organic"
            checked={organicOnly}
            onCheckedChange={(checked) => setOrganicOnly(checked as boolean)}
          />
          <Label htmlFor="organic" className="text-sm">
            Organic Only
          </Label>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Sort By</h3>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <h1 className="font-serif text-4xl font-bold text-foreground mb-4">Our Honey Collection</h1>
            <p className="text-muted-foreground max-w-2xl">
              Explore our range of premium Mongolian honey products, from pure raw honey to unique flavored varieties
              and gift sets.
            </p>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="border-b border-border py-4 sticky top-16 bg-background z-40">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Button variant="outline" onClick={getAIRecommendations} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                AI Recommend
              </Button>

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[180px] hidden md:flex">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden bg-transparent">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex gap-8">
              {/* Desktop Sidebar */}
              <aside className="hidden lg:block w-64 shrink-0">
                <FilterContent />
              </aside>

              {/* Products */}
              <div className="flex-1">
                {/* Active filters */}
                {(category !== "all" || organicOnly || search) && (
                  <div className="flex flex-wrap items-center gap-2 mb-6">
                    <span className="text-sm text-muted-foreground">Active filters:</span>
                    {category !== "all" && (
                      <button
                        onClick={() => setCategory("all")}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-sm"
                      >
                        {categories.find((c) => c.value === category)?.label}
                        <X className="h-3 w-3" />
                      </button>
                    )}
                    {organicOnly && (
                      <button
                        onClick={() => setOrganicOnly(false)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-sm"
                      >
                        Organic Only
                        <X className="h-3 w-3" />
                      </button>
                    )}
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-sm"
                      >
                        Search: {search}
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                )}

                {/* Results count */}
                <p className="text-sm text-muted-foreground mb-6">Showing {sortedProducts.length} products</p>

                {sortedProducts.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedProducts.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No products found matching your criteria.</p>
                    <Button
                      variant="link"
                      onClick={() => {
                        setSearch("")
                        setCategory("all")
                        setOrganicOnly(false)
                      }}
                    >
                      Clear all filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <AIChatWidget />
    </div>
  )
}
