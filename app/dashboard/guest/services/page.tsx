import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getServices } from "@/lib/actions/service-actions"
import { Utensils, Wifi, Car, Coffee, Phone } from "lucide-react"

export default async function GuestServicesPage() {
  const { success, data: services } = await getServices()

  const serviceIcons: Record<string, any> = {
    "Room Service": Utensils,
    WiFi: Wifi,
    "Airport Transfer": Car,
    Breakfast: Coffee,
    Concierge: Phone,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hotel Services</h1>
        <p className="text-muted-foreground mt-2">Explore our range of premium services to enhance your stay.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {success && services ? (
          services.map((service) => {
            const IconComponent = serviceIcons[service.name] || Coffee

            return (
              <Card key={service.id} className="overflow-hidden">
                <div className="h-48 bg-muted flex items-center justify-center">
                  <IconComponent className="h-24 w-24 text-muted-foreground/50" />
                </div>
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>{service.price ? `$${service.price.toFixed(2)}` : "Free"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{service.description}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Request Service</Button>
                </CardFooter>
              </Card>
            )
          })
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No services available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}

