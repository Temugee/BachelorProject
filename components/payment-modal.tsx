"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, QrCode, Building2, Copy, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  amount: number
  onPaymentComplete: () => void
}

export function PaymentModal({ isOpen, onClose, orderId, amount, onPaymentComplete }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<"qpay" | "khanbank">("qpay")
  const [isLoading, setIsLoading] = useState(false)
  const [paymentData, setPaymentData] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const initiatePayment = async () => {
    setIsLoading(true)
    try {
      const endpoint = paymentMethod === "qpay" ? "/api/payment/qpay" : "/api/payment/khanbank"
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount,
          description: `Bataa's Honey Order #${orderId}`,
        }),
      })

      if (!res.ok) throw new Error("Payment initiation failed")

      const data = await res.json()
      setPaymentData(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({ title: "Copied!", description: "Account number copied to clipboard." })
  }

  const handlePaymentConfirm = () => {
    toast({
      title: "Payment Submitted",
      description: "Your payment is being verified. You will receive confirmation shortly.",
    })
    onPaymentComplete()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Complete Payment</DialogTitle>
        </DialogHeader>

        {!paymentData ? (
          <div className="space-y-6">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-3xl font-bold text-primary">{amount.toLocaleString()}₮</p>
            </div>

            <RadioGroup value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as any)}>
              <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="qpay" id="qpay" />
                <Label htmlFor="qpay" className="flex items-center gap-3 cursor-pointer flex-1">
                  <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                    <QrCode className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">QPay</p>
                    <p className="text-sm text-muted-foreground">Scan QR with any bank app</p>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="khanbank" id="khanbank" />
                <Label htmlFor="khanbank" className="flex items-center gap-3 cursor-pointer flex-1">
                  <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Khan Bank</p>
                    <p className="text-sm text-muted-foreground">Direct bank transfer</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <Button onClick={initiatePayment} className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Continue to Payment"
              )}
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="qr" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="qr">QR Code</TabsTrigger>
              <TabsTrigger value="transfer">Bank Transfer</TabsTrigger>
            </TabsList>

            <TabsContent value="qr" className="space-y-4">
              <div className="flex justify-center p-4 bg-white rounded-lg">
                <Image
                  src={paymentData.qrImage || paymentData.qrCode}
                  alt="Payment QR Code"
                  width={250}
                  height={250}
                  className="rounded-lg"
                />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Scan with your banking app to complete payment
              </p>
              {paymentData.urls && (
                <div className="grid grid-cols-3 gap-2">
                  {paymentData.urls.map((bank: any) => (
                    <a
                      key={bank.name}
                      href={bank.link}
                      className="p-2 text-center text-xs border rounded-lg hover:bg-muted"
                    >
                      {bank.name}
                    </a>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="transfer" className="space-y-4">
              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Bank Name</p>
                  <p className="font-medium">{paymentData.bankName || "Khan Bank"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Name</p>
                  <p className="font-medium">{paymentData.accountName || "BATAA'S HONEY LLC"}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Account Number</p>
                    <p className="font-medium font-mono">{paymentData.accountNumber || "5012345678"}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(paymentData.accountNumber || "5012345678")}
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-bold text-lg text-primary">{amount.toLocaleString()}₮</p>
                </div>
              </div>
            </TabsContent>

            {paymentData.isDemo && (
              <div className="p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                <strong>Demo Mode:</strong> This is a test payment. In production, real payments will be processed.
              </div>
            )}

            <Button onClick={handlePaymentConfirm} className="w-full">
              I have completed the payment
            </Button>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
