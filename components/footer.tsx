import Link from "next/link"
import { Crown, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-muted">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link href="#" className="text-muted-foreground hover:text-primary">
            <span className="sr-only">Facebook</span>
            <Facebook className="h-6 w-6" />
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary">
            <span className="sr-only">Instagram</span>
            <Instagram className="h-6 w-6" />
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary">
            <span className="sr-only">Twitter</span>
            <Twitter className="h-6 w-6" />
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
            <Crown className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tight">CROWN HOTEL</span>
          </div>
          <div className="flex flex-col space-y-2 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>123 Luxury Avenue, City Center</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>info@crownhotel.com</span>
            </div>
          </div>
          <p className="text-center text-xs leading-5 text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Crown Hotel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

