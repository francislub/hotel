import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import BookingForm from "@/components/forms/booking-form"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function BookRoomPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Book a Room</h1>
        <p className="text-muted-foreground">Browse available rooms and make a reservation.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
          <CardDescription>
            Select your check-in and check-out dates, number of guests, and preferred room.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BookingForm userId={session.user.id} />
        </CardContent>
      </Card>
    </div>
  )
}

