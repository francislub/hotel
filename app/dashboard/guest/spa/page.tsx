import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Calendar } from "lucide-react"

const spaServices = [
  {
    id: 1,
    name: "Swedish Massage",
    description: "A gentle full body massage designed to improve circulation and relieve tension.",
    duration: "60 min",
    price: 120,
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 2,
    name: "Deep Tissue Massage",
    description: "Targets the deeper layers of muscle and connective tissue to release chronic patterns of tension.",
    duration: "60 min",
    price: 140,
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 3,
    name: "Hot Stone Massage",
    description: "Smooth, heated stones are placed on specific points on the body to help loosen tight muscles.",
    duration: "75 min",
    price: 160,
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 4,
    name: "Aromatherapy Massage",
    description: "Essential oils are added to a gentle massage to promote relaxation and well-being.",
    duration: "60 min",
    price: 130,
    image: "/placeholder.svg?height=300&width=500",
  },
]

const wellnessActivities = [
  {
    id: 1,
    name: "Yoga Class",
    description: "Guided yoga sessions for all levels to improve flexibility, strength, and mental clarity.",
    schedule: "Daily, 7:00 AM - 8:00 AM",
    location: "Wellness Center",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 2,
    name: "Meditation Session",
    description: "Guided meditation to reduce stress and promote mindfulness.",
    schedule: "Mon, Wed, Fri, 6:00 PM - 6:45 PM",
    location: "Garden Pavilion",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: 3,
    name: "Fitness Center",
    description: "State-of-the-art equipment for cardio and strength training.",
    schedule: "Open 24 hours",
    location: "Lower Level",
    image: "/placeholder.svg?height=300&width=500",
  },
]

export default function SpaWellnessPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Spa & Wellness</h1>
        <p className="text-muted-foreground mt-2">
          Rejuvenate your body and mind with our spa treatments and wellness activities.
        </p>
      </div>

      <Tabs defaultValue="spa" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="spa">Spa Services</TabsTrigger>
          <TabsTrigger value="wellness">Wellness Activities</TabsTrigger>
        </TabsList>

        <TabsContent value="spa" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {spaServices.map((service) => (
              <Card key={service.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image src={service.image || "/placeholder.svg"} alt={service.name} fill className="object-cover" />
                </div>
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {service.duration} | ssp{service.price}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{service.description}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Book Appointment</Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Spa Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Hours of Operation</h3>
                <p className="text-sm text-muted-foreground">Daily: 9:00 AM - 8:00 PM</p>
              </div>
              <div>
                <h3 className="font-medium">Reservations</h3>
                <p className="text-sm text-muted-foreground">
                  We recommend booking spa services at least 24 hours in advance. Please call extension 1500 from your
                  room or visit the spa reception.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Cancellation Policy</h3>
                <p className="text-sm text-muted-foreground">
                  Cancellations must be made at least 4 hours prior to your scheduled appointment to avoid a 50% charge.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wellness" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {wellnessActivities.map((activity) => (
              <Card key={activity.id} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image src={activity.image || "/placeholder.svg"} alt={activity.name} fill className="object-cover" />
                </div>
                <CardHeader>
                  <CardTitle>{activity.name}</CardTitle>
                  <CardDescription>{activity.location}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm">{activity.description}</p>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {activity.schedule}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Join Activity</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

