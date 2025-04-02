import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { getBookingById, updateBookingStatus } from "@/lib/actions/booking-actions"
import { redirect } from "next/navigation"
import { BookingStatus } from "@prisma/client"
import { format } from "date-fns"

export default async function ConfirmBookingPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { success, data: booking, message } = await getBookingById(id)

  if (!success) {
    redirect("/dashboard/admin/bookings")
  }

  async function confirmBooking() {
    "use server"

    const result = await updateBookingStatus(id, BookingStatus.CONFIRMED)

    if (result.success) {
      redirect("/dashboard/admin/bookings")
    } else {
      // In a real app, you would handle this error better
      console.error("Failed to confirm booking:", result.message)
      redirect(`/dashboard/admin/bookings/${id}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            Confirm Booking
          </CardTitle>
          <CardDescription>Review the booking details before confirming</CardDescription>
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

          <div className="rounded-md bg-green-50 p-4 mt-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Confirmation</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    By confirming this booking, you are reserving the room for the guest and it will no longer be
                    available for other bookings during this period.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href={`/dashboard/admin/bookings/${id}`}>
            <Button variant="outline">Cancel</Button>
          </Link>
          <form action={confirmBooking}>
            <Button type="submit">Confirm Booking</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

