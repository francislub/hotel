import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Phone } from "lucide-react"

const restaurants = [
  {
    id: 1,
    name: "The Crown Restaurant",
    description: "Fine dining with international cuisine and local specialties.",
    hours: "7:00 AM - 10:30 PM",
    location: "Main Building, Ground Floor",
    phone: "Ext. 1234",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 2,
    name: "Skyline Lounge",
    description: "Rooftop bar with panoramic views, cocktails, and light snacks.",
    hours: "4:00 PM - 12:00 AM",
    location: "Main Building, Rooftop",
    phone: "Ext. 1235",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 3,
    name: "Poolside Café",
    description: "Casual dining with refreshing beverages and snacks by the pool.",
    hours: "10:00 AM - 6:00 PM",
    location: "Pool Area",
    phone: "Ext. 1236",
    image: "/placeholder.svg?height=300&width=500",
  },
]

export default function DiningPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dining Options</h1>
        <p className="text-muted-foreground mt-2">
          Explore our restaurants and bars for a delightful culinary experience.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {restaurants.map((restaurant) => (
          <Card key={restaurant.id} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} fill className="object-cover" />
            </div>
            <CardHeader>
              <CardTitle>{restaurant.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {restaurant.hours}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">{restaurant.description}</p>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {restaurant.location}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3" /> {restaurant.phone}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Make a Reservation</Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>In-Room Dining</CardTitle>
          <CardDescription>Enjoy our restaurant offerings in the comfort of your room.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Our in-room dining service offers a wide selection of dishes from our restaurants. Simply call room service
            to place your order.
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>Available 24 hours</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>Dial 0 for Room Service</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            View Menu
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

