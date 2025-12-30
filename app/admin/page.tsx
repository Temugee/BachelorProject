"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  LayoutDashboard,
  Package,
  FileText,
  ShoppingCart,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign,
  Eye,
  Loader2,
  LogOut,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for demo
const mockOrders = [
  {
    _id: "1",
    orderNumber: "BH2401ABC",
    total: 145000,
    status: "pending",
    paymentStatus: "pending",
    createdAt: new Date(),
  },
  {
    _id: "2",
    orderNumber: "BH2401DEF",
    total: 95000,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: new Date(),
  },
  {
    _id: "3",
    orderNumber: "BH2401GHI",
    total: 210000,
    status: "shipped",
    paymentStatus: "paid",
    createdAt: new Date(),
  },
]

const mockProducts = [
  { _id: "1", name: "Wildflower Honey", price: 45000, stock: 50, category: "raw", isActive: true },
  { _id: "2", name: "Buckwheat Honey", price: 55000, stock: 30, category: "raw", isActive: true },
  { _id: "3", name: "Sea Buckthorn Honey", price: 65000, stock: 25, category: "flavored", isActive: true },
]

const mockContents = [
  {
    _id: "1",
    title: "Health Benefits of Raw Honey",
    category: "blog",
    accessType: "free",
    views: 1250,
    isPublished: true,
  },
  {
    _id: "2",
    title: "Premium Recipe: Honey Glazed Salmon",
    category: "recipe",
    accessType: "premium",
    views: 450,
    isPublished: true,
  },
  {
    _id: "3",
    title: "Mongolian Beekeeping Traditions",
    category: "education",
    accessType: "free",
    views: 890,
    isPublished: false,
  },
]

