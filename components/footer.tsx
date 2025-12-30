import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <span className="text-xl">🍯</span>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold">
                  {"Bataa's Honey"}
                </h3>
                {/* <p className="text-xs text-background/60">Pure Mongolian Honey</p> */}
              </div>
            </div>
            {/* <p className="text-sm text-background/70 leading-relaxed">
              Premium organic honey sourced directly from the pristine meadows of Mongolia. Experience the authentic
              taste of nature.
            </p> */}
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">
              Холбоосууд
            </h4>
            <ul className="space-y-2">
              {[
                "Бүтээгдэхүүнүүд",
                "Бидний тухай",
                "Блог",
                "Жорууд",
                "Холбоо барих",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(" ", "-")}`}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2">
              {[
                "Түгээмэл асуултууд",
                "Хүргэлтийн бодлогын",
                "Буцаалтын бодлогын",
                "Нууцлалын бодлогын",
                "Үйлчилгээний нөхцөлийн",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">
              Бидэнтэй холбогдох
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-background/70">
                <MapPin className="h-4 w-4 text-primary" />
                Ulaanbaatar, Mongolia
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Phone className="h-4 w-4 text-primary" />
                +976 9911 2233
              </li>
              <li className="flex items-center gap-2 text-sm text-background/70">
                <Mail className="h-4 w-4 text-primary" />
                info@bataashoney.mn
              </li>
            </ul>
            <div className="flex gap-4 mt-4">
              <a
                href="#"
                className="text-background/70 hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-background/70 hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-background/70 hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-8 text-center">
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} {"Bataa's Honey"}. Бүх эрх хуулиар
            хамгаалагдсан.
          </p>
        </div>
      </div>
    </footer>
  );
}
