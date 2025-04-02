import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Star } from "lucide-react"
import BookingForm from "@/components/booking-form"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        <Image
          src="/images/offer_1.jpg"
          alt="Crown Hotel Luxury Room"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
            Experience Luxury & Comfort
          </h1>
          <p className="mt-6 max-w-lg text-xl text-white">
            Welcome to Crown Hotel, where exceptional service meets luxurious accommodations.
          </p>
          <div className="mt-10 flex gap-x-6">
            <Link href="/rooms">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Explore Rooms
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-red-600 border-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="rounded-xl bg-background shadow-lg">
          <BookingForm />
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Discover Crown Hotel</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Nestled in the vibrant heart of the city, our hotel stands as a beacon of luxury and hospitality,
                offering an unrivaled experience for discerning travelers. Boasting exquisite accommodations,
                world-class amenities, and impeccable service, we redefine the standard for luxury.
              </p>
              <p className="mt-4 text-lg text-muted-foreground">
                Each guest is treated to a personalized experience, from the moment they arrive until the time of
                departure. Whether you're here for business or leisure, our hotel provides a sanctuary of comfort and
                elegance, making it the premier choice for travelers seeking the best.
              </p>
              <div className="mt-8">
                <Link href="/about">
                  <Button>Learn More About Us</Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/discover_3.jpg"
                alt="Crown Hotel Exterior"
                width={600}
                height={400}
                className="rounded-xl object-cover shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="bg-muted py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Accommodations</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our selection of luxurious rooms and suites designed for your comfort
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Room 1 */}
            <Card className="overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/images/discover_3.jpg"
                  alt="Luxury Single Room"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">Luxury Single Room</h3>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  <div className="text-xl font-bold text-primary">
                    $89<span className="text-sm font-normal text-muted-foreground">/night</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">Breakfast Included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">Free Wi-Fi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">Access to Gym</span>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/rooms/luxury-single">
                    <Button className="w-full">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Room 2 */}
            <Card className="overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/images/discover_3.jpg"
                  alt="Luxury Double Suite"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">Luxury Double Suite</h3>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  <div className="text-xl font-bold text-primary">
                    $129<span className="text-sm font-normal text-muted-foreground">/night</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">Breakfast Included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">Free Wi-Fi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">Access to Executive Lounge</span>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/rooms/luxury-double-suite">
                    <Button className="w-full">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Room 3 */}
            <Card className="overflow-hidden">
              <div className="relative h-64">
                <Image
                  src="/images/discover_3.jpg"
                  alt="Wing A Luxury Room"
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">Wing A Luxury Room</h3>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </div>
                  <div className="text-xl font-bold text-primary">
                    $125<span className="text-sm font-normal text-muted-foreground">/night</span>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">For Groups (up to 5)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">Free Wi-Fi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span className="text-sm">Premium Amenities</span>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/rooms/wing-a-luxury">
                    <Button className="w-full">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-12 text-center">
            <Link href="/rooms">
              <Button size="lg">View All Rooms</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What We Offer</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Indulge in our premium services and amenities designed for your comfort and enjoyment
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Service 1 */}
            <div className="text-center">
              <div className="relative h-64 mb-6 overflow-hidden rounded-lg">
                <Image
                  src="/images/discover_3.jpg"
                  alt="Outdoor Pool"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Outdoor Pool</h3>
              <p className="mt-2 text-muted-foreground">
                Experience the ultimate in relaxation at our outdoor pool, where you can soak up the sun and take in
                stunning views of the surrounding landscape.
              </p>
            </div>

            {/* Service 2 */}
            <div className="text-center">
              <div className="relative h-64 mb-6 overflow-hidden rounded-lg">
                <Image
                  src="/images/discover_3.jpg"
                  alt="Indoor Pool"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Indoor Pool</h3>
              <p className="mt-2 text-muted-foreground">
                Take a dip in our indoor pool and escape the hustle and bustle of the city. Whether you're looking to
                relax after a long day or simply want to unwind.
              </p>
            </div>

            {/* Service 3 */}
            <div className="text-center">
              <div className="relative h-64 mb-6 overflow-hidden rounded-lg">
                <Image
                  src="/images/discover_3.jpg"
                  alt="Spa Zone"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Spa Zone</h3>
              <p className="mt-2 text-muted-foreground">
                Our spa offers a range of luxurious treatments designed to pamper and relax you. From soothing massages
                to revitalizing facials, our expert therapists will ensure you leave feeling refreshed.
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link href="/services">
              <Button size="lg">Explore All Services</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What Our Guests Say</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Read testimonials from our satisfied guests
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <Card className="bg-background">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="italic text-muted-foreground mb-6">
                  "The Crown Hotel exceeded all my expectations. The room was immaculate, the staff was attentive, and
                  the amenities were top-notch. I'll definitely be returning for my next business trip."
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">JD</span>
                  </div>
                  <div>
                    <p className="font-semibold">John Doe</p>
                    <p className="text-sm text-muted-foreground">Business Traveler</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="bg-background">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="italic text-muted-foreground mb-6">
                  "We celebrated our anniversary at Crown Hotel and it was magical. The staff arranged a special dinner
                  for us and the suite was beautifully decorated. A perfect romantic getaway!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">JS</span>
                  </div>
                  <div>
                    <p className="font-semibold">Jane Smith</p>
                    <p className="text-sm text-muted-foreground">Couple</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="bg-background">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="italic text-muted-foreground mb-6">
                  "Our family vacation was perfect thanks to Crown Hotel. The kids loved the pool, and we enjoyed the
                  spa. The rooms were spacious and comfortable. We'll definitely be back next summer!"
                </p>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">RJ</span>
                  </div>
                  <div>
                    <p className="font-semibold">Robert Johnson</p>
                    <p className="text-sm text-muted-foreground">Family Traveler</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 bg-primary/10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Experience Luxury?</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Book your stay today and enjoy our special offers
            </p>
            <div className="mt-8 flex justify-center gap-x-6">
              <Link href="/rooms">
                <Button size="lg">Book Now</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