export default function AdminDashboard() {
  const { user, logout, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("dashboard")
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    nameEn: "",
    description: "",
    descriptionEn: "",
    price: "",
    category: "raw",
    stock: "",
    weight: "",
    isOrganic: true,
    isFeatured: false,
  })

  // Content form state
  const [contentForm, setContentForm] = useState({
    title: "",
    titleEn: "",
    content: "",
    contentEn: "",
    excerpt: "",
    excerptEn: "",
    category: "blog",
    accessType: "free",
    isPublished: false,
  })

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [user, authLoading, router, toast])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return null
  }

  const handleCreateProduct = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...productForm,
          price: Number.parseInt(productForm.price),
          stock: Number.parseInt(productForm.stock),
          weight: Number.parseInt(productForm.weight),
          images: ["/golden-honey-jar.png"],
          tags: [],
          benefits: [],
        }),
      })

      if (res.ok) {
        toast({ title: "Success", description: "Product created successfully!" })
        setIsProductDialogOpen(false)
        setProductForm({
          name: "",
          nameEn: "",
          description: "",
          descriptionEn: "",
          price: "",
          category: "raw",
          stock: "",
          weight: "",
          isOrganic: true,
          isFeatured: false,
        })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create product.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateContent = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...contentForm,
          coverImage: "/honey-blog-cover.jpg",
          tags: [],
        }),
      })

      if (res.ok) {
        toast({ title: "Success", description: "Content created successfully!" })
        setIsContentDialogOpen(false)
        setContentForm({
          title: "",
          titleEn: "",
          content: "",
          contentEn: "",
          excerpt: "",
          excerptEn: "",
          category: "blog",
          accessType: "free",
          isPublished: false,
        })
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create content.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xl">🍯</span>
            </div>
            <div>
              <h1 className="font-serif font-bold text-foreground">{"Bataa's Honey"}</h1>
              <p className="text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="dashboard">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="products">
              <Package className="h-4 w-4 mr-2" />
              Products
            </TabsTrigger>
            <TabsTrigger value="content">
              <FileText className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold text-foreground">4,250,000₮</p>
                      <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3" />
                        +12% from last month
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="text-2xl font-bold text-foreground">127</p>
                      <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3" />
                        +8% from last month
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Products</p>
                      <p className="text-2xl font-bold text-foreground">24</p>
                      <p className="text-xs text-muted-foreground mt-1">8 featured</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                      <Package className="h-6 w-6 text-orange-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Content Views</p>
                      <p className="text-2xl font-bold text-foreground">12,450</p>
                      <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3" />
                        +25% from last month
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <Eye className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.total.toLocaleString()}₮</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === "delivered"
                                ? "default"
                                : order.status === "shipped"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={order.paymentStatus === "paid" ? "default" : "destructive"}>
                            {order.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl font-bold">Products</h2>
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Name (Mongolian)</Label>
                        <Input
                          value={productForm.name}
                          onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Name (English)</Label>
                        <Input
                          value={productForm.nameEn}
                          onChange={(e) => setProductForm({ ...productForm, nameEn: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description (Mongolian)</Label>
                      <Textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description (English)</Label>
                      <Textarea
                        value={productForm.descriptionEn}
                        onChange={(e) => setProductForm({ ...productForm, descriptionEn: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Price (₮)</Label>
                        <Input
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Stock</Label>
                        <Input
                          type="number"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Weight (g)</Label>
                        <Input
                          type="number"
                          value={productForm.weight}
                          onChange={(e) => setProductForm({ ...productForm, weight: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                          value={productForm.category}
                          onValueChange={(v) => setProductForm({ ...productForm, category: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="raw">Raw Honey</SelectItem>
                            <SelectItem value="flavored">Flavored Honey</SelectItem>
                            <SelectItem value="gift-set">Gift Set</SelectItem>
                            <SelectItem value="bee-products">Bee Products</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-6 pt-8">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={productForm.isOrganic}
                            onCheckedChange={(v) => setProductForm({ ...productForm, isOrganic: v })}
                          />
                          <Label>Organic</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={productForm.isFeatured}
                            onCheckedChange={(v) => setProductForm({ ...productForm, isFeatured: v })}
                          />
                          <Label>Featured</Label>
                        </div>
                      </div>
                    </div>
                    <Button onClick={handleCreateProduct} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Product"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockProducts.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="capitalize">{product.category}</TableCell>
                        <TableCell>{product.price.toLocaleString()}₮</TableCell>
                        <TableCell>{product.stock}</TableCell>
                        <TableCell>
                          <Badge variant={product.isActive ? "default" : "secondary"}>
                            {product.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl font-bold">Content Management</h2>
              <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Content
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Content</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title (Mongolian)</Label>
                        <Input
                          value={contentForm.title}
                          onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Title (English)</Label>
                        <Input
                          value={contentForm.titleEn}
                          onChange={(e) => setContentForm({ ...contentForm, titleEn: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Excerpt (Mongolian)</Label>
                      <Textarea
                        value={contentForm.excerpt}
                        onChange={(e) => setContentForm({ ...contentForm, excerpt: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Content (Mongolian)</Label>
                      <Textarea
                        value={contentForm.content}
                        onChange={(e) => setContentForm({ ...contentForm, content: e.target.value })}
                        rows={6}
                      />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Select
                          value={contentForm.category}
                          onValueChange={(v) => setContentForm({ ...contentForm, category: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blog">Blog Post</SelectItem>
                            <SelectItem value="recipe">Recipe</SelectItem>
                            <SelectItem value="education">Education</SelectItem>
                            <SelectItem value="news">News</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Access Type</Label>
                        <Select
                          value={contentForm.accessType}
                          onValueChange={(v) => setContentForm({ ...contentForm, accessType: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="premium">Premium Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2 pt-8">
                        <Switch
                          checked={contentForm.isPublished}
                          onCheckedChange={(v) => setContentForm({ ...contentForm, isPublished: v })}
                        />
                        <Label>Publish Now</Label>
                      </div>
                    </div>
                    <Button onClick={handleCreateContent} disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Content"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Access</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockContents.map((content) => (
                      <TableRow key={content._id}>
                        <TableCell className="font-medium">{content.title}</TableCell>
                        <TableCell className="capitalize">{content.category}</TableCell>
                        <TableCell>
                          <Badge variant={content.accessType === "premium" ? "default" : "outline"}>
                            {content.accessType}
                          </Badge>
                        </TableCell>
                        <TableCell>{content.views.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={content.isPublished ? "default" : "secondary"}>
                            {content.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl font-bold">Orders</h2>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockOrders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell className="font-medium">{order.orderNumber}</TableCell>
                        <TableCell>{order.total.toLocaleString()}₮</TableCell>
                        <TableCell>
                          <Select defaultValue={order.status}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Badge variant={order.paymentStatus === "paid" ? "default" : "destructive"}>
                            {order.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
