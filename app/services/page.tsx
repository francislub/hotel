import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const services = [
  {
    id: "outdoor-pool",
    name: "Outdoor Pool",
    description:
      "Experience the ultimate in relaxation at our outdoor pool, where you can soak up the sun and take in stunning views of the surrounding landscape. Our outdoor pool is the perfect spot to unwind and enjoy the beautiful weather.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a2.PNG-bygezpnxOdOjhNCCXYP90zVubGE8It.png",
  },
  {
    id: "indoor-pool",
    name: "Indoor Pool",
    description:
      "Take a dip in our indoor pool and escape the hustle and bustle of the city. Whether you're looking to relax after a long day of meetings or simply want to unwind, our indoor pool provides the perfect retreat.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a2.PNG-bygezpnxOdOjhNCCXYP90zVubGE8It.png",
  },
  {
    id: "spa-zone",
    name: "Spa Zone",
    description:
      "Our spa offers a range of luxurious treatments designed to pamper and relax you. From soothing massages to revitalizing facials, our expert therapists will ensure you leave feeling refreshed and rejuvenated.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a2.PNG-bygezpnxOdOjhNCCXYP90zVubGE8It.png",
  },
  {
    id: "sports-area",
    name: "Sports Area",
    description:
      "Stay active and energized during your stay with us at our sport area. Whether you prefer cardio workouts or strength training, our sport area has everything you need to stay in shape.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a3.PNG-ilwFVdlj0nH4mGd8SQF2xVjs1EQZFc.png",
  },
  {
    id: "restaurant",
    name: "Restaurant",
    description:
      "Indulge your taste buds at our restaurant, where culinary excellence meets impeccable service. Our expert chefs craft delectable dishes using only the finest ingredients, ensuring a dining experience that is both unforgettable and satisfying.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a3.PNG-ilwFVdlj0nH4mGd8SQF2xVjs1EQZFc.png",
  },
  {
    id: "skybar",
    name: "Skybar",
    description:
      "Experience breathtaking views and exceptional service at our skybar. Located on the top floor of the hotel, our skybar offers panoramic views of the city skyline, creating the perfect backdrop for a memorable evening.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a3.PNG-ilwFVdlj0nH4mGd8SQF2xVjs1EQZFc.png",
  },
  {
    id: "conference-rooms",
    name: "Conference Rooms",
    description:
      "Our state-of-the-art conference rooms are perfect for business meetings, seminars, and corporate events. Equipped with the latest technology and supported by our professional staff, your event is guaranteed to be a success.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6.PNG-yZ7zVkqLzXfNjIOEYBcFZW6C0FwaQw.png",
  },
  {
    id: "wedding-venue",
    name: "Wedding Venue",
    description:
      "Make your special day unforgettable at our elegant wedding venue. With breathtaking settings, exquisite catering, and attentive service, we ensure that your wedding day is as perfect as you've always dreamed.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6.PNG-yZ7zVkqLzXfNjIOEYBcFZW6C0FwaQw.png",
  },
  {
    id: "airport-shuttle",
    name: "Airport Shuttle",
    description:
      "Travel with ease with our convenient airport shuttle service. Our professional drivers will ensure you reach your destination safely and on time, making your journey as comfortable as possible.",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1.PNG-syKTtGxXGeRqnFHTlf9n6mGG0Ldb7F.png",
  },
]

export default function ServicesPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Our Services</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the exceptional services and amenities we offer to make your stay unforgettable
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <div className="relative h-64">
                <Image src={service.image || "/placeholder.svg"} alt={service.name} fill className="object-cover" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">{service.name}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

