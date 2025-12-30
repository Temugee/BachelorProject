"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useCart } from "@/contexts/cart-context"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PaymentModal } from "@/components/payment-modal"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [isCheckout, setIsCheckout] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || "",
    phone: "",
    street: "",
    city: "Ulaanbaatar",
    district: "",
    zipCode: "",
  })
  const [notes, setNotes] = useState("")

  const shippingCost = totalPrice > 100000 ? 0 : 5000
  const finalTotal = totalPrice + shippingCost

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to login to place an order.",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (!shippingAddress.phone || !shippingAddress.street || !shippingAddress.district) {
      toast({
        title: "Missing information",
        description: "Please fill in all required shipping details.",
        variant: "destructive",
      })
      return
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          subtotal: totalPrice,
          shippingCost,
          total: finalTotal,
          shippingAddress,
          notes,
          paymentMethod: "qpay",
        }),
      })

      if (!res.ok) throw new Error("Order creation failed")

      const data = await res.json()
      setOrderId(data.order._id)
      setIsPaymentOpen(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handlePaymentComplete = () => {
    clearCart()
    setIsPaymentOpen(false)
    toast({
      title: "Order Placed!",
      description: "Your order has been placed successfully. Check your email for confirmation.",
    })
    router.push("/orders")
  }

  if (items.length === 0 && !isCheckout) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Looks like you {"haven't"} added any honey to your cart yet.</p>
            <Link href="/products">
              <Button>
                Browse Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-8">
            {isCheckout ? "Checkout" : "Shopping Cart"}
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items / Shipping Form */}
            <div className="lg:col-span-2">
              {!isCheckout ? (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-card border border-border rounded-xl">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.weight}g</p>
                        <p className="font-bold text-primary mt-1">{item.price.toLocaleString()}₮</p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h2 className="font-serif text-xl font-semibold mb-6">Shipping Information</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={shippingAddress.name}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="99112233"
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="street">Street Address *</Label>
                      <Input
                        id="street"
                        placeholder="Building, apartment, street"
                        value={shippingAddress.street}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">District *</Label>
                      <Input
                        id="district"
                        placeholder="e.g., Sukhbaatar"
                        value={shippingAddress.district}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, district: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input
                        id="zipCode"
                        placeholder="14200"
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="notes">Order Notes (Optional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Special instructions for delivery..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                <h2 className="font-serif text-xl font-semibold mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} x {item.quantity}
                      </span>
                      <span>{(item.price * item.quantity).toLocaleString()}₮</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{totalPrice.toLocaleString()}₮</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      Shipping
                    </span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `${shippingCost.toLocaleString()}₮`
                      )}
                    </span>
                  </div>
                  {totalPrice < 100000 && (
                    <p className="text-xs text-muted-foreground">
                      Add {(100000 - totalPrice).toLocaleString()}₮ more for free shipping!
                    </p>
                  )}
                </div>

                <div className="border-t border-border mt-4 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">{finalTotal.toLocaleString()}₮</span>
                  </div>
                </div>

                {!isCheckout ? (
                  <Button className="w-full mt-6" onClick={() => setIsCheckout(true)}>
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <div className="space-y-3 mt-6">
                    <Button className="w-full" onClick={handleCheckout}>
                      Place Order
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsCheckout(false)}>
                      Back to Cart
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        orderId={orderId}
        amount={finalTotal}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  )
}
