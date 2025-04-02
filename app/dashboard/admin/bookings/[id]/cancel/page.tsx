import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import Link from "next/link"
import { getBookingById, cancelBooking } from "@/lib/actions/booking-actions"
import { redirect } from "next/navigation"
import { format } from "date-fns"

export default async function CancelBookingPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { success, data: booking, message } = await getBookingById(id)

  if (!success) {
    redirect("/dashboard/admin/bookings")
  }

  async function handleCancelBooking() {
    "use server"

    const result = await cancelBooking(id)

    if (result.success) {
      redirect("/dashboard/admin/bookings")
    } else {
      // In a real app, you would handle this error better
      console.error("Failed to cancel booking:", result.message)
      redirect(`/dashboard/admin/bookings/${id}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
            Cancel Booking
          </CardTitle>
          <CardDescription>Are you sure you want to cancel this booking?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Booking ID</p>
              <p>{booking.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p>{booking.status}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Guest</p>
              <p>{booking.user.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{booking.user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Room</p>
              <p>
                {booking.room.number} - {booking.room.type}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Price</p>
              <p>${booking.totalPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Check In</p>
              <p>{format(new Date(booking.checkIn), "PPP")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Check Out</p>
              <p>{format(new Date(booking.checkOut), "PPP")}</p>
            </div>
          </div>

          <div className="rounded-md bg-red-50 p-4 mt-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Warning</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Cancelling this booking will make the room available for other bookings. This action cannot be
                    undone. The guest will be notified of the cancellation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href={`/dashboard/admin/bookings/${id}`}>
            <Button variant="outline">Go Back</Button>
          </Link>
          <form action={handleCancelBooking}>
            <Button type="submit" variant="destructive">
              Cancel Booking
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

