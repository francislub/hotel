import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Crown,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Linkedin,
  Youtube,
  Clock,
  Award,
  Heart,
} from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-muted/50 to-muted">
      {/* Newsletter Section */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="rounded-2xl bg-primary/5 p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold tracking-tight text-primary md:text-3xl">
                Subscribe to Our Newsletter
              </h2>
              <p className="mt-4 text-muted-foreground">
                Stay updated with our latest offers, events, and promotions. Join our mailing list today.
              </p>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <div className="flex gap-2">
                <Input type="email" placeholder="Enter your email" className="bg-background" />
                <Button>
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: About */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Crown className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold tracking-tight">CROWN HOTEL</span>
            </div>
            <p className="text-muted-foreground mb-6">
              Experience luxury and comfort at Crown Hotel. Our commitment to excellence ensures an unforgettable stay
              for all our guests.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/rooms"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Rooms & Suites
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Login / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Our Services</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/services#spa"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Spa & Wellness
                </Link>
              </li>
              <li>
                <Link
                  href="/services#restaurant"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Restaurant & Bar
                </Link>
              </li>
              <li>
                <Link
                  href="/services#pool"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Swimming Pools
                </Link>
              </li>
              <li>
                <Link
                  href="/services#conference"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Conference Rooms
                </Link>
              </li>
              <li>
                <Link
                  href="/services#events"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Events & Weddings
                </Link>
              </li>
              <li>
                <Link
                  href="/services#transport"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center"
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Airport Transfers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted-foreground">
                    123 Luxury Avenue
                    <br />
                    City Center
                    <br />
                    Country, 12345
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted-foreground">
                    +1 (555) 123-4567
                    <br />
                    +1 (555) 765-4321
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted-foreground">
                    info@crownhotel.com
                    <br />
                    reservations@crownhotel.com
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-muted-foreground">
                    Reception: 24/7
                    <br />
                    Restaurant: 6:30 AM - 11:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Awards & Recognitions */}
      <div className="bg-muted/80 py-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold">Awards & Recognitions</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            <div className="flex flex-col items-center">
              <Award className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm text-muted-foreground">Five Star Excellence</span>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm text-muted-foreground">Luxury Hotel Award</span>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm text-muted-foreground">Best Hospitality</span>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm text-muted-foreground">Traveler's Choice</span>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-8 w-8 text-primary mb-2" />
              <span className="text-sm text-muted-foreground">Green Hotel Certification</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-muted py-6">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center space-x-6 md:order-2">
              <Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-sm text-muted-foreground hover:text-primary">
                Sitemap
              </Link>
            </div>
            <div className="mt-8 md:order-1 md:mt-0">
              <p className="text-center text-xs leading-5 text-muted-foreground md:text-left">
                &copy; {new Date().getFullYear()} Crown Hotel. All rights reserved. Made with{" "}
                <Heart className="inline-block h-3 w-3 text-primary" /> by Crown Team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

