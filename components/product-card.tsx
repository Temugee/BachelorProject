"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Star, Leaf } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  _id: string
  name: string
  nameEn: string
  price: number
  salePrice?: number
  images: string[]
  category: string
  stock: number
  weight: number
  isOrganic: boolean
  ratings: {
    average: number
    count: number
  }
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    addItem({
      id: product._id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.images[0] || "/golden-honey-jar.png",
      weight: product.weight,
    })
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const discount = product.salePrice ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0

  return (
    <div className="group relative rounded-xl border border-border bg-card overflow-hidden transition-all hover:shadow-lg">
      {/* Image */}
      <Link href={`/products/${product._id}`} className="block relative aspect-square overflow-hidden">
        <Image
          src={product.images[0] || "/placeholder.svg?height=300&width=300&query=honey jar golden"}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        {discount > 0 && <Badge className="absolute top-2 left-2 bg-destructive">-{discount}%</Badge>}
        {product.isOrganic && (
          <Badge className="absolute top-2 right-2 bg-green-600">
            <Leaf className="h-3 w-3 mr-1" />
            Organic
          </Badge>
        )}
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-serif font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground">{product.weight}g</p>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="text-sm font-medium">{product.ratings.average.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">({product.ratings.count})</span>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-3">
          <div>
            {product.salePrice ? (
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-primary">{product.salePrice.toLocaleString()}₮</span>
                <span className="text-sm text-muted-foreground line-through">{product.price.toLocaleString()}₮</span>
              </div>
            ) : (
              <span className="font-bold text-lg text-primary">{product.price.toLocaleString()}₮</span>
            )}
          </div>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="bg-primary hover:bg-primary/90"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
