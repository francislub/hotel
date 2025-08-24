import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Hotel, Utensils, Car, SpadeIcon as Spa, Eye } from "lucide-react"
import { getUserBookings } from "@/lib/actions/booking-actions"
import { getServices } from "@/lib/actions/service-actions"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { format } from "date-fns"

export default async function GuestDashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Fetch user's bookings
  const bookingsResult = await getUserBookings(session.user.id)
  const bookings = bookingsResult.success ? bookingsResult.data : []

  // Fetch available services
  const servicesResult = await getServices()
  const services = servicesResult.success ? servicesResult.data : []

  // Filter upcoming bookings
  const upcomingBookings = bookings.filter((booking) => booking.status === "PENDING" || booking.status === "CONFIRMED")

  // Map services to the expected format
  const mappedServices = services.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description,
    icon: getServiceIcon(service.category),
  }))

  // Helper function to get icon based on service category
  function getServiceIcon(category: string) {
    switch (category) {
      case "ROOM_SERVICE":
        return Utensils
      case "SPA":
        return Spa
      case "TRANSPORT":
        return Car
      default:
        return Utensils
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Guest Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Manage your bookings and explore our services.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard/guest/book">
            <Button>
              <Hotel className="mr-2 h-4 w-4" />
              Book a Room
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          {/* Welcome Card */}
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Crown Hotel</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Thank you for choosing Crown Hotel for your stay. We are committed to making your experience
                exceptional.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Hotel className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-semibold">Book a Room</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Browse and book from our selection of luxurious rooms
                    </p>
                    <Link href="/dashboard/guest/book" className="mt-2">
                      <Button variant="outline" size="sm">
                        View Rooms
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Calendar className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-semibold">My Bookings</h3>
                    <p className="text-sm text-muted-foreground mt-1">View and manage your current and past bookings</p>
                    <Link href="/dashboard/guest/bookings" className="mt-2">
                      <Button variant="outline" size="sm">
                        View Bookings
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Utensils className="h-8 w-8 text-primary mb-2" />
                    <h3 className="font-semibold">Hotel Services</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Explore and book additional services for your stay
                    </p>
                    <Link href="/dashboard/guest/services" className="mt-2">
                      <Button variant="outline" size="sm">
                        View Services
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Your Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">You don't have any upcoming bookings.</p>
                  <Link href="/dashboard/guest/book">
                    <Button>
                      <Hotel className="mr-2 h-4 w-4" />
                      Book a Room
                    </Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.id.substring(0, 8)}</TableCell>
                        <TableCell>
                          {booking.room.number} - {booking.room.type}
                        </TableCell>
                        <TableCell>{format(new Date(booking.checkIn), "MMM dd, yyyy")}</TableCell>
                        <TableCell>{format(new Date(booking.checkOut), "MMM dd, yyyy")}</TableCell>
                        <TableCell>ssp{booking.totalPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/guest/bookings/${booking.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Featured Services */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {mappedServices.length === 0 ? (
                  <div className="col-span-3 text-center py-6">
                    <p className="text-muted-foreground">No services available at the moment.</p>
                  </div>
                ) : (
                  mappedServices.slice(0, 3).map((service) => (
                    <Card key={service.id}>
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        {service.icon && <service.icon className="h-8 w-8 text-primary mb-2" />}
                        <h3 className="font-semibold">{service.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                        <Link
                          href={`/dashboard/guest/services#${service.name.toLowerCase().replace(/\s+/g, "-")}`}
                          className="mt-2"
                        >
                          <Button variant="outline" size="sm">
                            Learn More
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end mb-4">
                <Link href="/dashboard/guest/book">
                  <Button>
                    <Hotel className="mr-2 h-4 w-4" />
                    New Booking
                  </Button>
                </Link>
              </div>
              <Tabs defaultValue="upcoming">
                <TabsList>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="past">Past</TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming">
                  {upcomingBookings.length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">You don't have any upcoming bookings.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Booking ID</TableHead>
                          <TableHead>Room</TableHead>
                          <TableHead>Check In</TableHead>
                          <TableHead>Check Out</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {upcomingBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">{booking.id.substring(0, 8)}</TableCell>
                            <TableCell>
                              {booking.room.number} - {booking.room.type}
                            </TableCell>
                            <TableCell>{format(new Date(booking.checkIn), "MMM dd, yyyy")}</TableCell>
                            <TableCell>{format(new Date(booking.checkOut), "MMM dd, yyyy")}</TableCell>
                            <TableCell>ssp{booking.totalPrice.toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/dashboard/guest/bookings/${booking.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>
                <TabsContent value="past">
                  {bookings.filter((b) => b.status === "CHECKED_OUT" || b.status === "CANCELLED").length === 0 ? (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">You don't have any past bookings.</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Booking ID</TableHead>
                          <TableHead>Room</TableHead>
                          <TableHead>Check In</TableHead>
                          <TableHead>Check Out</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings
                          .filter((booking) => booking.status === "CHECKED_OUT" || booking.status === "CANCELLED")
                          .map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell className="font-medium">{booking.id.substring(0, 8)}</TableCell>
                              <TableCell>
                                {booking.room.number} - {booking.room.type}
                              </TableCell>
                              <TableCell>{format(new Date(booking.checkIn), "MMM dd, yyyy")}</TableCell>
                              <TableCell>{format(new Date(booking.checkOut), "MMM dd, yyyy")}</TableCell>
                              <TableCell>ssp{booking.totalPrice.toFixed(2)}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="icon" asChild>
                                  <Link href={`/dashboard/guest/bookings/${booking.id}`}>
                                    <Eye className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hotel Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Enhance your stay with our premium services. Book directly from your dashboard.
              </p>
              <div className="grid gap-6">
                {mappedServices.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No services available at the moment.</p>
                  </div>
                ) : (
                  mappedServices.map((service) => (
                    <Card key={service.id} id={service.name.toLowerCase().replace(/\s+/g, "-")}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            {service.icon && <service.icon className="h-6 w-6 text-primary" />}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold">{service.name}</h3>
                            <p className="text-muted-foreground mt-1">{service.description}</p>
                          </div>
                          <Button>Book Service</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

