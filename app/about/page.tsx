import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">About Crown Hotel</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our story, our values, and our commitment to exceptional hospitality
          </p>
        </div>

        {/* Our Story */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-center mb-16">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-6">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              Founded in 2010, Crown Hotel began with a vision to create a sanctuary of luxury and comfort for travelers
              from around the world. What started as a boutique hotel with just 20 rooms has now grown into a renowned
              establishment with over 200 rooms and suites.
            </p>
            <p className="text-muted-foreground mb-4">
              Our journey has been defined by a relentless pursuit of excellence and an unwavering commitment to guest
              satisfaction. Over the years, we have continuously evolved, incorporating the latest innovations in
              hospitality while preserving the timeless elegance that has become our signature.
            </p>
            <p className="text-muted-foreground">
              Today, Crown Hotel stands as a testament to our dedication to providing exceptional experiences. We take
              pride in our rich history and look forward to writing the next chapter of our story with you.
            </p>
          </div>
          <div className="relative h-[400px] rounded-xl overflow-hidden">
            <Image
              src="/images/offer_2.jpg"
              alt="Crown Hotel Exterior"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-6 text-center">Our Values</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Excellence</h3>
                  <p className="text-muted-foreground">
                    We strive for excellence in everything we do, from the quality of our accommodations to the service
                    we provide.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Integrity</h3>
                  <p className="text-muted-foreground">
                    We conduct our business with honesty, transparency, and ethical standards that earn the trust of our
                    guests.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Innovation</h3>
                  <p className="text-muted-foreground">
                    We embrace innovation and continuously seek new ways to enhance the guest experience and improve our
                    services.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Sustainability</h3>
                  <p className="text-muted-foreground">
                    We are committed to sustainable practices that minimize our environmental impact and contribute to a
                    better world.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Our Team */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-6 text-center">Our Leadership Team</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden mb-4">
                <Image src="/images/author_1.jpg?height=256&width=256" alt="CEO" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold">John Smith</h3>
              <p className="text-primary">Chief Executive Officer</p>
              <p className="mt-2 text-muted-foreground">
                With over 20 years of experience in luxury hospitality, John leads our team with vision and passion.
              </p>
            </div>
            <div className="text-center">
              <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden mb-4">
                <Image src="/images/jerran.png?height=256&width=256" alt="COO" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold">Sarah Johnson</h3>
              <p className="text-primary">Chief Operations Officer</p>
              <p className="mt-2 text-muted-foreground">
                Sarah ensures that every aspect of our operations meets the highest standards of quality and efficiency.
              </p>
            </div>
            <div className="text-center">
              <div className="relative h-64 w-64 mx-auto rounded-full overflow-hidden mb-4">
                <Image src="/images/mickie.png?height=256&width=256" alt="Executive Chef" fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold">Michael Chen</h3>
              <p className="text-primary">Executive Chef</p>
              <p className="mt-2 text-muted-foreground">
                Michael brings culinary excellence to our hotel with his innovative approach to fine dining.
              </p>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl mb-6 text-center">Our Achievements</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">5</div>
                <h3 className="text-xl font-bold mb-2">Star Rating</h3>
                <p className="text-muted-foreground">
                  Consistently rated as a 5-star luxury hotel by international rating agencies.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">15+</div>
                <h3 className="text-xl font-bold mb-2">Awards</h3>
                <p className="text-muted-foreground">
                  Recognized with over 15 prestigious awards for excellence in hospitality.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">95%</div>
                <h3 className="text-xl font-bold mb-2">Guest Satisfaction</h3>
                <p className="text-muted-foreground">
                  Maintaining an exceptional 95% guest satisfaction rate year after year.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-primary mb-2">50+</div>
                <h3 className="text-xl font-bold mb-2">Countries</h3>
                <p className="text-muted-foreground">Welcoming guests from over 50 countries around the world.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

