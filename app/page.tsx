import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AIChatWidget } from "@/components/ai-chat-widget";
import {
  ArrowRight,
  Leaf,
  Award,
  Truck,
  Shield,
  Star,
  Sparkles,
} from "lucide-react";

const featuredProducts = [
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
];

const benefits = [
  {
    icon: Leaf,
    title: "Байгалийн цэвэр",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    icon: Award,
    title: "Өндөр Чанар",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    icon: Truck,
    title: "Амар хялбар",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    icon: Shield,
    title: "Аюулгүй байдал",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
];

const testimonials = [
  {
    name: "Болормаа Б.",
    rating: 5,
    comment: "Маш чанартай",
    image: "/mongolian-woman-portrait.jpg",
  },
  {
    name: "Батбаяр Д.",
    rating: 5,
    comment: "",
    image: "/mongolian-man-portrait.jpg",
  },
  {
    name: "Сарангэрэл О.",
    rating: 5,
    comment: "",
    image: "/young-mongolian-woman-portrait.jpg",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/mongolian-grassland-golden-hour-beehives.jpg"
              alt="Mongolian honey farm"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary mb-6">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Чатбот</span>
              </div>

              <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6">
                Bataa's Honey
                {/* <span className="block text-primary">Bataa's Honey</span> */}
              </h1>

              {/* <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                Experience the authentic taste of Mongolia's pristine
                wilderness. Our honey is harvested from the untouched meadows of
                the Mongolian steppe, bringing you nature's sweetest gift.
              </p> */}

              <div className="flex flex-wrap gap-4">
                <Link href="/products">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Дэлгүүр
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/ai-assistant">
                  <Button size="lg" variant="outline">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Чатбот турших
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 mt-12">
                <div>
                  <p className="text-3xl font-bold text-foreground">3K+</p>
                  <p className="text-sm text-muted-foreground">Үйлчлүүлэгчид</p>
                </div>
                <div className="h-12 w-px bg-border" />
                <div>
                  <p className="text-3xl font-bold text-foreground">15+</p>
                  <p className="text-sm text-muted-foreground">Туршилга</p>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="flex items-center gap-1">
                  <Star className="h-6 w-6 fill-primary text-primary" />
                  <p className="text-3xl font-bold text-foreground">3.9</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Биднийг сонгох шалтгаан
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                “Бид хамгийн чанартай бүтээгдэхүүнийг санал болгодог”
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="p-6 bg-card rounded-xl border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Онцлох
                </h2>
                <p className="text-muted-foreground">Эрэлттэй</p>
              </div>
              <Link href="/products">
                <Button variant="outline">
                  Бүгдийг харах
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div
                  key={product._id}
                  className="group relative rounded-xl border border-border bg-card overflow-hidden transition-all hover:shadow-lg"
                >
                  <Link
                    href={`/products/${product._id}`}
                    className="block relative aspect-square overflow-hidden"
                  >
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    {product.salePrice && (
                      <span className="absolute top-2 left-2 px-2 py-1 bg-destructive text-destructive-foreground text-xs font-medium rounded">
                        -
                        {Math.round(
                          ((product.price - product.salePrice) /
                            product.price) *
                            100
                        )}
                        %
                      </span>
                    )}
                    {product.isOrganic && (
                      <span className="absolute top-2 right-2 px-2 py-1 bg-green-600 text-white text-xs font-medium rounded flex items-center gap-1">
                        <Leaf className="h-3 w-3" />
                        Organic
                      </span>
                    )}
                  </Link>

                  <div className="p-4">
                    <Link href={`/products/${product._id}`}>
                      <h3 className="font-serif font-semibold text-foreground hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {product.weight}g
                      </p>
                    </Link>

                    <div className="flex items-center gap-1 mt-2">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="text-sm font-medium">
                        {product.ratings.average}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({product.ratings.count})
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {product.salePrice ? (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-primary">
                            {product.salePrice.toLocaleString()}₮
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {product.price.toLocaleString()}₮
                          </span>
                        </div>
                      ) : (
                        <span className="font-bold text-lg text-primary">
                          {product.price.toLocaleString()}₮
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Feature Highlight */}
        <section className="py-20 bg-foreground text-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary mb-6">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">AI Чатбот</span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                  AI Чатботтой танилцана уу
                </h2>
                <p className="text-background/70 mb-8 leading-relaxed">
                  Манай ухаалаг хиймэл оюун ухааны туслах таны хэрэгцээнд
                  хамгийн тохиромжтой бүтээгдэхүүн болон хэрэгцээтэй мэдээлэлээр
                  хангана. Та хувийн зөвлөгөө, зөгий үржүүлэг, арчилгаа гэх мэл
                  лавлах боломжтой.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Дүн шинэжилгээ",
                    "Хувийн зөвлөмж",
                    "24/7 англи монгол хэлний дэмжлэг",
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <svg
                          className="h-4 w-4 text-primary-foreground"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/ai-assistant">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Чатбот турших
                    <Sparkles className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden bg-card/10 border border-background/20">
                  <Image
                    src="/ai-assistant-chat-interface-honey-theme-golden.jpg"
                    alt="AI Assistant"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Харилцагчдын сэтгэгдэл
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Бидэнтэй нэгдэхийг урьж байна
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="p-6 bg-card rounded-xl border border-border"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="text-foreground mb-4 leading-relaxed">
                    "{testimonial.comment}"
                  </p>
                  <div className="flex items-center gap-3">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <p className="font-medium text-foreground">
                      {testimonial.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Үйлчилгээ авахдаа бэлэн үү?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Бидэнтэй нэгдэж бүтээгдэхүүн үйлчилгээ сургалт мэдээллээ аваарай.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/products">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Дэлгүүр
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline">
                  Бүртгүүлэх
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <AIChatWidget />
    </div>
  );
}
