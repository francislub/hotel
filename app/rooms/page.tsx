import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"

const rooms = [
  {
    id: "luxury-single",
    name: "Luxury Single Room",
    description:
      "Our rooms have everything, that's for sure. Exquisitely furnished in an elegant, cosmopolitan, modern style, superior and deluxe guest rooms.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/5.PNG-iW2Fe3pqhjNVb3mj0q296sVczqQXDD.png",
    price: 89,
    features: ["Breakfast Included", "Free Wi-Fi", "Access to Gym"],
    capacity: 1,
    remaining: 5,
  },
  {
    id: "luxury-double-suite",
    name: "Luxury Double Suite",
    description:
      "Immerse yourself in a world where elegance meets comfort, and every detail is designed to exceed your expectations. Our Double Suite luxury is unparalleled.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4.PNG-RIBwd59ACpqlHZMJZpGsZBEAIjlKGt.png",
    price: 129,
    features: ["Breakfast Included", "Free Wi-Fi", "Access to Executive Lounge"],
    capacity: 2,
    remaining: 3,
  },
  {
    id: "wing-a-luxury",
    name: "Wing A Luxury Room",
    description:
      "Without TV | for groups - minimum of 5 pax | Premium amenities and exceptional comfort for your group stay.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/r1.PNG-630ZQVMvKNzrzAaDvbN6ZMnxU24uCh.png",
    price: 125,
    features: ["For Groups (up to 5)", "Free Wi-Fi", "Premium Amenities"],
    capacity: 5,
    remaining: 1,
  },
  {
    id: "wing-a-standard",
    name: "Wing A Standard Room",
    description: "Without TV | Comfortable accommodations with all the essential amenities for a pleasant stay.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/r2.PNG-diOnHbbtJ384I445SO3OMLhctqYcCE.png",
    price: 75,
    features: ["Free Wi-Fi", "Daily Housekeeping", "Air Conditioning"],
    capacity: 2,
    remaining: 8,
  },
  {
    id: "wing-a-travelers",
    name: "Wing A Travelers Time",
    description: "Without TV | Perfect for the busy traveler who needs a comfortable place to rest between adventures.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/r2.PNG-diOnHbbtJ384I445SO3OMLhctqYcCE.png",
    price: 65,
    features: ["Free Wi-Fi", "Work Desk", "Express Check-out"],
    capacity: 1,
    remaining: 10,
  },
  {
    id: "wing-b-standard",
    name: "Wing B Standard Room",
    description:
      "With TV | Our Wing B rooms offer additional amenities including a flat-screen TV for your entertainment.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/r2.PNG-diOnHbbtJ384I445SO3OMLhctqYcCE.png",
    price: 85,
    features: ["TV Included", "Free Wi-Fi", "Mini Refrigerator"],
    capacity: 2,
    remaining: 6,
  },
]

export default function RoomsPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Our Rooms & Suites</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our selection of luxurious accommodations designed for your comfort and relaxation
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Card key={room.id} className="overflow-hidden">
              <div className="relative h-64">
                <Image src={room.image || "/placeholder.svg"} alt={room.name} fill className="object-cover" />
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{room.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {room.capacity === 1
                        ? "1 Person"
                        : room.capacity === 5
                          ? "Up to 5 People"
                          : `${room.capacity} People`}
                    </p>
                  </div>
                  <div className="text-xl font-bold text-primary">
                    ${room.price}
                    <span className="text-sm font-normal text-muted-foreground">/night</span>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground line-clamp-3">{room.description}</p>
                <div className="mt-4 space-y-2">
                  {room.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {room.remaining} {room.remaining === 1 ? "room" : "rooms"} left
                  </span>
                  <Link href={`/rooms/${room.id}`}>
                    <Button>View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

